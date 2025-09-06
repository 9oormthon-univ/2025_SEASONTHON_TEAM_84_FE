import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { User } from "../types/store";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignUp: (userData: User) => void;
}

// API 기본 URL을 상수로 정의합니다.
const API_BASE_URL = "https://qualified-swordtail-goormhack84-4dc9e8b7.koyeb.app";

export function LoginModal({ isOpen, onClose, onLogin, onSignUp }: LoginModalProps) {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // 로그인 처리 함수 (fetch API 사용)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.username || !loginData.password) {
      setLoginError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }
      
      const user = data.user;
      const accessToken = data.accessToken;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      onLogin(user);
      onClose();
      setLoginData({ username: '', password: '' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      setLoginError(errorMessage);
      console.error("Login failed:", error);
    }
  };

  // 회원가입 처리 함수 (fetch API 사용)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupData.username || !signupData.password || !signupData.nickname) {
      setSignupError('모든 필드를 입력해주세요.');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (signupData.password.length < 4) {
      setSignupError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.username,
          password: signupData.password,
          nickname: signupData.nickname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }
      
      const newUser = data.user;
      const accessToken = data.accessToken;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      
      onSignUp(newUser);
      onLogin(newUser); // 회원가입 후 자동 로그인
      
      onClose();
      setSignupData({ username: '', password: '', confirmPassword: '', nickname: '' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      setSignupError(errorMessage);
      console.error("Signup failed:", error);
    }
  };

  const handleClose = () => {
    onClose();
    setLoginData({ username: '', password: '' });
    setSignupData({ username: '', password: '', confirmPassword: '', nickname: '' });
    setLoginError('');
    setSignupError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            착할지도
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-id">아이디</Label>
                <Input
                  id="login-id"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 pt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-id">아이디</Label>
                <Input
                  id="signup-id"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={signupData.username}
                  onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="비밀번호 (4자 이상)"
                  value={signupData.password}
                  onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-nickname">닉네임</Label>
                <Input
                  id="signup-nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={signupData.nickname}
                  onChange={(e) => setSignupData(prev => ({ ...prev, nickname: e.target.value }))}
                />
              </div>
              
              {signupError && (
                <p className="text-sm text-red-500">{signupError}</p>
              )}
              
              <Button type="submit" className="w-full">
                회원가입
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

