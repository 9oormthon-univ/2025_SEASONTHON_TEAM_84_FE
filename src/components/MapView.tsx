import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Store } from '../types/store';

interface MapViewProps {
  stores: Store[];
  userLocation: { lat: number; lng: number } | null;
  onStoreSelect: (store: Store) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function MapView({ stores, userLocation, onStoreSelect }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const storeMarkersRef = useRef<Map<string, any>>(new Map());
  const isMapReadyRef = useRef<boolean>(false);
  const pendingStoresRef = useRef<Store[]>([]); // 지도 준비 전 대기 중인 stores

  // 스토어 선택 핸들러 메모이제이션
  const handleStoreSelect = useCallback((store: Store) => {
    onStoreSelect(store);
  }, [onStoreSelect]);

  // 마커 생성 함수 (최적화)
  const createMarkers = useCallback((storesToCreate: Store[]) => {
    if (!mapInstanceRef.current || !window.kakao || !isMapReadyRef.current) {
      pendingStoresRef.current = storesToCreate;
      return;
    }

    const { kakao } = window;
    const currentMarkers = storeMarkersRef.current;
    
    // 현재 스토어 ID 세트
    const currentStoreIds = new Set(storesToCreate.map(store => store.id));
    
    // 1. 더 이상 존재하지 않는 마커들 제거
    for (const [storeId, marker] of currentMarkers.entries()) {
      if (!currentStoreIds.has(storeId)) {
        marker.setMap(null);
        currentMarkers.delete(storeId);
      }
    }

    // 2. 새로운 스토어들의 마커 일괄 생성
    const markersToAdd = storesToCreate.filter(store => !currentMarkers.has(store.id));
    
    markersToAdd.forEach((store) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.lat, store.lng),
        clickable: true,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        handleStoreSelect(store);
      });

      marker.setMap(mapInstanceRef.current);
      currentMarkers.set(store.id, marker);
    });

    // 대기 중인 stores 초기화
    pendingStoresRef.current = [];
  }, [handleStoreSelect]);

  // 1. 지도 생성 (최초 한 번만 실행)
  useEffect(() => {
    if (!window.kakao || !userLocation || !mapContainerRef.current) return;

    window.kakao.maps.load(() => {
      const { kakao } = window;
      const mapOption = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      };

      // 지도 인스턴스 생성
      const map = new kakao.maps.Map(mapContainerRef.current, mapOption);
      mapInstanceRef.current = map;

      // 지도 컨트롤 추가
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      // 사용자 위치 마커 생성
      const userMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 35)
        ),
      });
      userMarker.setMap(map);
      userMarkerRef.current = userMarker;
      
      // 지도 준비 완료 후 대기 중인 stores 처리
      isMapReadyRef.current = true;
      
      // 대기 중인 stores가 있으면 즉시 마커 생성
      if (pendingStoresRef.current.length > 0) {
        createMarkers(pendingStoresRef.current);
      }
    });
  }, [userLocation, createMarkers]);

  // 2. 사용자 위치가 변경되면 지도 중심과 마커 위치를 이동
  useEffect(() => {
    if (!mapInstanceRef.current || !userMarkerRef.current || !userLocation) return;

    const { kakao } = window;
    const newPosition = new kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    // 지도 중심 이동
    mapInstanceRef.current.setCenter(newPosition);
    // 사용자 마커 위치 이동
    userMarkerRef.current.setPosition(newPosition);
  }, [userLocation]);

  // 3. stores가 변경되면 마커 업데이트
  useEffect(() => {
    createMarkers(stores);
  }, [stores, createMarkers]);

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg border border-border relative">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg"
      ></div>
    </div>
  );
}