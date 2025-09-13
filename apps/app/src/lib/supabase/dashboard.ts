import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_service_role_key";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface DashboardData {
  curriculums: Array<{
    id: string;
    title: string;
    description: string | null;
    domain: string;
    content: any;
    createdAt: string;
    updatedAt: string;
  }>;
  progressAgg: {
    totalLessons: number;
    completedLessons: number;
    totalHours: number;
    completedModules: number;
    activeCurriculums: number;
  };
  averageRating: number | null;
  activeCurriculums: number;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Fetch user's curriculums
    const { data: curriculums, error: curriculumsError } = await supabase
      .from('curriculums')
      .select('id, title, description, domain, content, createdAt, updatedAt')
      .eq('creatorId', userId)
      .order('updatedAt', { ascending: false });

    if (curriculumsError) {
      throw new Error(`Failed to fetch curriculums: ${curriculumsError.message}`);
    }

    // Fetch user progress data
    const { data: userProgress, error: progressError } = await supabase
      .from('userProgress')
      .select('curriculumId, completedSteps, progress')
      .eq('userId', userId);

    if (progressError) {
      throw new Error(`Failed to fetch user progress: ${progressError.message}`);
    }

    // Fetch reviews for average rating calculation
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('userId', userId);

    if (reviewsError) {
      throw new Error(`Failed to fetch reviews: ${reviewsError.message}`);
    }

    // Calculate aggregated progress
    const progressAgg = calculateProgressAggregation(curriculums, userProgress);
    
    // Calculate average rating
    const averageRating = reviews && reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

    // Count active curriculums (curriculums with progress > 0)
    const activeCurriculums = userProgress.filter(progress => progress.progress > 0).length;

    return {
      curriculums: curriculums || [],
      progressAgg,
      averageRating,
      activeCurriculums,
    };
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
}

function calculateProgressAggregation(curriculums: any[], userProgress: any[]) {
  let totalLessons = 0;
  let completedLessons = 0;
  let totalHours = 0;
  let completedModules = 0;
  let totalModules = 0;

  // Create a map of curriculum progress for quick lookup
  const progressMap = new Map();
  userProgress.forEach(progress => {
    progressMap.set(progress.curriculumId, progress);
  });

  curriculums.forEach(curriculum => {
    const curriculumProgress = progressMap.get(curriculum.id);
    
    if (curriculum.content && curriculum.content.modules) {
      // Calculate total lessons and hours
      curriculum.content.modules.forEach((module: any) => {
        totalModules += 1;
        if (module.lessons) {
          module.lessons.forEach((lesson: any) => {
            totalLessons += 1;
            if (lesson.duration) {
              totalHours += lesson.duration;
            }
          });
        }

        // Check if module is completed (all lessons completed)
        if (curriculumProgress && curriculumProgress.completedSteps) {
          const completedSteps = Array.isArray(curriculumProgress.completedSteps) 
            ? curriculumProgress.completedSteps 
            : Object.keys(curriculumProgress.completedSteps || {});
          
          const moduleCompleted = module.lessons?.every((lesson: any) => 
            completedSteps.includes(lesson.id)
          );
          
          if (moduleCompleted) {
            completedModules += 1;
          }
        }
      });

      // Count completed lessons
      if (curriculumProgress && curriculumProgress.completedSteps) {
        const completedSteps = Array.isArray(curriculumProgress.completedSteps) 
          ? curriculumProgress.completedSteps 
          : Object.keys(curriculumProgress.completedSteps || {});
        
        completedLessons += completedSteps.length;
      }
    }
  });

  return {
    totalLessons,
    completedLessons,
    totalHours,
    completedModules,
    activeCurriculums: userProgress.length,
  };
}

export async function getTodayLearningData(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get curriculums with progress
    const { data: curriculums, error } = await supabase
      .from('curriculums')
      .select(`
        id, 
        title, 
        content,
        userProgress!inner(completedSteps, progress)
      `)
      .eq('creatorId', userId)
      .eq('userProgress.userId', userId)
      .gt('userProgress.progress', 0);

    if (error) {
      throw new Error(`Failed to fetch today's learning data: ${error.message}`);
    }

    // Find next lessons to study today
    const todayTasks: Array<{
      curriculumId: string;
      curriculumTitle: string;
      moduleTitle: string;
      lessonTitle: string;
      lessonDuration: number;
      lessonType: string;
    }> = [];
    
    curriculums?.forEach(curriculum => {
      const progress = curriculum.userProgress[0];
      if (progress && curriculum.content?.modules) {
        curriculum.content.modules.forEach((module: any) => {
          if (module.lessons) {
            const nextLesson = module.lessons.find((lesson: any) => {
              const completedSteps = Array.isArray(progress.completedSteps) 
                ? progress.completedSteps 
                : Object.keys(progress.completedSteps || {});
              return !completedSteps.includes(lesson.id);
            });
            
            if (nextLesson) {
              todayTasks.push({
                curriculumId: curriculum.id,
                curriculumTitle: curriculum.title,
                moduleTitle: module.title,
                lessonTitle: nextLesson.title,
                lessonDuration: nextLesson.duration || 60,
                lessonType: nextLesson.type || 'theory',
              });
            }
          }
        });
      }
    });

    return todayTasks.slice(0, 3); // Return top 3 tasks for today
  } catch (error) {
    console.error('Today learning data fetch error:', error);
    return [];
  }
}
