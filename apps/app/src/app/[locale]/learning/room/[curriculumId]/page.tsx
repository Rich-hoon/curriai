import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { LearningRoomHeader } from "@/features/learning/components/LearningRoomHeader";
import { CurriculumContent } from "@/features/learning/components/CurriculumContent";
import { ProgressSidebar } from "@/features/learning/components/ProgressSidebar";
import { GrassChart } from "@/features/dashboard/components/GrassChart";
import { getCurriculumById, getUserProgress } from "@/lib/supabase/learning";

interface LearningRoomPageProps {
  params: Promise<{
    curriculumId: string;
  }>;
}

export default async function LearningRoomPage({ params }: LearningRoomPageProps) {
  const { userId } = await auth();
  const { curriculumId } = await params;
  
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const [curriculum, userProgress] = await Promise.all([
      getCurriculumById(curriculumId),
      getUserProgress(userId, curriculumId),
    ]);

    if (!curriculum) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <LearningRoomHeader curriculum={curriculum} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <CurriculumContent 
                curriculum={curriculum} 
                userProgress={userProgress}
                userId={userId}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ProgressSidebar 
                curriculum={curriculum} 
                userProgress={userProgress}
              />
              
              {/* Grass Chart in Learning Room */}
              <GrassChart 
                userId={userId} 
                className="hidden xl:block"
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Learning room page error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-6">학습실 정보를 불러오는 중 오류가 발생했습니다.</p>
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
