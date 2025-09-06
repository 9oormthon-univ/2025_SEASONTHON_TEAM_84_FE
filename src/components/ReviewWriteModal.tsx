import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star } from "lucide-react";
import { createReview, CreateReviewRequest } from "../services/api";
import { toast } from "sonner";

interface ReviewWriteModalProps {
  storeId: number | null;
  storeName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void; // 리뷰 작성 후 콜백
  authToken?: string; // 인증 토큰
}

export function ReviewWriteModal({ 
  storeId, 
  storeName,
  isOpen, 
  onClose, 
  onReviewSubmitted,
  authToken
}: ReviewWriteModalProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!storeId || !content.trim()) {
      toast.error("평점과 리뷰 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const request: CreateReviewRequest = {
        storeId,
        rating,
        content: content.trim()
      };

      const response = await createReview(request, authToken);
      
      if (response.isSuccess) {
        toast.success("리뷰가 성공적으로 등록되었습니다!");
        
        // 폼 초기화
        setRating(5);
        setContent("");
        
        // 콜백 실행 (상세 정보 새로고침 등)
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        
        onClose();
      } else {
        toast.error(response.message || "리뷰 등록에 실패했습니다.");
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      
      // HTTP 상태코드에 따른 에러 메시지
      if (error.message?.includes('400')) {
        toast.error("이미 리뷰를 작성했거나 잘못된 요청입니다.");
      } else if (error.message?.includes('401')) {
        toast.error("로그인이 필요합니다.");
      } else if (error.message?.includes('404')) {
        toast.error("업소를 찾을 수 없습니다.");
      } else {
        toast.error("리뷰 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, onStarClick: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onStarClick(i + 1)}
        className="p-1 hover:scale-110 transition-transform"
        disabled={isSubmitting}
      >
        <Star
          className={`w-6 h-6 ${
            i < currentRating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          } hover:text-yellow-400 transition-colors`}
        />
      </button>
    ));
  };

  const handleClose = () => {
    if (isSubmitting) return; // 제출 중에는 닫기 불가
    
    // 폼 초기화
    setRating(5);
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{storeName} 리뷰 작성</DialogTitle>
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
            <p className="text-xs text-muted-foreground mt-1">
              별점을 클릭해서 평점을 선택하세요
            </p>
          </div>
          
          <div>
            <Label htmlFor="content">리뷰 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="가게에 대한 솔직한 후기를 남겨주세요"
              className="mt-1 min-h-[120px]"
              disabled={isSubmitting}
              maxLength={500} // 리뷰 길이 제한
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">
                최소 10자 이상 작성해주세요
              </p>
              <p className="text-xs text-muted-foreground">
                {content.length}/500
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={!content.trim() || content.trim().length < 10 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  등록 중...
                </>
              ) : (
                "리뷰 등록"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
