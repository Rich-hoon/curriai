import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_service_role_key";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  content: any;
  creator: {
    username: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  completedSteps: any;
  progress: number;
  updatedAt: string;
}

export async function getCurriculumById(curriculumId: string): Promise<Curriculum | null> {
  try {
    const { data: curriculum, error } = await supabase
      .from('curriculums')
      .select(`
        id,
        title,
        description,
        domain,
        content,
        createdAt,
        updatedAt,
        creator:users!curriculums_creatorId_fkey(
          username,
          email
        )
      `)
      .eq('id', curriculumId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch curriculum: ${error.message}`);
    }

    return {
      ...curriculum,
      creator: curriculum.creator?.[0] || { username: null, email: '' },
    };
  } catch (error) {
    console.error('Curriculum fetch error:', error);
    throw error;
  }
}

export async function getUserProgress(userId: string, curriculumId: string): Promise<UserProgress | null> {
  try {
    const { data: progress, error } = await supabase
      .from('userProgress')
      .select('completedSteps, progress, updatedAt')
      .eq('userId', userId)
      .eq('curriculumId', curriculumId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    return progress || null;
  } catch (error) {
    console.error('User progress fetch error:', error);
    throw error;
  }
}

export async function updateLessonProgress(
  userId: string, 
  curriculumId: string, 
  lessonId: string, 
  completed: boolean
): Promise<void> {
  try {
    // Get current progress
    const { data: currentProgress } = await supabase
      .from('userProgress')
      .select('completedSteps, progress')
      .eq('userId', userId)
      .eq('curriculumId', curriculumId)
      .single();

    let completedSteps = currentProgress?.completedSteps || [];
    
    if (!Array.isArray(completedSteps)) {
      completedSteps = Object.keys(completedSteps || {});
    }

    if (completed) {
      // Add lesson to completed steps
      if (!completedSteps.includes(lessonId)) {
        completedSteps.push(lessonId);
      }
    } else {
      // Remove lesson from completed steps
      completedSteps = completedSteps.filter((id: string) => id !== lessonId);
    }

    // Calculate new progress percentage
    const curriculum = await getCurriculumById(curriculumId);
    if (!curriculum?.content?.modules) {
      throw new Error('Curriculum not found or invalid structure');
    }

    const totalLessons = curriculum.content.modules.reduce((total: number, module: any) => 
      total + (module.lessons?.length || 0), 0
    );

    const newProgress = totalLessons > 0 ? Math.round((completedSteps.length / totalLessons) * 100) : 0;

    // Update progress
    const { error } = await supabase
      .from('userProgress')
      .upsert({
        userId,
        curriculumId,
        completedSteps,
        progress: newProgress,
        updatedAt: new Date().toISOString(),
      }, {
        onConflict: 'userId,curriculumId'
      });

    if (error) {
      throw new Error(`Failed to update progress: ${error.message}`);
    }

    // Trigger realtime update
    await supabase
      .channel('progress-updates')
      .send({
        type: 'broadcast',
        event: 'progress-updated',
        payload: {
          userId,
          curriculumId,
          completedSteps,
          progress: newProgress,
        },
      });
  } catch (error) {
    console.error('Update lesson progress error:', error);
    throw error;
  }
}

export async function getLearningStats(userId: string) {
  try {
    const { data: allProgress, error } = await supabase
      .from('userProgress')
      .select('curriculumId, progress, updatedAt')
      .eq('userId', userId);

    if (error) {
      throw new Error(`Failed to fetch learning stats: ${error.message}`);
    }

    const totalCurriculums = allProgress?.length || 0;
    const activeCurriculums = allProgress?.filter(p => p.progress > 0).length || 0;
    const averageProgress = allProgress && allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + p.progress, 0) / allProgress.length)
      : 0;

    return {
      totalCurriculums,
      activeCurriculums,
      averageProgress,
    };
  } catch (error) {
    console.error('Learning stats fetch error:', error);
    throw error;
  }
}
