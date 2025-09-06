import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";

interface HeaderProps {
  activeTab: 'intro' | 'map' | 'scrap';
  onTabChange: (tab: 'intro' | 'map' | 'scrap') => void;
  isLoggedIn: boolean;
  userNickname: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Header({ activeTab, onTabChange, isLoggedIn, onLoginClick, onLogoutClick }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onTabChange('intro')}
          >
            착할지도
          </h1>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button
            variant={activeTab === 'intro' ? 'default' : 'ghost'}
            onClick={() => onTabChange('intro')}
            className="px-4 py-2"
          >
            소개
          </Button>
          <Button
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            onClick={() => onTabChange('map')}
            className="px-4 py-2"
          >
            지도
          </Button>
          <Button
            variant={activeTab === 'scrap' ? 'default' : 'ghost'}
            onClick={() => onTabChange('scrap')}
            className="px-4 py-2"
          >
            스크랩 리스트
          </Button>
          
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={onLogoutClick}
              className="px-4 py-2 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={onLoginClick}
              className="px-4 py-2 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
