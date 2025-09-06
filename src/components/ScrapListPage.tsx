import { Store } from "../types/store";
import { StoreCard } from "./StoreCard";

interface ScrapListPageProps {
  scrapedStores: Store[];
  onScrapToggle: (storeId: string) => void;
  onFavoriteToggle: (storeId: string) => void;
  onShowLocation: (store: Store) => void;
  onWriteReview: (store: Store) => void;
}

export function ScrapListPage({ 
  scrapedStores, 
  onScrapToggle, 
  onFavoriteToggle,
  onShowLocation, 
  onWriteReview 
}: ScrapListPageProps) {
  if (scrapedStores.length === 0) {
    return (
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">스크랩한 가게</h1>
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg mb-2">아직 스크랩한 가게가 없습니다</p>
              <p>마음에 드는 가게를 스크랩해보세요!</p>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">스크랩한 가게</h1>
          <p className="text-muted-foreground">
            총 {scrapedStores.length}개의 가게를 스크랩했습니다
          </p>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {scrapedStores.map((store) => (
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
      </div>
    </div>
  );
}