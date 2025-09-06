import { Store } from '../types/store';
import { fetchNearbyStores, NearbyStoresRequest } from './api';
import { mapApiStoresToStores } from '../utils/storeMapper';

// 사용자 위치 기반 근처 가게 검색 서비스
export const getNearbyStores = async (
  userLocation: { lat: number; lng: number },
  options: {
    limit?: number;
    radiusKm?: number;
  } = {}
): Promise<Store[]> => {
  const { limit = 10, radiusKm = 5 } = options;

  const request: NearbyStoresRequest = {
    latitude: userLocation.lat,
    longitude: userLocation.lng,
    limit,
    radiusKm,
  };

  try {
    const response = await fetchNearbyStores(request);
    
    if (!response.isSuccess) {
      throw new Error(response.message || 'API 요청 실패');
    }

    // API 응답을 앱 내부 Store 타입으로 변환
    const stores = mapApiStoresToStores(response.result.stores);
    
    // 거리순으로 정렬 (이미 API에서 정렬되어 오지만 안전하게 한번 더)
    return stores.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('근처 가게 검색 실패:', error);
    // 에러 발생 시 빈 배열 반환 (사용자 경험 향상)
    return [];
  }
};

// 카테고리별 필터링 함수 (클라이언트 사이드)
export const filterStoresByCategory = (stores: Store[], category: string): Store[] => {
  if (category === '전체') {
    return stores;
  }
  return stores.filter(store => store.category === category);
};
