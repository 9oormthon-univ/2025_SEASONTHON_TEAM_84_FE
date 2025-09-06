import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Heart, Star, Filter } from "lucide-react";

export function IntroPage() {
  return (
    <div className="w-full px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">착할지도에 오신 것을 환영합니다</h1>
          <p className="text-xl text-muted-foreground">
            당신 주변의 착한 가게들을 쉽게 찾아보세요
          </p>
        </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">위치 기반 검색</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm">
              현재 위치를 기준으로 가까운 가게들을 거리순으로 찾아보세요
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Filter className="w-8 h-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">카테고리 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm">
              12개 카테고리로 원하는 업종의 가게만 골라서 볼 수 있어요
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">스크랩 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm">
              마음에 드는 가게를 스크랩해서 나만의 리스트를 만들어보세요
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">리뷰 시스템</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground text-sm">
              다른 사용자들의 솔직한 리뷰를 보고 직접 리뷰도 남겨보세요
            </p>
          </CardContent>
        </Card>
      </div>
        
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">지원 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
            {[
              '한식', '일식', '중식', '양식', 
              '이용업', '숙박업', '세탁업', '베이커리',
              '미용업', '목욕업', '기타요식업', '기타비요식업'
            ].map((category) => (
              <div key={category} className="bg-white rounded-lg p-4 shadow-sm min-w-0">
                <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{category}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}