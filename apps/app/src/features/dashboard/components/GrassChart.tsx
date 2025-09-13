"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@myapp/ui/components/card";
import { Badge } from "@myapp/ui/components/badge";
import { Calendar, TrendingUp, Target, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { getHeatmapData, getHeatmapStats, getContributionLevelDescription } from "@/lib/supabase/heatmap";
import type { HeatmapDataPoint, HeatmapStats } from "@/lib/supabase/heatmap";

// Dynamically import ActivityCalendar to avoid SSR issues
const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((mod) => mod.ActivityCalendar),
  { ssr: false }
);

interface GrassChartProps {
  userId: string;
  className?: string;
}

export function GrassChart({ userId, className }: GrassChartProps) {
  // Skip Clerk hooks during SSR/build time
  if (typeof window === "undefined") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            학습 활동 그래프
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-gray-500">
            로딩 중...
          </div>
        </CardContent>
      </Card>
    );
  }

  const { user } = useUser();
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const [stats, setStats] = useState<HeatmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [heatmap, heatmapStats] = await Promise.all([
        getHeatmapData(userId),
        getHeatmapStats(userId),
      ]);
      
      setHeatmapData(heatmap);
      setStats(heatmapStats);
      setError(null);
    } catch (err) {
      console.error("Failed to load heatmap data:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      toast.error("학습 기록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId, loadData]);

  // Set up realtime subscription for live updates
  useEffect(() => {
    if (!user) return;

    // In a real implementation, you would set up Supabase realtime subscription here
    // For now, we'll simulate with a periodic refresh
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user, userId, loadData]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            학습 활동 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            학습 활동 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for react-activity-calendar
  const calendarData = heatmapData.map(point => ({
    date: point.date,
    count: point.count,
    level: point.level,
  }));

  const theme = {
    light: ['#f1f5f9', '#cbd5e1', '#94a3b8', '#64748b', '#475569'],
    dark: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'],
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            학습 활동 기록
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            최근 1년
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalContributions}</div>
              <div className="text-xs text-gray-600">총 활동</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
              <div className="text-xs text-gray-600">현재 연속</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.longestStreak}</div>
              <div className="text-xs text-gray-600">최장 연속</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.averagePerDay}</div>
              <div className="text-xs text-gray-600">일평균</div>
            </div>
          </div>
        )}

        {/* Activity Calendar */}
        <div className="overflow-x-auto">
          <ActivityCalendar
            data={calendarData}
            theme={theme}
            colorScheme="dark"
            labels={{
              months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              weekdays: ['일', '월', '화', '수', '목', '금', '토'],
              totalCount: `${stats?.totalContributions || 0}번의 활동을 ${calendarData.filter(d => d.count > 0).length}일 동안 했습니다`,
            }}
            blockSize={12}
            blockRadius={3}
            blockMargin={3}
            fontSize={12}
            showWeekdayLabels
            style={{
              width: '100%',
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>활동량</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: theme.dark[level],
                  }}
                  title={getContributionLevelDescription(level)}
                />
              ))}
            </div>
            <span>더 많은 활동</span>
          </div>
        </div>

        {/* Motivational Message */}
        {stats && (
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            {stats.currentStreak === 0 && (
              <p className="text-gray-600">
                <Zap className="w-4 h-4 inline mr-1" />
                오늘부터 꾸준한 학습을 시작해보세요! 🚀
              </p>
            )}
            {stats.currentStreak > 0 && stats.currentStreak < 7 && (
              <p className="text-blue-600 font-medium">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {stats.currentStreak}일 연속 학습 중! 계속 화이팅! 💪
              </p>
            )}
            {stats.currentStreak >= 7 && stats.currentStreak < 30 && (
              <p className="text-green-600 font-medium">
                <Target className="w-4 h-4 inline mr-1" />
                {stats.currentStreak}일 연속! 훌륭한 학습 습관이에요! 🌟
              </p>
            )}
            {stats.currentStreak >= 30 && (
              <p className="text-purple-600 font-bold">
                <Zap className="w-4 h-4 inline mr-1" />
                {stats.currentStreak}일 연속! 학습의 달인이 되셨네요! 🔥
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
