import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, MapPin, Phone, Heart, HeartOff, Bookmark, BookmarkCheck } from "lucide-react";
import { Store } from "../types/store";

interface StoreCardProps {
  store: Store;
  onScrapToggle: (storeId: string) => void;
  onFavoriteToggle: (storeId: string) => void;
  onShowLocation: (store: Store) => void;
  onWriteReview: (store: Store) => void;
}

export function StoreCard({ store, onScrapToggle, onFavoriteToggle, onShowLocation, onWriteReview }: StoreCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => onWriteReview(store)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{store.name}</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {store.category}
            </Badge>
          </div>
          <div className="flex gap-1">
            {/* 즐겨찾기 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(store.id);
              }}
              className="p-2"
              title={store.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              {store.isFavorite ? (
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              ) : (
                <HeartOff className="w-5 h-5 text-gray-400 hover:text-red-400" />
              )}
            </Button>
            {/* 스크랩 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onScrapToggle(store.id);
              }}
              className="p-2"
              title={store.isScraped ? "스크랩 해제" : "스크랩 추가"}
            >
              {store.isScraped ? (
                <BookmarkCheck className="w-5 h-5 fill-blue-500 text-blue-500" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-blue-400" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(store.rating)}
            <span className="ml-2 text-sm text-muted-foreground">
              {store.rating.toFixed(1)} ({store.reviews.length}개 리뷰)
            </span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p>{store.address}</p>
              <p className="text-muted-foreground">{store.detailAddress}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{store.phone}</span>
          </div>
          
          <div className="pt-1">
            <p><span className="font-medium">주요품목:</span> {store.mainItems}</p>
            <p><span className="font-medium">가격대:</span> {store.price}</p>
            <p className="text-muted-foreground">거리: {store.distance}m</p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onShowLocation(store);
            }}
            className="flex-1"
          >
            <MapPin className="w-4 h-4 mr-1" />
            위치보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}