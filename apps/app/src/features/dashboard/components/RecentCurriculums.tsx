"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { BookOpen, Calendar, ArrowRight, Play, Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  createdAt: string;
  updatedAt: string;
}

interface RecentCurriculumsProps {
  curriculums: Curriculum[];
}

const domainLabels = {
  frontend: "프론트엔드",
  backend: "백엔드",
  fullstack: "풀스택",
  mobile: "모바일",
  "data-science": "데이터 사이언스",
};

const domainColors = {
  frontend: "bg-blue-100 text-blue-800",
  backend: "bg-green-100 text-green-800",
  fullstack: "bg-purple-100 text-purple-800",
  mobile: "bg-orange-100 text-orange-800",
  "data-science": "bg-pink-100 text-pink-800",
};

export function RecentCurriculums({ curriculums }: RecentCurriculumsProps) {
  if (curriculums.length === 0) {
    return (
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-gray-600" />
            최근 커리큘럼
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 생성된 커리큘럼이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              AI가 당신만의 맞춤형 학습 로드맵을 생성해드립니다.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/curriculum/create">
                첫 번째 커리큘럼 생성하기
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50/50 to-gray-100/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-gray-700" />
            최근 커리큘럼
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/curriculum">
              모두 보기
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {curriculums.map((curriculum) => (
            <div 
              key={curriculum.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {curriculum.title}
                  </h4>
                  {curriculum.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {curriculum.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${domainColors[curriculum.domain as keyof typeof domainColors] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {domainLabels[curriculum.domain as keyof typeof domainLabels] || curriculum.domain}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(curriculum.updatedAt), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={`/learning/room/${curriculum.id}`}>
                    <Play className="w-4 h-4 mr-1" />
                    학습 시작
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  asChild
                >
                  <Link href={`/curriculum/${curriculum.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    상세 보기
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {curriculums.length >= 5 && (
          <div className="pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
              asChild
            >
              <Link href="/curriculum">
                모든 커리큘럼 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
