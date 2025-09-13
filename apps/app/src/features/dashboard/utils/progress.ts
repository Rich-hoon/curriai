export interface ProgressData {
  percent: number;
  label: string;
  completedLessons: number;
  totalLessons: number;
  totalHours: number;
  completedModules: number;
}

export function computeProgress(progressAgg: {
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  completedModules: number;
  activeCurriculums: number;
}): ProgressData {
  const percent = progressAgg.totalLessons > 0 
    ? Math.round((progressAgg.completedLessons / progressAgg.totalLessons) * 100)
    : 0;

  let label = "학습 시작하기";
  if (percent > 0 && percent < 25) {
    label = "학습 시작!";
  } else if (percent >= 25 && percent < 50) {
    label = "꾸준히 진행 중";
  } else if (percent >= 50 && percent < 75) {
    label = "절반 완주!";
  } else if (percent >= 75 && percent < 100) {
    label = "거의 다 왔어요!";
  } else if (percent === 100) {
    label = "완주 축하합니다! 🎉";
  }

  return {
    percent,
    label,
    completedLessons: progressAgg.completedLessons,
    totalLessons: progressAgg.totalLessons,
    totalHours: progressAgg.totalHours,
    completedModules: progressAgg.completedModules,
  };
}

export interface TodayCardData {
  tasks: Array<{
    curriculumId: string;
    curriculumTitle: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonDuration: number;
    lessonType: string;
  }>;
  hasTasks: boolean;
  totalEstimatedTime: number;
}

export function buildTodayCard(
  curriculums: any[],
  progressAgg: {
    totalLessons: number;
    completedLessons: number;
    totalHours: number;
    completedModules: number;
    activeCurriculums: number;
  }
): TodayCardData {
  // For now, return mock data since we need the actual lesson structure
  // In a real implementation, this would parse the curriculum content
  // and find the next lessons to study
  
  const mockTasks = [
    {
      curriculumId: "1",
      curriculumTitle: "Next.js 풀스택 웹 개발",
      moduleTitle: "React 기초",
      lessonTitle: "컴포넌트와 Props 이해하기",
      lessonDuration: 45,
      lessonType: "theory",
    },
    {
      curriculumId: "2",
      curriculumTitle: "Python 데이터 사이언스",
      moduleTitle: "데이터 분석 기초",
      lessonTitle: "Pandas 데이터프레임 조작",
      lessonDuration: 60,
      lessonType: "practice",
    },
  ];

  const totalEstimatedTime = mockTasks.reduce((sum, task) => sum + task.lessonDuration, 0);

  return {
    tasks: mockTasks,
    hasTasks: mockTasks.length > 0,
    totalEstimatedTime,
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${remainingMinutes}분`;
}

export function getLessonTypeIcon(type: string): string {
  switch (type) {
    case "theory":
      return "📚";
    case "practice":
      return "💻";
    case "project":
      return "🚀";
    case "assessment":
      return "📝";
    default:
      return "📖";
  }
}

export function getLessonTypeLabel(type: string): string {
  switch (type) {
    case "theory":
      return "이론";
    case "practice":
      return "실습";
    case "project":
      return "프로젝트";
    case "assessment":
      return "평가";
    default:
      return "학습";
  }
}
