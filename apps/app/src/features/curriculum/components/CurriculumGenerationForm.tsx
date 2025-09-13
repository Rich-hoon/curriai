"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Button } from "@myapp/ui/components/button";
import { Label } from "@myapp/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@myapp/ui/components/select";
import { Textarea } from "@myapp/ui/components/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Loader2, Sparkles, Target, Clock, User, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface CurriculumFormData {
  goal: string;
  duration: number;
  learningStyle: string;
  currentLevel: string;
  domain: string;
}

const DOMAINS = [
  { value: "frontend", label: "프론트엔드" },
  { value: "backend", label: "백엔드" },
  { value: "fullstack", label: "풀스택" },
  { value: "mobile", label: "모바일" },
  { value: "data-science", label: "데이터 사이언스" },
];

const LEARNING_STYLES = [
  { value: "hands-on", label: "실습 중심" },
  { value: "theoretical", label: "이론 중심" },
  { value: "project-based", label: "프로젝트 기반" },
  { value: "mixed", label: "혼합형" },
];

const SKILL_LEVELS = [
  { value: "beginner", label: "초급 (0-1년)" },
  { value: "intermediate", label: "중급 (1-3년)" },
  { value: "advanced", label: "고급 (3년+)" },
];

export function CurriculumGenerationForm() {
  // Skip Clerk hooks during SSR/build time
  if (typeof window === "undefined") {
    return null;
  }

  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CurriculumFormData>({
    goal: "",
    duration: 12,
    learningStyle: "hands-on",
    currentLevel: "beginner",
    domain: "frontend",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!formData.goal.trim()) {
      toast.error("학습 목표를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken({ template: "supabase" });
      
      if (!token) {
        throw new Error("인증 토큰을 가져올 수 없습니다.");
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-curriculum`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "커리큘럼 생성에 실패했습니다.");
      }

      toast.success("커리큘럼이 성공적으로 생성되었습니다!");
      router.push("/curriculum");
      
    } catch (error) {
      console.error("Curriculum generation error:", error);
      toast.error(error instanceof Error ? error.message : "커리큘럼 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CurriculumFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI 커리큘럼 생성기
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            당신만의 맞춤형 학습 로드맵을 AI가 생성해드립니다
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Input */}
            <div className="space-y-3">
              <Label htmlFor="goal" className="flex items-center gap-2 text-lg font-semibold">
                <Target className="w-5 h-5 text-blue-600" />
                학습 목표
              </Label>
              <Textarea
                id="goal"
                placeholder="예: Next.js로 풀스택 웹 애플리케이션 개발, React Native로 모바일 앱 만들기, Python으로 데이터 분석 프로젝트 완성..."
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                className="min-h-[120px] text-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                disabled={isLoading}
              />
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration */}
              <div className="space-y-3">
                <Label htmlFor="duration" className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="w-5 h-5 text-blue-600" />
                  학습 기간
                </Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => handleInputChange("duration", parseInt(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4주 (1개월)</SelectItem>
                    <SelectItem value="8">8주 (2개월)</SelectItem>
                    <SelectItem value="12">12주 (3개월)</SelectItem>
                    <SelectItem value="16">16주 (4개월)</SelectItem>
                    <SelectItem value="24">24주 (6개월)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Domain */}
              <div className="space-y-3">
                <Label htmlFor="domain" className="flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  기술 도메인
                </Label>
                <Select
                  value={formData.domain}
                  onValueChange={(value) => handleInputChange("domain", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((domain) => (
                      <SelectItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Learning Style */}
              <div className="space-y-3">
                <Label htmlFor="learningStyle" className="flex items-center gap-2 text-lg font-semibold">
                  <User className="w-5 h-5 text-blue-600" />
                  학습 스타일
                </Label>
                <Select
                  value={formData.learningStyle}
                  onValueChange={(value) => handleInputChange("learningStyle", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Level */}
              <div className="space-y-3">
                <Label htmlFor="currentLevel" className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="w-5 h-5 text-blue-600" />
                  현재 숙련도
                </Label>
                <Select
                  value={formData.currentLevel}
                  onValueChange={(value) => handleInputChange("currentLevel", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !formData.goal.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    AI가 커리큘럼을 생성하고 있습니다...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    커리큘럼 생성하기
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
