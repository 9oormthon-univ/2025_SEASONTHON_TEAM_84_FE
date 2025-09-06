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
    // kakao 객체와 userLocation이 모두 준비되었는지 확인
    if (!window.kakao || !userLocation || !mapRef.current) {
      return;
    }

    // kakao.maps.load() 함수를 사용하여 지도 라이브러리 로드 보장
    window.kakao.maps.load(() => {
      const { kakao } = window;
      
      // 지도 생성
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
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

        kakao.maps.event.addListener(marker, 'click', () => {
          onStoreSelect(store);
        });
        marker.setMap(map);
      });

      // 지도 컨트롤
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    });

    // 컴포넌트 언마운트 시 지도 컨테이너 초기화
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
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