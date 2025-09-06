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
  const mapContainerRef = useRef<HTMLDivElement>(null); // 지도를 담을 div의 ref
  const mapInstanceRef = useRef<any>(null); // 생성된 지도 인스턴스를 담을 ref
  const userMarkerRef = useRef<any>(null); // 사용자 위치 마커를 담을 ref
  const storeMarkersRef = useRef<Map<string, any>>(new Map()); // 가게 마커들을 Map으로 관리
  const isMapReadyRef = useRef<boolean>(false); // 지도 준비 상태

  // 스토어 선택 핸들러 메모이제이션
  const handleStoreSelect = useCallback((store: Store) => {
    onStoreSelect(store);
  }, [onStoreSelect]);

  // 스토어 데이터 메모이제이션 (성능 최적화)
  const memoizedStores = useMemo(() => stores, [stores]);

  // 1. 지도 생성 (최초 한 번만 실행)
  useEffect(() => {
    if (!window.kakao || !userLocation || !mapContainerRef.current) return;

    window.kakao.maps.load(() => {
      const { kakao } = window;
      const mapOption = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      };

      // 지도 인스턴스 생성 및 ref에 저장
      const map = new kakao.maps.Map(mapContainerRef.current, mapOption);
      mapInstanceRef.current = map;

      // 지도 컨트롤 추가
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      // 사용자 위치 마커 생성 및 ref에 저장
      const userMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        image: new kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new kakao.maps.Size(24, 35)
        ),
      });
      userMarker.setMap(map);
      userMarkerRef.current = userMarker;
      
      // 지도 준비 완료 표시
      isMapReadyRef.current = true;
    });
  }, [userLocation]); // userLocation이 변경될 때만 재실행

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

  // 3. 가게 목록이 변경되면 마커를 효율적으로 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !isMapReadyRef.current) return;

    const { kakao } = window;
    const currentMarkers = storeMarkersRef.current;
    
    // 현재 스토어 ID 세트
    const currentStoreIds = new Set(memoizedStores.map(store => store.id));
    
    // 1. 더 이상 존재하지 않는 마커들 제거
    for (const [storeId, marker] of currentMarkers.entries()) {
      if (!currentStoreIds.has(storeId)) {
        marker.setMap(null);
        currentMarkers.delete(storeId);
      }
    }

    // 2. 새로운 스토어들의 마커 생성
    memoizedStores.forEach((store) => {
      if (!currentMarkers.has(store.id)) {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(store.lat, store.lng),
          clickable: true,
        });

        // 클릭 이벤트 리스너 추가
        kakao.maps.event.addListener(marker, 'click', () => {
          handleStoreSelect(store);
        });

        // 지도에 마커 표시
        marker.setMap(mapInstanceRef.current);
        
        // Map에 마커 저장
        currentMarkers.set(store.id, marker);
      }
    });
  }, [memoizedStores, handleStoreSelect]); // 최적화된 의존성

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg border border-border relative">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg"
      ></div>
    </div>
  );
}