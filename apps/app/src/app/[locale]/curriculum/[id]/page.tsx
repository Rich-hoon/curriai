import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { CurriculumDetail } from "@/features/community/components/CurriculumDetail";
import { getCurriculumById, getUserReview } from "@/lib/supabase/community";

interface CurriculumDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CurriculumDetailPage({ params }: CurriculumDetailPageProps) {
  const { userId } = await auth();
  const { id } = await params;
  
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const [curriculum, userReview] = await Promise.all([
      getCurriculumById(id),
      getUserReview(userId, id),
    ]);

    if (!curriculum) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <CurriculumDetail 
            curriculum={curriculum} 
            userReview={userReview}
            currentUserId={userId}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Curriculum detail page error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-6">커리큘럼 정보를 불러오는 중 오류가 발생했습니다.</p>
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
