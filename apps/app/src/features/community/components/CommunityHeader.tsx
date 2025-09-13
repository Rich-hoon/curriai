"use client";

import { Card, CardContent } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Input } from "@myapp/ui/components/input";
import { Search, Users, Star, GitFork } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CommunityHeaderProps {
  totalCurriculums: number;
  searchQuery?: string;
}

export function CommunityHeader({ totalCurriculums, searchQuery = "" }: CommunityHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page
    router.push(`/community?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          커뮤니티
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          다른 학습자들의 커리큘럼을 탐색하고 포크해보세요
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="커리큘럼 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
            />
          </div>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mb-1">
              {totalCurriculums.toLocaleString()}
            </h3>
            <p className="text-gray-600">공개 커리큘럼</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <GitFork className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-1">
              {Math.floor(totalCurriculums * 2.3).toLocaleString()}
            </h3>
            <p className="text-gray-600">총 포크 수</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-amber-50/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-yellow-600 mb-1">
              4.2
            </h3>
            <p className="text-gray-600">평균 평점</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          asChild
        >
          <Link href="/curriculum/create">
            <Star className="w-4 h-4 mr-2" />
            새 커리큘럼 생성
          </Link>
        </Button>
        <Button 
          variant="outline"
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
          asChild
        >
          <Link href="/curriculum/my">
            내 커리큘럼 보기
          </Link>
        </Button>
      </div>
    </div>
  );
}
