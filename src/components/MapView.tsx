import { useEffect, useRef } from 'react';
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
  const storeMarkersRef = useRef<any[]>([]); // 가게 마커들을 담을 ref

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
    });
  }, []); // 의존성 배열을 비워서 최초 렌더링 시에만 실행되도록 함

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

  // 3. 가게 목록이 변경되면 마커를 새로 표시
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao) return;

    const { kakao } = window;
    
    // 기존 마커들 제거
    storeMarkersRef.current.forEach(marker => marker.setMap(null));
    storeMarkersRef.current = [];

    // 새로운 마커들 생성 및 표시
    const newMarkers = stores.map((store) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.lat, store.lng),
        clickable: true,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        onStoreSelect(store);
      });

      marker.setMap(mapInstanceRef.current);
      return marker;
    });

    // 새로 생성된 마커들을 ref에 저장
    storeMarkersRef.current = newMarkers;
  }, [stores, onStoreSelect]); // onStoreSelect가 변경될 경우 이벤트 리스너를 다시 등록하기 위해 포함

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg border border-border relative">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg"
      ></div>
    </div>
  );
}