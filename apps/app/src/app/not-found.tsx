import Link from "next/link";
import { Button } from "@myapp/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-blue-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            페이지를 찾을 수 없습니다
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/app/dashboard">
                <Home className="w-4 h-4 mr-2" />
                대시보드로 이동
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              asChild
              className="w-full"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              원하시는 페이지를 찾지 못하셨나요?{" "}
              <Link 
                href="/help/contact" 
                className="text-blue-600 hover:underline"
              >
                도움말
              </Link>
              을 확인해보세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
