import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const handleKakaoLogin = () => {
    // 실제로는 카카오 로그인 API를 호출
    onLogin();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            착할지도에 로그인하기
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-medium">로그인이 필요한 서비스입니다</h2>
            <p className="text-muted-foreground text-sm">
              지도 보기와 스크랩 기능을 이용하려면<br />
              로그인해 주세요.
            </p>
          </div>
          
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            카카오톡으로 시작하기
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground"
          >
            나중에 하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}