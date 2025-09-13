"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Button } from "@myapp/ui/components/button";
import { Textarea } from "@myapp/ui/components/textarea";
import { Star, MessageSquare, User, Trash2, Edit3, Send } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { submitReview, deleteReview } from "@/lib/supabase/community";

interface UserReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReviewSectionProps {
  curriculumId: string;
  userReview: UserReview | null;
  currentUserId: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  user: {
    username: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function ReviewSection({ curriculumId, userReview, currentUserId }: ReviewSectionProps) {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [comment, setComment] = useState(userReview?.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real implementation, you would fetch reviews here
    // For now, we'll use mock data
    setReviews([
      {
        id: "1",
        rating: 5,
        comment: "정말 체계적이고 도움이 되는 커리큘럼입니다. 초보자도 쉽게 따라할 수 있어요!",
        userId: "user1",
        user: {
          username: "김학습",
          email: "learner@example.com",
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        rating: 4,
        comment: "좋은 내용이지만 일부 강의가 조금 어려웠습니다. 중급자에게 적합할 것 같아요.",
        userId: "user2",
        user: {
          username: "박개발",
          email: "dev@example.com",
        },
        createdAt: "2024-01-14T15:30:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
      },
    ]);
    setLoading(false);
  }, [curriculumId]);

  const handleSubmitReview = async () => {
    if (!user || rating === 0) {
      toast.error("평점을 선택해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await submitReview(currentUserId, curriculumId, rating, comment || undefined);
      
      if (userReview) {
        toast.success("리뷰가 수정되었습니다.");
      } else {
        toast.success("리뷰가 작성되었습니다.");
      }
      
      setIsEditing(false);
      // Refresh reviews or update state
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("리뷰 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) {
      return;
    }

    setDeleting(true);

    try {
      await deleteReview(currentUserId, curriculumId);
      toast.success("리뷰가 삭제되었습니다.");
      setRating(0);
      setComment("");
      setIsEditing(false);
    } catch (error) {
      console.error("Review deletion error:", error);
      toast.error("리뷰 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onRatingChange?.(i + 1)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star
              className={`w-5 h-5 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">리뷰를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Write Review */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              {userReview ? "내 리뷰 수정하기" : "리뷰 작성하기"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점 *
              </label>
              {renderStars(rating, true, setRating)}
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                코멘트 (선택사항)
              </label>
              <Textarea
                id="comment"
                placeholder="이 커리큘럼에 대한 의견을 공유해주세요..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] border-2 border-gray-200 focus:border-blue-500"
                disabled={submitting || deleting}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || deleting || rating === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {userReview ? "수정 중..." : "작성 중..."}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {userReview ? "수정하기" : "작성하기"}
                  </>
                )}
              </Button>

              {userReview && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={submitting || deleting}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "취소" : "수정"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteReview}
                    disabled={submitting || deleting}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {deleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        삭제 중...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            사용자 리뷰 ({reviews.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">아직 리뷰가 없습니다.</p>
              <p className="text-sm text-gray-500 mt-1">첫 번째 리뷰를 작성해보세요!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.user.username || review.user.email.split('@')[0]}
                        </h4>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
