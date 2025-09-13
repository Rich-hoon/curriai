import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_service_role_key";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface CurriculumContent {
  modules: Array<{
    id?: string;
    order?: number;
    title: string;
    description?: string;
    duration?: number;
    lessons: Array<{
      id?: string;
      title: string;
      description: string;
      duration?: number;
      resources?: string[];
    }>;
  }>;
  learningOutcomes?: string[];
}

export interface CommunityCurriculum {
  id: string;
  title: string;
  description: string | null;
  domain: string;
  content: CurriculumContent;
  isPublic: boolean;
  forkCount: number;
  creatorId: string;
  creator: {
    username: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  averageRating: number | null;
  reviewCount: number;
  popularityScore: number;
}

export interface CommunityFilters {
  domain?: string;
  sort?: string;
  search?: string;
}

export async function getCommunityCurriculums(filters: CommunityFilters): Promise<CommunityCurriculum[]> {
  try {
    let query = supabase
      .from('curriculums')
      .select(`
        id,
        title,
        description,
        domain,
        content,
        isPublic,
        forkCount,
        creatorId,
        createdAt,
        updatedAt,
        creator:users!curriculums_creatorId_fkey(
          username,
          email
        )
      `)
      .eq('isPublic', true);

    // Apply domain filter
    if (filters.domain && filters.domain !== 'all') {
      query = query.eq('domain', filters.domain);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%, description.ilike.%${filters.search}%`);
    }

    const { data: curriculums, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch community curriculums: ${error.message}`);
    }

    // Get review data for each curriculum
    const curriculumIds = curriculums?.map(c => c.id) || [];
    
    const reviewsQuery = supabase
      .from('reviews')
      .select('curriculumId, rating')
      .in('curriculumId', curriculumIds);

    const { data: reviews, error: reviewsError } = await reviewsQuery;

    if (reviewsError) {
      console.error('Failed to fetch reviews:', reviewsError);
    }

    // Calculate average ratings and review counts
    const reviewStats = new Map();
    reviews?.forEach(review => {
      if (!reviewStats.has(review.curriculumId)) {
        reviewStats.set(review.curriculumId, { totalRating: 0, count: 0 });
      }
      const stats = reviewStats.get(review.curriculumId);
      stats.totalRating += review.rating;
      stats.count += 1;
    });

    // Calculate popularity scores and add review data
    const curriculumsWithStats = curriculums?.map(curriculum => {
      const stats = reviewStats.get(curriculum.id);
      const averageRating = stats ? stats.totalRating / stats.count : null;
      const reviewCount = stats ? stats.count : 0;

      // Calculate popularity score (fork count * 0.7 + average rating * 0.3)
      const popularityScore = (curriculum.forkCount * 0.7) + (averageRating ? averageRating * 0.3 : 0);

      return {
        ...curriculum,
        creator: curriculum.creator?.[0] || { username: null, email: '' },
        averageRating,
        reviewCount,
        popularityScore,
      };
    }) || [];

    // Apply sorting
    const sortedCurriculums = [...curriculumsWithStats];
    
    switch (filters.sort) {
      case 'popular':
        sortedCurriculums.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
      case 'recent':
        sortedCurriculums.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'rating':
        sortedCurriculums.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'forks':
        sortedCurriculums.sort((a, b) => b.forkCount - a.forkCount);
        break;
      default:
        sortedCurriculums.sort((a, b) => b.popularityScore - a.popularityScore);
    }

    return sortedCurriculums;
  } catch (error) {
    console.error('Community curriculums fetch error:', error);
    throw error;
  }
}

export async function getCurriculumById(id: string): Promise<CommunityCurriculum | null> {
  try {
    const { data: curriculum, error } = await supabase
      .from('curriculums')
      .select(`
        id,
        title,
        description,
        domain,
        content,
        isPublic,
        forkCount,
        creatorId,
        createdAt,
        updatedAt,
        creator:users!curriculums_creatorId_fkey(
          username,
          email
        )
      `)
      .eq('id', id)
      .eq('isPublic', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch curriculum: ${error.message}`);
    }

    // Get review statistics
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('curriculumId', id);

    if (reviewsError) {
      console.error('Failed to fetch reviews:', reviewsError);
    }

    const averageRating = reviews && reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

    const popularityScore = (curriculum.forkCount * 0.7) + (averageRating ? averageRating * 0.3 : 0);

    return {
      ...curriculum,
      creator: curriculum.creator?.[0] || { username: null, email: '' },
      averageRating,
      reviewCount: reviews?.length || 0,
      popularityScore,
    };
  } catch (error) {
    console.error('Curriculum fetch error:', error);
    throw error;
  }
}

export async function getUserReview(userId: string, curriculumId: string) {
  try {
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('userId', userId)
      .eq('curriculumId', curriculumId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user review: ${error.message}`);
    }

    return review || null;
  } catch (error) {
    console.error('User review fetch error:', error);
    throw error;
  }
}

export async function submitReview(
  userId: string, 
  curriculumId: string, 
  rating: number, 
  comment?: string
) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        userId,
        curriculumId,
        rating,
        comment,
      }, {
        onConflict: 'userId,curriculumId'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit review: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Submit review error:', error);
    throw error;
  }
}

export async function deleteReview(userId: string, curriculumId: string) {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('userId', userId)
      .eq('curriculumId', curriculumId);

    if (error) {
      throw new Error(`Failed to delete review: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
}
