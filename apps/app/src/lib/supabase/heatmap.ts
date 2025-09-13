import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_service_role_key";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface HeatmapDataPoint {
  date: string;
  count: number;
  level: number;
}

export interface HeatmapStats {
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  averagePerDay: number;
}

export async function getHeatmapData(userId: string, days: number = 365): Promise<HeatmapDataPoint[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user progress data from the last year
    const { data: progressData, error } = await supabase
      .from('userProgress')
      .select('updatedAt, completedSteps')
      .eq('userId', userId)
      .gte('updatedAt', startDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    // Group by date and count completed steps
    const dateCounts = new Map<string, number>();
    
    progressData?.forEach(progress => {
      const date = new Date(progress.updatedAt).toISOString().split('T')[0];
      const completedSteps = Array.isArray(progress.completedSteps) 
        ? progress.completedSteps.length 
        : Object.keys(progress.completedSteps || {}).length;
      
      dateCounts.set(date, (dateCounts.get(date) || 0) + completedSteps);
    });

    // Convert to array and fill missing dates
    const heatmapData: HeatmapDataPoint[] = [];
    const maxCount = Math.max(...Array.from(dateCounts.values()), 1);

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const count = dateCounts.get(dateString) || 0;
      const level = bucketCount(count, maxCount);

      heatmapData.unshift({
        date: dateString,
        count,
        level,
      });
    }

    return heatmapData;
  } catch (error) {
    console.error('Heatmap data fetch error:', error);
    throw error;
  }
}

export async function getHeatmapStats(userId: string): Promise<HeatmapStats> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    // Get all progress data for the last year
    const { data: progressData, error } = await supabase
      .from('userProgress')
      .select('updatedAt, completedSteps')
      .eq('userId', userId)
      .gte('updatedAt', startDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch user progress stats: ${error.message}`);
    }

    // Calculate statistics
    const dateCounts = new Map<string, number>();
    
    progressData?.forEach(progress => {
      const date = new Date(progress.updatedAt).toISOString().split('T')[0];
      const completedSteps = Array.isArray(progress.completedSteps) 
        ? progress.completedSteps.length 
        : Object.keys(progress.completedSteps || {}).length;
      
      dateCounts.set(date, (dateCounts.get(date) || 0) + completedSteps);
    });

    const totalContributions = Array.from(dateCounts.values()).reduce((sum, count) => sum + count, 0);
    const activeDays = Array.from(dateCounts.values()).filter(count => count > 0).length;
    const averagePerDay = activeDays > 0 ? totalContributions / 365 : 0;

    // Calculate streaks
    const sortedDates = Array.from(dateCounts.keys()).sort();
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const hasActivity = dateCounts.has(dateString) && dateCounts.get(dateString)! > 0;

      if (hasActivity) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        
        if (i === 0) {
          currentStreak = tempStreak;
        }
      } else {
        if (i === 0) {
          // Calculate current streak from the most recent activity
          let streakCount = 0;
          for (let j = 1; j < sortedDates.length; j++) {
            const prevDate = new Date(sortedDates[sortedDates.length - j]);
            const currentDate = new Date();
            const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === j) {
              streakCount++;
            } else {
              break;
            }
          }
          currentStreak = streakCount;
        }
        tempStreak = 0;
      }
    }

    return {
      totalContributions,
      longestStreak,
      currentStreak,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
    };
  } catch (error) {
    console.error('Heatmap stats fetch error:', error);
    throw error;
  }
}

function bucketCount(count: number, maxCount: number): number {
  if (count === 0) return 0;
  
  const ratio = count / maxCount;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

export function formatDateForHeatmap(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export function getContributionLevelDescription(level: number): string {
  switch (level) {
    case 0:
      return '활동 없음';
    case 1:
      return '낮은 활동';
    case 2:
      return '보통 활동';
    case 3:
      return '높은 활동';
    case 4:
      return '매우 높은 활동';
    default:
      return '알 수 없음';
  }
}
