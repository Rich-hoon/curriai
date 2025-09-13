"use client";

import { Card, CardContent } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Sparkles, BookOpen, Target, Users } from "lucide-react";
import Link from "next/link";

export function EmptyDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            학습 대시보드
          </h1>
          <p className="text-lg text-gray-600">
            당신의 학습 여정을 시작해보세요
          </p>
        </div>

        {/* Empty State Card */}
        <Card className="max-w-2xl mx-auto border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              아직 생성된 커리큘럼이 없습니다
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              AI가 당신만의 맞춤형 학습 로드맵을 생성해드립니다. 
              목표를 입력하고 체계적인 학습을 시작해보세요.
            </p>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                asChild
              >
                <Link href="/curriculum/create">
                  <Sparkles className="w-5 h-5 mr-2" />
                  첫 번째 커리큘럼 생성하기
                </Link>
              </Button>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <Link href="/curriculum">
                    <BookOpen className="w-4 h-4 mr-2" />
                    커리큘럼 탐색
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-green-200 text-green-600 hover:bg-green-50"
                  asChild
                >
                  <Link href="/community">
                    <Users className="w-4 h-4 mr-2" />
                    커뮤니티 보기
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Curri.AI의 주요 기능
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  AI 커리큘럼 생성
                </h4>
                <p className="text-sm text-gray-600">
                  목표를 입력하면 AI가 맞춤형 학습 로드맵을 자동으로 생성합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  체계적인 학습
                </h4>
                <p className="text-sm text-gray-600">
                  모듈별로 구성된 강의와 실습으로 체계적으로 학습할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  커뮤니티 학습
                </h4>
                <p className="text-sm text-gray-600">
                  다른 사용자의 커리큘럼을 포크하고 함께 학습하며 성장할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
