"use client";

import { Card, CardContent } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { BookOpen, ArrowLeft, Play, User, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  content: any;
  creator: {
    username: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface LearningRoomHeaderProps {
  curriculum: Curriculum;
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

export function LearningRoomHeader({ curriculum }: LearningRoomHeaderProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-gray-600 hover:text-gray-900"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-1" />
                대시보드로
              </Link>
            </Button>
            <Badge 
              variant="secondary" 
              className={`text-xs ${domainColors[curriculum.domain as keyof typeof domainColors] || 'bg-gray-100 text-gray-800'}`}
            >
              {domainLabels[curriculum.domain as keyof typeof domainLabels] || curriculum.domain}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {curriculum.title}
            </h1>
            {curriculum.description && (
              <p className="text-lg text-gray-600">
                {curriculum.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
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
              <BookOpen className="w-4 h-4" />
              <span>
                {curriculum.content?.modules?.length || 0}개 모듈
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Play className="w-4 h-4 mr-2" />
              학습 시작하기
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
              asChild
            >
              <Link href={`/curriculum/${curriculum.id}`}>
                상세 정보 보기
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
