import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProgressBar } from "@/features/dashboard/components/ProgressBar";
import { TodayLearningCard } from "@/features/dashboard/components/TodayLearningCard";
import { StatsCards } from "@/features/dashboard/components/StatsCards";
import { RecentCurriculums } from "@/features/dashboard/components/RecentCurriculums";
import { EmptyDashboard } from "@/features/dashboard/components/EmptyDashboard";
import { GrassChart } from "@/features/dashboard/components/GrassChart";
import { computeProgress, buildTodayCard } from "@/features/dashboard/utils/progress";
import { getDashboardData } from "@/lib/supabase/dashboard";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const dashboardData = await getDashboardData(userId);
    
    if (!dashboardData.curriculums.length) {
      return <EmptyDashboard />;
    }

    const overallProgress = computeProgress(dashboardData.progressAgg);
    const todayCard = buildTodayCard(dashboardData.curriculums, dashboardData.progressAgg);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              학습 대시보드
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              당신의 학습 진도와 성과를 한눈에 확인하세요
            </p>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <ProgressBar 
              value={overallProgress.percent} 
              label={overallProgress.label}
              description={`${overallProgress.completedLessons}개 강의 완료 / 총 ${overallProgress.totalLessons}개 강의`}
            />
          </div>

          {/* Dashboard Grid */}
          <div className="space-y-8">
            {/* Top Row - Grass Chart */}
            <GrassChart userId={userId} />

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <TodayLearningCard data={todayCard} />
                <RecentCurriculums curriculums={dashboardData.curriculums.slice(0, 5)} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <StatsCards 
                  stats={[
                    { 
                      label: "총 학습 시간", 
                      value: `${overallProgress.totalHours}h`, 
                      icon: "clock",
                      color: "blue"
                    },
                    { 
                      label: "완료한 모듈", 
                      value: `${overallProgress.completedModules}개`, 
                      icon: "check-circle",
                      color: "green"
                    },
                    { 
                      label: "진행 중인 커리큘럼", 
                      value: `${dashboardData.activeCurriculums}개`, 
                      icon: "book-open",
                      color: "purple"
                    },
                    { 
                      label: "평균 평점", 
                      value: dashboardData.averageRating ? `${dashboardData.averageRating.toFixed(1)}/5` : "평점 없음", 
                      icon: "star",
                      color: "yellow"
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-6">대시보드 데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
}
