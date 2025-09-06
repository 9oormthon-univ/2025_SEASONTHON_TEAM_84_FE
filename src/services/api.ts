// API 클라이언트 설정
// 개발/배포 환경에 따라 API_BASE_URL을 수정하세요
const API_BASE_URL = 'https://qualified-swordtail-goormhack84-4dc9e8b7.koyeb.app';

// API 요청/응답 타입 정의
export interface NearbyStoresRequest {
  latitude: number;
  longitude: number;
  limit: number;
  radiusKm: number;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T;
}

export interface ApiAddress {
  sido: string;
  sigun: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface ApiMenu {
  menuId: number;
  menuName: string;
  price: number;
  menuOrder: number;
}

export interface ApiReview {
  reviewId: number;
  storeId: number;
  storeName: string;
  memberId: number;
  memberNickname: string;
  rating: number;
  content: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface ApiReviewSummary {
  averageRating: number;
  reviewCount: number;
  topReviews: ApiReview[];
}

export interface ApiStore {
  storeId: number;
  storeName: string;
  category: string;
  categoryDescription: string;
  contactNumber: string;
  address: ApiAddress;
  menus: ApiMenu[];
  distanceKm: number;
  reviewSummary: ApiReviewSummary;
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
}

export interface NearbyStoresResponse {
  userLatitude: number;
  userLongitude: number;
  stores: ApiStore[];
  totalCount: number;
  maxDistanceKm: number;
}

// Store 상세 조회 응답 타입
export interface StoreDetailResponse {
  storeId: number;
  storeName: string;
  category: string;
  categoryDescription: string;
  majorCategory?: string;
  subCategory?: string;
  contactNumber: string;
  address: ApiAddress;
  menus: ApiMenu[];
  reviewSummary: ApiReviewSummary;
  createdDate: string;
  lastModifiedDate: string;
  active: boolean;
}

// 리뷰 작성 요청 타입
export interface CreateReviewRequest {
  storeId: number;
  rating: number;
  content: string;
}

// 리뷰 작성 응답 타입
export interface CreateReviewResponse {
  reviewId: number;
  reviewInfo: ApiReview;
}

// API 클라이언트 함수
export const fetchNearbyStores = async (request: NearbyStoresRequest): Promise<ApiResponse<NearbyStoresResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/search/nearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};

// Store 상세 정보 조회
export const fetchStoreDetail = async (storeId: number): Promise<ApiResponse<StoreDetailResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Store 상세 조회 실패:', error);
    throw error;
  }
};

// 리뷰 작성
export const createReview = async (request: CreateReviewRequest, authToken?: string): Promise<ApiResponse<CreateReviewResponse>> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 인증 토큰이 있는 경우 헤더에 추가
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
    throw error;
  }
};
