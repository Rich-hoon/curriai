import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Plus, BookOpen, Users, Clock } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const mockCurriculums = [
  {
    id: "1",
    title: "Next.js 풀스택 웹 개발",
    description: "React와 Next.js를 활용한 현대적인 웹 애플리케이션 개발 과정",
    domain: "fullstack",
    estimatedHours: 120,
    difficulty: "intermediate",
    forkCount: 15,
    createdAt: "2024-01-15",
  },
  {
    id: "2", 
    title: "Python 데이터 사이언스 입문",
    description: "Pandas, NumPy, Matplotlib을 활용한 데이터 분석 기초 과정",
    domain: "data-science",
    estimatedHours: 80,
    difficulty: "beginner",
    forkCount: 23,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "React Native 모바일 앱 개발",
    description: "크로스 플랫폼 모바일 앱 개발을 위한 React Native 마스터 과정",
    domain: "mobile", 
    estimatedHours: 100,
    difficulty: "intermediate",
    forkCount: 8,
    createdAt: "2024-01-08",
  },
];

const domainLabels = {
  frontend: "프론트엔드",
  backend: "백엔드",
  fullstack: "풀스택", 
  mobile: "모바일",
  "data-science": "데이터 사이언스",
};

const difficultyLabels = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
};

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              커리큘럼 라이브러리
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              AI가 생성한 맞춤형 학습 로드맵을 탐색하고 시작해보세요
            </p>
          </div>
          <Link href="/curriculum/create">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              새 커리큘럼 생성
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-gray-600">생성된 커리큘럼</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">2,531</p>
                  <p className="text-gray-600">활성 학습자</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">87%</p>
                  <p className="text-gray-600">완주율</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Plus className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">156</p>
                  <p className="text-gray-600">포크된 커리큘럼</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCurriculums.map((curriculum) => (
            <Card key={curriculum.id} className="hover:shadow-lg transition-shadow duration-200 border-2 border-gray-200 hover:border-blue-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {curriculum.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {curriculum.description}
                    </CardDescription>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {domainLabels[curriculum.domain as keyof typeof domainLabels]}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {curriculum.estimatedHours}시간
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {difficultyLabels[curriculum.difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </div>

                  {/* Fork Count */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {curriculum.forkCount}명이 포크함
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <Link href={`/curriculum/${curriculum.id}`}>
                        학습 시작
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      포크
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for when no curriculums exist */}
        {mockCurriculums.length === 0 && (
          <Card className="text-center py-12 border-2 border-dashed border-gray-300">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 생성된 커리큘럼이 없습니다
              </h3>
              <p className="text-gray-600 mb-6">
                AI가 당신만의 맞춤형 학습 로드맵을 생성해드립니다
              </p>
              <Link href="/curriculum/create">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  첫 번째 커리큘럼 생성하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
