"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Badge } from "@myapp/ui/components/badge";
import { CheckCircle, Circle, Clock, Play, BookOpen, Target } from "lucide-react";

interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  content: any;
}

interface UserProgress {
  completedSteps: any;
  progress: number;
  updatedAt: string;
}

interface CurriculumContentProps {
  curriculum: Curriculum;
  userProgress: UserProgress | null;
  userId: string;
}

export function CurriculumContent({ curriculum, userProgress, userId }: CurriculumContentProps) {
  const [selectedModule, setSelectedModule] = useState(0);

  if (!curriculum.content?.modules) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">커리큘럼 내용이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const modules = curriculum.content.modules;
  const completedSteps = Array.isArray(userProgress?.completedSteps) 
    ? userProgress.completedSteps 
    : Object.keys(userProgress?.completedSteps || {});

  const getModuleProgress = (module: any) => {
    if (!module.lessons) return 0;
    const completedLessons = module.lessons.filter((lesson: any) => 
      completedSteps.includes(lesson.id)
    ).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const getNextLesson = () => {
    for (const module of modules) {
      if (module.lessons) {
        const nextLesson = module.lessons.find((lesson: any) => 
          !completedSteps.includes(lesson.id)
        );
        if (nextLesson) {
          return { module, lesson: nextLesson };
        }
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();

  return (
    <div className="space-y-6">
      {/* Next Lesson Card */}
      {nextLesson && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Play className="w-5 h-5" />
              다음 학습할 강의
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {nextLesson.lesson.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {nextLesson.module.title} • {nextLesson.lesson.type === 'theory' ? '이론' : '실습'}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {nextLesson.lesson.duration || 60}분
                  </span>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            학습 모듈 ({modules.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module: any, moduleIndex: number) => {
              const moduleProgress = getModuleProgress(module);
              const isCompleted = moduleProgress === 100;
              
              return (
                <div 
                  key={module.id || moduleIndex}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {module.order}. {module.title}
                        </h4>
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            완료
                          </Badge>
                        )}
                      </div>
                      {module.description && (
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          약 {Math.round((module.duration || 0) / 60)}시간
                        </span>
                        <span>
                          {module.lessons?.length || 0}개 강의
                        </span>
                        <span className="text-blue-600 font-medium">
                          {moduleProgress}% 완료
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {module.lessons && module.lessons.length > 0 && (
                    <div className="space-y-2">
                      {module.lessons.map((lesson: any, lessonIndex: number) => {
                        const isLessonCompleted = completedSteps.includes(lesson.id);
                        
                        return (
                          <div 
                            key={lesson.id || lessonIndex}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-shrink-0">
                              {isLessonCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className={`text-sm ${isLessonCompleted ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                {lesson.title}
                              </h5>
                              {lesson.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {lesson.type === 'theory' ? '이론' : 
                                 lesson.type === 'practice' ? '실습' :
                                 lesson.type === 'project' ? '프로젝트' : '평가'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {lesson.duration || 60}분
                              </span>
                              {!isLessonCompleted && (
                                <Button size="sm" variant="ghost">
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
