"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { Filter, Star, GitFork, Clock, TrendingUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
  currentDomain?: string;
  currentSort?: string;
  currentSearch?: string;
}

const DOMAINS = [
  { value: 'all', label: '전체', count: 0 },
  { value: 'frontend', label: '프론트엔드', count: 45 },
  { value: 'backend', label: '백엔드', count: 32 },
  { value: 'fullstack', label: '풀스택', count: 28 },
  { value: 'mobile', label: '모바일', count: 18 },
  { value: 'data-science', label: '데이터 사이언스', count: 22 },
];

const SORT_OPTIONS = [
  { value: 'popular', label: '인기순', icon: TrendingUp, description: '포크 수 + 평점 기준' },
  { value: 'recent', label: '최신순', icon: Clock, description: '최근 업데이트' },
  { value: 'rating', label: '평점순', icon: Star, description: '높은 평점순' },
  { value: 'forks', label: '포크순', icon: GitFork, description: '많은 포크순' },
];

export function FilterSidebar({ currentDomain = 'all', currentSort = 'popular', currentSearch }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value === 'all' || value === 'popular') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    params.delete('page'); // Reset to first page
    router.push(`/community?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Domain Filter */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-gray-700" />
            기술 도메인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DOMAINS.map((domain) => (
            <button
              key={domain.value}
              onClick={() => updateFilter('domain', domain.value)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                currentDomain === domain.value
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="font-medium">{domain.label}</span>
              {domain.value !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {domain.count}
                </Badge>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            정렬 기준
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {SORT_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => updateFilter('sort', option.value)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                  currentSort === option.value
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800">
            커뮤니티 현황
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">이번 주 포크</span>
            <span className="font-semibold text-blue-600">+127</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">새 리뷰</span>
            <span className="font-semibold text-green-600">+89</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">활성 사용자</span>
            <span className="font-semibold text-purple-600">2,531</span>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {(currentDomain !== 'all' || currentSort !== 'popular' || currentSearch) && (
        <Button
          variant="outline"
          className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          onClick={() => router.push('/community')}
        >
          필터 초기화
        </Button>
      )}
    </div>
  );
}
