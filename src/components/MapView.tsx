// src/components/MapView.tsx

import { useEffect, useRef, useState } from 'react';
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // 이미 kakao 객체가 로드되었는지 확인
    if (window.kakao && window.kakao.maps && !isMapLoaded) {
      setIsMapLoaded(true);
      return;
    }

    // kakao 객체가 로드되지 않았다면 스크립트 동적 로딩
    if (!window.kakao && !isMapLoaded) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=58d78f68d5e7fc7acab9d3dff9ccd0c4&libraries=services`;
      script.onload = () => {
        // 스크립트 로딩 완료 후 상태 변경
        setIsMapLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, [isMapLoaded]);

  useEffect(() => {
    // 스크립트 로딩 완료, userLocation, stores 데이터가 있을 때만 실행
    if (!mapRef.current || !userLocation || !isMapLoaded) return;

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

    return () => {
      mapRef.current!.innerHTML = '';
    };
  }, [userLocation, stores, isMapLoaded, onStoreSelect]);

  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg border border-border relative">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
      ></div>
    </div>
  );
}