import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Star } from "lucide-react";
import { Store, Review } from "../types/store";

interface ReviewModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (storeId: string, review: Omit<Review, 'id' | 'storeId' | 'createdAt'>) => void;
}

export function ReviewModal({ store, isOpen, onClose, onSubmitReview }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!store || !author.trim() || !content.trim()) return;
    
    onSubmitReview(store.id, {
      author: author.trim(),
      rating,
      content: content.trim()
    });
    
    // 폼 초기화
    setRating(5);
    setAuthor("");
    setContent("");
    onClose();
  };

  const renderStars = (currentRating: number, onStarClick: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onStarClick(i + 1)}
        className="p-1"
      >
        <Star
          className={`w-6 h-6 ${i < currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
        />
      </button>
    ));
  };

  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{store.name} 리뷰 작성</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>평점</Label>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(rating, setRating)}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating}점
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="author">작성자</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="이름을 입력하세요"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="content">리뷰 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="가게에 대한 솔직한 후기를 남겨주세요"
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          {store.reviews.length > 0 && (
            <div>
              <Label>기존 리뷰 ({store.reviews.length}개)</Label>
              <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
                {store.reviews.map((review) => (
                  <div key={review.id} className="p-3 bg-gray-50 rounded text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{review.author}</span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p>{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!author.trim() || !content.trim()}
            >
              리뷰 등록
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}