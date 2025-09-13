"use client";

import { Card, CardContent } from "@myapp/ui/components/card";
import { Progress } from "@myapp/ui/components/progress";

interface ProgressBarProps {
  value: number;
  label: string;
  description?: string;
}

export function ProgressBar({ value, label, description }: ProgressBarProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                전체 학습 진도
              </h2>
              <p className="text-lg font-semibold text-gray-700 mt-1">
                {label}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {value}%
              </div>
              <div className="text-sm text-gray-600">
                진행률
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={value} 
              className="h-3 bg-gray-200"
            />
            {description && (
              <p className="text-sm text-gray-600 text-center">
                {description}
              </p>
            )}
          </div>

          {/* Motivational Message */}
          <div className="text-center">
            {value === 0 && (
              <p className="text-gray-600 italic">
                첫 번째 강의를 시작해보세요! 🚀
              </p>
            )}
            {value > 0 && value < 25 && (
              <p className="text-blue-600 font-medium">
                좋은 시작이에요! 계속 화이팅! 💪
              </p>
            )}
            {value >= 25 && value < 50 && (
              <p className="text-blue-600 font-medium">
                꾸준히 진행하고 계시네요! 👏
              </p>
            )}
            {value >= 50 && value < 75 && (
              <p className="text-green-600 font-medium">
                절반 이상 완주! 거의 다 왔어요! 🎯
              </p>
            )}
            {value >= 75 && value < 100 && (
              <p className="text-green-600 font-medium">
                거의 완주! 마지막까지 파이팅! 🔥
              </p>
            )}
            {value === 100 && (
              <p className="text-green-600 font-bold text-lg">
                완주 축하합니다! 🎉 새로운 도전을 시작해보세요!
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
