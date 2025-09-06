export interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  detailAddress: string;
  phone: string;
  mainItems: string;
  price: string;
  rating: number;
  distance: number;
  latitude: number;
  longitude: number;
  isScraped: boolean;
  reviews: Review[];
  lat: number; // 위도
  lng: number; // 경도
}

export interface User {
  id: string;
  password?: string;
  nickname: string;
}

export interface Review {
  id: string;
  storeId: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export const CATEGORIES = [
  '전체',
  '한식',
  '일식', 
  '중식',
  '양식',
  '이용업',
  '숙박업',
  '세탁업',
  '베이커리',
  '미용업',
  '목욕업',
  '기타요식업',
  '기타비요식업'
] as const;

export type Category = typeof CATEGORIES[number];