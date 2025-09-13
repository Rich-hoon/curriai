"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@myapp/ui/components/tabs";
import { Star, GitFork, User, Calendar, Clock, BookOpen, Play, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import type { CommunityCurriculum, CurriculumContent } from "@/lib/supabase/community";
import { ForkButton } from "./ForkButton";
import { ReviewSection } from "./ReviewSection";

interface UserReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CurriculumDetailProps {
  curriculum: CommunityCurriculum;
  userReview: UserReview | null;
  currentUserId: string;
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

export function CurriculumDetail({ curriculum, userReview, currentUserId }: CurriculumDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const isOwner = curriculum.creatorId === currentUserId;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getEstimatedHours = () => {
    if (!curriculum.content?.modules) return 0;
    return curriculum.content.modules.reduce((total: number, module) => {
      if (module.lessons) {
        return total + module.lessons.reduce((moduleTotal: number, lesson) => {
          return moduleTotal + (lesson.duration || 60);
        }, 0);
      }
      return total;
    }, 0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Badge 
            variant="secondary" 
            className={`text-sm ${domainColors[curriculum.domain as keyof typeof domainColors] || 'bg-gray-100 text-gray-800'}`}
          >
            {domainLabels[curriculum.domain as keyof typeof domainLabels] || curriculum.domain}
          </Badge>
          {isOwner && (
            <Badge variant="outline" className="text-xs">
              내 커리큘럼
            </Badge>
          )}
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {curriculum.title}
        </h1>
        
        {curriculum.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {curriculum.description}
          </p>
        )}

        {/* Creator and Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">
              {curriculum.creator.username || curriculum.creator.email.split('@')[0]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(curriculum.updatedAt), { 
                addSuffix: true, 
                locale: ko 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>약 {Math.round(getEstimatedHours() / 60)}시간</span>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(Math.round(curriculum.averageRating || 0))}
            </div>
            <span className="text-lg font-semibold">
              {curriculum.averageRating ? curriculum.averageRating.toFixed(1) : 'N/A'}
            </span>
            <span className="text-gray-600">
              ({curriculum.reviewCount}개 리뷰)
            </span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <GitFork className="w-5 h-5" />
            <span className="text-lg font-semibold">{curriculum.forkCount}</span>
            <span className="text-gray-600">포크</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            asChild
          >
            <Link href={`/learning/room/${curriculum.id}`}>
              <Play className="w-5 h-5 mr-2" />
              학습 시작하기
            </Link>
          </Button>
          
          {!isOwner && (
            <ForkButton 
              curriculumId={curriculum.id}
              onSuccess={() => toast.success("커리큘럼을 포크했습니다!")}
              onError={(error) => toast.error(error)}
            />
          )}
          
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
            asChild
          >
            <Link href="/community">
              <BookOpen className="w-4 h-4 mr-2" />
              커뮤니티로 돌아가기
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            커리큘럼 개요
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            리뷰 및 평가
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <CurriculumOverview content={curriculum.content} />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <ReviewSection 
            curriculumId={curriculum.id}
            userReview={userReview}
            currentUserId={currentUserId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CurriculumOverview({ content }: { content: CurriculumContent }) {
  if (!content?.modules) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">커리큘럼 내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Outcomes */}
      {content.learningOutcomes && content.learningOutcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-600" />
              학습 결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.learningOutcomes.map((outcome: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            학습 모듈 ({content.modules.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.modules.map((module, index: number) => (
              <div key={module.id || index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {module.order}. {module.title}
                </h4>
                {module.description && (
                  <p className="text-gray-600 mb-3">{module.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    약 {Math.round((module.duration || 0) / 60)}시간
                  </span>
                  <span>
                    {module.lessons?.length || 0}개 강의
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
