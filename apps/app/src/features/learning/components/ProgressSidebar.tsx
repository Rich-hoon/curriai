"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Progress } from "@myapp/ui/components/progress";
import { Badge } from "@myapp/ui/components/badge";
import { Target, TrendingUp, Calendar, Clock } from "lucide-react";

interface Curriculum {
  id: string;
  title: string;
  content: any;
}

interface UserProgress {
  completedSteps: any;
  progress: number;
  updatedAt: string;
}

interface ProgressSidebarProps {
  curriculum: Curriculum;
  userProgress: UserProgress | null;
}

export function ProgressSidebar({ curriculum, userProgress }: ProgressSidebarProps) {
  if (!curriculum.content?.modules) {
    return null;
  }

  const modules = curriculum.content.modules;
  const completedSteps = Array.isArray(userProgress?.completedSteps) 
    ? userProgress.completedSteps 
    : Object.keys(userProgress?.completedSteps || {});

  // Calculate statistics
  const totalLessons = modules.reduce((total: number, module: any) => 
    total + (module.lessons?.length || 0), 0
  );
  const completedLessons = completedSteps.length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const completedModules = modules.filter((module: any) => {
    if (!module.lessons) return false;
    return module.lessons.every((lesson: any) => completedSteps.includes(lesson.id));
  }).length;

  const estimatedHours = modules.reduce((total: number, module: any) => {
    if (module.lessons) {
      return total + module.lessons.reduce((moduleTotal: number, lesson: any) => {
        return moduleTotal + (lesson.duration || 60);
      }, 0);
    }
    return total;
  }, 0) / 60;

  const getProgressMessage = () => {
    if (progressPercentage === 0) {
      return "학습을 시작해보세요! 🚀";
    } else if (progressPercentage < 25) {
      return "좋은 시작이에요! 💪";
    } else if (progressPercentage < 50) {
      return "꾸준히 진행하고 계시네요! 👏";
    } else if (progressPercentage < 75) {
      return "절반 이상 완주! 🎯";
    } else if (progressPercentage < 100) {
      return "거의 완주! 마지막까지! 🔥";
    } else {
      return "완주 축하합니다! 🎉";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-blue-600" />
            학습 진행률
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {progressPercentage}%
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {completedLessons}개 완료 / 총 {totalLessons}개 강의
            </p>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              {getProgressMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            학습 통계
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">완료 모듈</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {completedModules}/{modules.length}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">완료 강의</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {completedLessons}/{totalLessons}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">예상 시간</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {Math.round(estimatedHours)}시간
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-gray-700" />
            모듈별 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modules.map((module: any, index: number) => {
              const moduleTotalLessons = module.lessons?.length || 0;
              const moduleCompletedLessons = module.lessons?.filter((lesson: any) => 
                completedSteps.includes(lesson.id)
              ).length || 0;
              const moduleProgress = moduleTotalLessons > 0 
                ? Math.round((moduleCompletedLessons / moduleTotalLessons) * 100)
                : 0;

              return (
                <div key={module.id || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {module.order}. {module.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moduleProgress}%
                    </span>
                  </div>
                  <Progress value={moduleProgress} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {moduleCompletedLessons}/{moduleTotalLessons} 강의 완료
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
