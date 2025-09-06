import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Star, Phone, MapPin, Clock, Edit3, Heart, HeartOff } from "lucide-react";
import { StoreDetailResponse, fetchStoreDetail } from "../services/api";
import { toast } from "sonner";

interface StoreDetailModalProps {
  storeId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onWriteReview: (storeId: number) => void;
  onFavoriteToggle: (storeId: string) => void;
  isLoggedIn: boolean;
  isFavorite: boolean;
}

export function StoreDetailModal({ 
  storeId, 
  isOpen, 
  onClose, 
  onWriteReview, 
  onFavoriteToggle,
  isLoggedIn,
  isFavorite
}: StoreDetailModalProps) {
  const [storeDetail, setStoreDetail] = useState<StoreDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStoreDetail = async () => {
      if (!storeId) return;
      
      setLoading(true);
      try {
        const response = await fetchStoreDetail(storeId);
        if (response.isSuccess) {
          setStoreDetail(response.result);
        } else {
          toast.error("업소 정보를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error('Store detail fetch error:', error);
        toast.error("업소 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && storeId) {
      loadStoreDetail();
    }
  }, [isOpen, storeId]);

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      toast.error("리뷰를 작성하려면 로그인이 필요합니다.");
      return;
    }
    
    if (storeDetail) {
      onWriteReview(storeDetail.storeId);
      onClose();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : storeDetail ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  {storeDetail.storeName}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFavoriteToggle(storeDetail.storeId.toString())}
                  className="p-2"
                  title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                >
                  {isFavorite ? (
                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                  ) : (
                    <HeartOff className="w-6 h-6 text-gray-400 hover:text-red-400" />
                  )}
                </Button>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{storeDetail.categoryDescription}</Badge>
                  {storeDetail.majorCategory && (
                    <Badge variant="outline">{storeDetail.majorCategory}</Badge>
                  )}
                  {storeDetail.subCategory && (
                    <Badge variant="outline">{storeDetail.subCategory}</Badge>
                  )}
                </div>
                
                {/* 평점 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(storeDetail.reviewSummary.averageRating)}
                  </div>
                  <span className="font-medium">
                    {storeDetail.reviewSummary.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({storeDetail.reviewSummary.reviewCount}개 리뷰)
                  </span>
                </div>
              </div>

              <Separator />

              {/* 연락처 및 주소 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{storeDetail.contactNumber}</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p>{storeDetail.address.fullAddress}</p>
                    <p className="text-sm text-muted-foreground">
                      {storeDetail.address.sido} {storeDetail.address.sigun}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 메뉴 */}
              {storeDetail.menus && storeDetail.menus.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">메뉴</h3>
                    <div className="space-y-2">
                      {storeDetail.menus
                        .sort((a, b) => a.menuOrder - b.menuOrder)
                        .map((menu) => (
                          <div 
                            key={menu.menuId} 
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium">{menu.menuName}</span>
                            <span className="text-primary font-semibold">
                              {formatPrice(menu.price)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <Separator />
                </>
              )}

              {/* 최근 리뷰 */}
              {storeDetail.reviewSummary.topReviews && storeDetail.reviewSummary.topReviews.length > 0 && (
                <>
                  <div>
                    <h3 className="font-semibold mb-3">최근 리뷰</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {storeDetail.reviewSummary.topReviews.map((review) => (
                        <div key={review.reviewId} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.memberNickname}</span>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm ml-1">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{review.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                </>
              )}

              {/* 업소 정보 */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>등록일: {formatDate(storeDetail.createdDate)}</span>
                </div>
                {storeDetail.lastModifiedDate !== storeDetail.createdDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>수정일: {formatDate(storeDetail.lastModifiedDate)}</span>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  닫기
                </Button>
                <Button 
                  onClick={handleWriteReview} 
                  className="flex-1"
                  disabled={!isLoggedIn}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  리뷰 작성
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">업소 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
