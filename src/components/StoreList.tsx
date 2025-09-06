import { Store } from "../types/store";
import { StoreCard } from "./StoreCard";

interface StoreListProps {
  stores: Store[];
  onScrapToggle: (storeId: string) => void;
  onFavoriteToggle: (storeId: string) => void;
  onShowLocation: (store: Store) => void;
  onWriteReview: (store: Store) => void;
}

export function StoreList({ stores, onScrapToggle, onFavoriteToggle, onShowLocation, onWriteReview }: StoreListProps) {
  if (stores.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-muted-foreground">
          <p>해당 카테고리에 가게가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3>가까운 가게 ({stores.length}개)</h3>
        <p className="text-sm text-muted-foreground">거리순 정렬</p>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onScrapToggle={onScrapToggle}
            onFavoriteToggle={onFavoriteToggle}
            onShowLocation={onShowLocation}
            onWriteReview={onWriteReview}
          />
        ))}
      </div>
    </div>
  );
}