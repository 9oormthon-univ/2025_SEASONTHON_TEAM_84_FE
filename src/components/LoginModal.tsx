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
  users: User[];
  onSignUp: (userData: Omit<User, 'id' | 'createdAt'>) => void;
}

export function LoginModal({ isOpen, onClose, onLogin, users, onSignUp }: LoginModalProps) {
  // 로그인 폼 상태
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // 회원가입 폼 상태
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  // 에러 상태
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginData.username || !loginData.password) {
      setLoginError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    const user = users.find(u => 
      u.username === loginData.username && u.password === loginData.password
    );

    if (user) {
      onLogin(user);
      onClose();
      setLoginData({ username: '', password: '' });
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // 회원가입 처리
  const handleSignUp = (e: React.FormEvent) => {
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

    // 중복 아이디 체크
    const existingUser = users.find(u => u.username === signupData.username);
    if (existingUser) {
      setSignupError('이미 사용 중인 아이디입니다.');
      return;
    }

    // 중복 닉네임 체크
    const existingNickname = users.find(u => u.nickname === signupData.nickname);
    if (existingNickname) {
      setSignupError('이미 사용 중인 닉네임입니다.');
      return;
    }

    // 회원가입 성공
    onSignUp({
      username: signupData.username,
      password: signupData.password,
      nickname: signupData.nickname
    });

    // 자동 로그인
    const newUser: User = {
      id: `u${Date.now()}`,
      username: signupData.username,
      password: signupData.password,
      nickname: signupData.nickname,
      createdAt: new Date().toISOString()
    };
    
    onLogin(newUser);
    onClose();
    setSignupData({
      username: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    });
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
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">아이디</Label>
                <Input
                  id="login-username"
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
                <p className="text-sm text-destructive">{loginError}</p>
              )}
              
              <Button type="submit" className="w-full">
                로그인
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username">아이디</Label>
                <Input
                  id="signup-username"
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
                  placeholder="비밀번호를 입력하세요"
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
                <p className="text-sm text-destructive">{signupError}</p>
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