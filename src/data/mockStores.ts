import { Store } from '../types/store';

export const mockStores: Store[] = [
  {
    id: '1',
    name: '할머니네 김치찌개',
    category: '한식',
    address: '서울시 강남구 테헤란로',
    detailAddress: '123-45 1층',
    phone: '02-1234-5678',
    mainItems: '김치찌개, 된장찌개, 불고기',
    price: '8,000 ~ 15,000원',
    rating: 4.5,
    distance: 150,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: false,
    reviews: [
      {
        id: 'r1',
        storeId: '1',
        author: '김철수',
        rating: 5,
        content: '정말 맛있어요! 김치찌개가 진짜 끝내줍니다.',
        createdAt: '2024-01-15'
      }
    ]
  },
  {
    id: '2',
    name: '스시야마',
    category: '일식',
    address: '서울시 강남구 역삼동',
    detailAddress: '678-90 지하1층',
    phone: '02-2345-6789',
    mainItems: '초밥, 사시미, 우동',
    price: '25,000 ~ 50,000원',
    rating: 4.8,
    distance: 320,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: true,
    reviews: [
      {
        id: 'r2',
        storeId: '2',
        author: '이영희',
        rating: 5,
        content: '신선한 회와 정성스러운 서비스가 인상적입니다.',
        createdAt: '2024-01-12'
      },
      {
        id: 'r3',
        storeId: '2',
        author: '박민수',
        rating: 4,
        content: '가격대비 괜찮은 퀄리티예요.',
        createdAt: '2024-01-10'
      }
    ]
  },
  {
    id: '3',
    name: '베이징반점',
    category: '중식',
    address: '서울시 강남구 삼성동',
    detailAddress: '234-56 2층',
    phone: '02-3456-7890',
    mainItems: '짜장면, 짬뽕, 탕수육',
    price: '6,000 ~ 20,000원',
    rating: 4.2,
    distance: 450,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: false,
    reviews: []
  },
  {
    id: '4',
    name: '이탈리아노',
    category: '양식',
    address: '서울시 강남구 청담동',
    detailAddress: '345-67 1층',
    phone: '02-4567-8901',
    mainItems: '파스타, 피자, 리조또',
    price: '15,000 ~ 35,000원',
    rating: 4.6,
    distance: 680,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: true,
    reviews: [
      {
        id: 'r4',
        storeId: '4',
        author: '최유진',
        rating: 5,
        content: '정통 이탈리아 맛이에요! 분위기도 좋습니다.',
        createdAt: '2024-01-08'
      }
    ]
  },
  {
    id: '5',
    name: '헤어살롱 뷰티',
    category: '미용업',
    address: '서울시 강남구 논현동',
    detailAddress: '456-78 3층',
    phone: '02-5678-9012',
    mainItems: '컷, 펌, 염색',
    price: '30,000 ~ 150,000원',
    rating: 4.4,
    distance: 520,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: false,
    reviews: [
      {
        id: 'r5',
        storeId: '5',
        author: '정수미',
        rating: 4,
        content: '실력 좋은 디자이너분이 계세요.',
        createdAt: '2024-01-05'
      }
    ]
  },
  {
    id: '6',
    name: '파리바게뜨',
    category: '베이커리',
    address: '서울시 강남구 도곡동',
    detailAddress: '567-89 1층',
    phone: '02-6789-0123',
    mainItems: '빵, 케이크, 커피',
    price: '2,000 ~ 30,000원',
    rating: 4.0,
    distance: 280,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: false,
    reviews: []
  },
  {
    id: '7',
    name: '클린세탁소',
    category: '세탁업',
    address: '서울시 강남구 개포동',
    detailAddress: '678-90 1층',
    phone: '02-7890-1234',
    mainItems: '드라이클리닝, 셔츠세탁, 수선',
    price: '3,000 ~ 20,000원',
    rating: 4.3,
    distance: 720,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: true,
    reviews: [
      {
        id: 'r6',
        storeId: '7',
        author: '김영수',
        rating: 4,
        content: '빠르고 깔끔하게 처리해주세요.',
        createdAt: '2024-01-03'
      }
    ]
  },
  {
    id: '8',
    name: '호텔 그랜드',
    category: '숙박업',
    address: '서울시 강남구 역삼동',
    detailAddress: '789-01 전층',
    phone: '02-8901-2345',
    mainItems: '객실, 컨퍼런스, 레스토랑',
    price: '100,000 ~ 500,000원',
    rating: 4.7,
    distance: 890,
    latitude: 37.5665,
    longitude: 126.9780,
    isScraped: false,
    reviews: [
      {
        id: 'r7',
        storeId: '8',
        author: '이지은',
        rating: 5,
        content: '깨끗하고 서비스가 훌륭합니다.',
        createdAt: '2024-01-01'
      }
    ]
  }
];