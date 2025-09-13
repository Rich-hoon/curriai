import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CommunityHeader } from "@/features/community/components/CommunityHeader";
import { CurriculumGrid } from "@/features/community/components/CurriculumGrid";
import { FilterSidebar } from "@/features/community/components/FilterSidebar";
import { getCommunityCurriculums } from "@/lib/supabase/community";

interface SearchParams {
  domain?: string;
  sort?: string;
  search?: string;
}

interface CommunityPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { userId } = await auth();
  const resolvedSearchParams = await searchParams;
  
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const curriculums = await getCommunityCurriculums({
      domain: resolvedSearchParams.domain,
      sort: resolvedSearchParams.sort || 'popular',
      search: resolvedSearchParams.search,
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <CommunityHeader 
            totalCurriculums={curriculums.length}
            searchQuery={resolvedSearchParams.search}
          />

          <div className="flex gap-8 mt-8">
            {/* Filter Sidebar */}
            <div className="w-64 flex-shrink-0">
              <FilterSidebar 
                currentDomain={resolvedSearchParams.domain}
                currentSort={resolvedSearchParams.sort || 'popular'}
                currentSearch={resolvedSearchParams.search}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <CurriculumGrid curriculums={curriculums} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Community page error:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">데이터 로딩 오류</h2>
          <p className="text-gray-600 mb-6">커뮤니티 데이터를 불러오는 중 오류가 발생했습니다.</p>
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
