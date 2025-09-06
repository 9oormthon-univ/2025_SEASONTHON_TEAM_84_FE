import { Store, Review } from '../types/store';
import { ApiStore, ApiReview } from '../services/api';

// API 응답을 앱 내부 Store 타입으로 변환하는 함수
export const mapApiStoreToStore = (apiStore: ApiStore): Store => {
  // API 리뷰를 앱 리뷰 타입으로 변환
  const mapApiReviewToReview = (apiReview: ApiReview): Review => ({
    id: apiReview.reviewId.toString(),
    storeId: apiReview.storeId.toString(),
    author: apiReview.memberNickname,
    rating: apiReview.rating,
    content: apiReview.content,
    createdAt: new Date(apiReview.createdDate).toISOString().split('T')[0],
  });

  // 메뉴 정보를 문자열로 변환
  const mainItems = apiStore.menus
    .sort((a, b) => a.menuOrder - b.menuOrder)
    .map(menu => menu.menuName)
    .slice(0, 3) // 상위 3개만 표시
    .join(', ');

  // 가격대 계산 (메뉴 중 최저가 ~ 최고가)
  const prices = apiStore.menus.map(menu => menu.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = prices.length > 0 
    ? `${minPrice.toLocaleString()}원 ~ ${maxPrice.toLocaleString()}원`
    : '가격 정보 없음';

  return {
    id: apiStore.storeId.toString(),
    username: apiStore.storeId.toString(), // 기존 호환성을 위해 id와 동일하게 설정
    name: apiStore.storeName,
    category: apiStore.categoryDescription,
    address: apiStore.address.sido + ' ' + apiStore.address.sigun,
    detailAddress: apiStore.address.fullAddress,
    phone: apiStore.contactNumber,
    mainItems: mainItems || '메뉴 정보 없음',
    price: priceRange,
    rating: apiStore.reviewSummary.averageRating,
    distance: Math.round(apiStore.distanceKm * 1000), // km를 m로 변환
    latitude: apiStore.address.latitude,
    longitude: apiStore.address.longitude,
    lat: apiStore.address.latitude, // MapView에서 사용하는 필드
    lng: apiStore.address.longitude, // MapView에서 사용하는 필드
    isScraped: false, // 기본값, 실제로는 사용자별 스크랩 상태를 별도 관리
    isFavorite: false, // 기본값, 실제로는 사용자별 즐겨찾기 상태를 별도 관리
    reviews: apiStore.reviewSummary.topReviews.map(mapApiReviewToReview),
  };
};

// 여러 API Store를 변환하는 헬퍼 함수
export const mapApiStoresToStores = (apiStores: ApiStore[]): Store[] => {
  return apiStores.map(mapApiStoreToStore);
};
