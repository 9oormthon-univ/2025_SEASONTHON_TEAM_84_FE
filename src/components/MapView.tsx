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
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !userLocation || !window.kakao) return;

    const { kakao } = window;

    // 지도 생성
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      level: 5, // 지도 확대 레벨
    });

    // 사용자 위치 마커
    const userMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
      image: new kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new kakao.maps.Size(24, 35)
      ),
    });
    userMarker.setMap(map);

    // 가게 마커
    stores.forEach((store) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(store.lat, store.lng),
        clickable: true,
      });

      // 마커 클릭 시 onStoreSelect 호출
      kakao.maps.event.addListener(marker, 'click', () => {
        onStoreSelect(store);
      });

      marker.setMap(map);
    });

    // 지도 컨트롤 (줌 컨트롤)
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    return () => {
      // 마운트 해제 시 지도 초기화
      mapRef.current!.innerHTML = '';
    };
  }, [userLocation, stores, onStoreSelect]);

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg border border-border relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
      ></div>
    </div>
  );
}
