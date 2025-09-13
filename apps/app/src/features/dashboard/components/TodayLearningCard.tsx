"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { Clock, BookOpen, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatDuration, getLessonTypeIcon, getLessonTypeLabel } from "../utils/progress";
import type { TodayCardData } from "../utils/progress";

interface TodayLearningCardProps {
  data: TodayCardData;
}

export function TodayLearningCard({ data }: TodayLearningCardProps) {
  if (!data.hasTasks) {
    return (
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-gray-600" />
            오늘의 학습
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              모든 학습을 완료했어요! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              새로운 커리큘럼을 시작하거나 복습을 해보세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/curriculum/create">
                  새 커리큘럼 생성
                </Link>
              </Button>
              <Button asChild>
                <Link href="/curriculum">
                  커리큘럼 탐색
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-blue-600" />
            오늘의 학습
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(data.totalEstimatedTime)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {data.tasks.map((task, index) => (
            <div 
              key={`${task.curriculumId}-${index}`}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {task.lessonTitle}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {task.curriculumTitle} • {task.moduleTitle}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getLessonTypeIcon(task.lessonType)} {getLessonTypeLabel(task.lessonType)}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(task.lessonDuration)}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link href={`/learning/room/${task.curriculumId}`}>
                    <Play className="w-4 h-4 mr-1" />
                    시작
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          
          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                asChild
              >
                <Link href="/curriculum">
                  모든 커리큘럼 보기
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                asChild
              >
                <Link href="/curriculum/create">
                  새 커리큘럼 생성
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
