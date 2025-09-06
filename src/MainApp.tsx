// App.tsx

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CategoryFilter } from "./components/CategoryFilter";
import { MapView } from "./components/MapView";
import { StoreList } from "./components/StoreList";
import { ReviewModal } from "./components/ReviewModal";
import { LoginModal } from "./components/LoginModal";
import { IntroPage } from "./components/IntroPage";
import { ScrapListPage } from "./components/ScrapListPage";
import { mockStores } from "./data/mockStores";
import { Store, Review, Category, User } from "./types/store";
import { toast, Toaster } from "sonner";
import { getNearbyStores, filterStoresByCategory } from "./services/storeService";

// =================================================================
// 1. [추가] 두 좌표 간의 거리를 계산하는 헬퍼 함수
// =================================================================
const getDistanceFromLatLonInKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // 최종 거리 (km)
  return d;
}

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'intro' | 'map' | 'scrap'>('intro');
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체');
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 위치 정보 가져오기 (기존 코드)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("현재 위치를 찾았습니다!");
        },
        (error) => {
          console.log("위치 정보를 가져올 수 없습니다:", error);
          setUserLocation({ lat: 37.5665, lng: 126.9780 });
          toast.info("기본 위치(서울 시청)로 설정되었습니다.");
        }
      );
    }
  }, []);

  // 사용자 위치가 확정되면 근처 가게 데이터 가져오기
  useEffect(() => {
    const fetchStores = async () => {
      if (!userLocation) return;
      
      try {
        const nearbyStores = await getNearbyStores(userLocation, {
          limit: 50, // 더 많은 가게 데이터 가져오기
          radiusKm: 10 // 10km 반경 내 검색
        });
        
        setStores(nearbyStores);
        
        if (nearbyStores.length > 0) {
          toast.success(`근처 가게 ${nearbyStores.length}개를 찾았습니다!`);
        } else {
          toast.info("근처에 등록된 가게가 없습니다.");
          // 에러 발생 시 목업 데이터로 폴백
          setStores(mockStores);
        }
      } catch (error) {
        console.error('가게 데이터 로드 실패:', error);
        toast.error("가게 정보를 불러오는데 실패했습니다. 기본 데이터를 표시합니다.");
        // 에러 발생 시 목업 데이터로 폴백
        setStores(mockStores);
      }
    };

    fetchStores();
  }, [userLocation]);

  // 카테고리별 가게 필터링 (API 서비스 함수 사용)
  const filteredStores = filterStoresByCategory(stores, selectedCategory);

  // 거리순 정렬 (이미 API에서 정렬되어 오지만 안전하게 한번 더)
  const sortedStores = filteredStores.sort((a, b) => a.distance - b.distance);

  const scrapedStores = stores.filter(store => store.isScraped);

  // 스크랩 토글
  const handleScrapToggle = (storeUsername: string) => {
    setStores(prev => prev.map(store =>
      store.username === storeUsername
        ? { ...store, isScraped: !store.isScraped }
        : store
    ));

    const store = stores.find(s => s.username === storeUsername);
    if (store) {
      toast.success(
        store.isScraped
          ? `${store.name}을(를) 스크랩에서 제거했습니다.`
          : `${store.name}을(를) 스크랩했습니다.`
      );
    }
  };

  const handleShowLocation = (store: Store) => {
    toast.info(`${store.name}의 위치를 지도에 표시합니다.`);
  };

  // 리뷰 작성 모달 열기
  const handleWriteReview = (store: Store) => {
    if (!isLoggedIn) {
      toast.error("리뷰를 작성하려면 로그인이 필요합니다.");
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedStore(store);
    setIsReviewModalOpen(true);
  };

  // 리뷰 제출
  const handleSubmitReview = (storeUsername: string, reviewContent: { rating: number; content: string; }) => {
    if (!currentUser) {
      toast.error("리뷰를 등록하려면 로그인이 필요합니다.");
      setIsLoginModalOpen(true);
      return;
    }

    const newReview: Review = {
      username: currentUser.username,
      author: currentUser.nickname,
      rating: reviewContent.rating,
      content: reviewContent.content,
      storeId: storeUsername,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStores(prev => prev.map(store =>
      store.username === storeUsername
        ? {
          ...store,
          reviews: [...store.reviews, newReview],
          rating: calculateNewRating([...store.reviews, newReview])
        }
        : store
    ));

    toast.success("리뷰가 등록되었습니다!");
  };


  const calculateNewRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  // =================================================================
  // 2. [수정] 탭 변경 핸들러
  // 'map' 탭은 로그인 없이 접근 가능하도록 조건 변경
  // =================================================================
  const handleTabChange = (tab: 'intro' | 'map' | 'scrap') => {
    // 'scrap' 탭에 접근할 때만 로그인이 되어있는지 확인합니다.
    if (tab === 'scrap' && !isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    toast.success(`${user.nickname}님, 환영합니다!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('intro');
    toast.success("로그아웃되었습니다.");
  };

  // 회원가입 핸들러
  const handleSignUp = (userData: User) => {
    const newUser: User = userData;
    setUsers(prev => [...prev, newUser]);
    toast.success("회원가입이 완료되었습니다!");
  };

  const handleLoginAndNavigate = (user: User) => {
    handleLogin(user);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLoggedIn={isLoggedIn}
        userNickname={currentUser?.nickname}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      {activeTab === 'intro' && <IntroPage />}

      {activeTab === 'map' && (
        <>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="w-full px-6 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-6">
                <div>
                  <MapView
                    stores={sortedStores}
                    userLocation={userLocation}
                    onStoreSelect={handleWriteReview}
                  />
                </div>
                <div>
                  <StoreList
                    stores={sortedStores}
                    onScrapToggle={handleScrapToggle}
                    onShowLocation={handleShowLocation}
                    onWriteReview={handleWriteReview}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'scrap' && (
        <ScrapListPage
          scrapedStores={scrapedStores}
          onScrapToggle={handleScrapToggle}
          onShowLocation={handleShowLocation}
          onWriteReview={handleWriteReview}
        />
      )}

      <ReviewModal
        store={selectedStore}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmitReview={handleSubmitReview}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginAndNavigate}
        onSignUp={handleSignUp}
      />

      <Toaster position="top-right" />
    </div>
  );
}