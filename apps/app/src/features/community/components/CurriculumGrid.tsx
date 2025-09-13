"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { Star, GitFork, User, Calendar, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { CommunityCurriculum } from "@/lib/supabase/community";

interface CurriculumGridProps {
  curriculums: CommunityCurriculum[];
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

export function CurriculumGrid({ curriculums }: CurriculumGridProps) {
  if (curriculums.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            다른 검색어를 시도하거나 필터를 조정해보세요.
          </p>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
            onClick={() => window.location.href = '/community'}
          >
            필터 초기화
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            커리큘럼 목록
          </h2>
          <p className="text-gray-600">
            {curriculums.length}개의 커리큘럼을 찾았습니다
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {curriculums.map((curriculum) => (
          <Card 
            key={curriculum.id}
            className="border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {curriculum.title}
                  </CardTitle>
                  {curriculum.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {curriculum.description}
                    </p>
                  )}
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${domainColors[curriculum.domain as keyof typeof domainColors] || 'bg-gray-100 text-gray-800'}`}
                >
                  {domainLabels[curriculum.domain as keyof typeof domainLabels] || curriculum.domain}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Creator Info */}
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">
                  {curriculum.creator.username || curriculum.creator.email.split('@')[0]}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDistanceToNow(new Date(curriculum.updatedAt), { 
                    addSuffix: true, 
                    locale: ko 
                  })}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-yellow-600">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">
                    {curriculum.averageRating ? curriculum.averageRating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="text-gray-500">
                    ({curriculum.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <GitFork className="w-4 h-4" />
                  <span className="font-medium">
                    {curriculum.forkCount}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">
                    {curriculum.reviewCount}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={`/curriculum/${curriculum.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    상세 보기
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  asChild
                >
                  <Link href={`/learning/room/${curriculum.id}`}>
                    학습 시작
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More (if needed) */}
      {curriculums.length >= 12 && (
        <div className="text-center pt-6">
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            더 많은 커리큘럼 보기
          </Button>
        </div>
      )}
    </div>
  );
}
