import { z } from "zod";

// Input schema for curriculum generation request
export const CurriculumGenerationInputSchema = z.object({
  goal: z.string().min(10, "학습 목표는 최소 10자 이상 입력해주세요.").max(500, "학습 목표는 500자를 초과할 수 없습니다."),
  duration: z.number().min(1).max(52, "학습 기간은 1-52주 사이여야 합니다."),
  learningStyle: z.enum(["hands-on", "theoretical", "project-based", "mixed"]),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  domain: z.enum(["frontend", "backend", "fullstack", "mobile", "data-science"]),
});

// Curriculum content schema for AI response validation
export const CurriculumContentSchema = z.object({
  title: z.string().min(1, "제목이 필요합니다."),
  description: z.string().min(1, "설명이 필요합니다."),
  estimatedHours: z.number().min(1, "예상 학습 시간이 필요합니다."),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).min(1, "학습 결과는 최소 1개 이상 필요합니다."),
  modules: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "모듈 제목이 필요합니다."),
    description: z.string().min(1, "모듈 설명이 필요합니다."),
    duration: z.number().min(1, "모듈 기간이 필요합니다."),
    order: z.number().min(1, "모듈 순서가 필요합니다."),
    lessons: z.array(z.object({
      id: z.string(),
      title: z.string().min(1, "강의 제목이 필요합니다."),
      description: z.string().min(1, "강의 설명이 필요합니다."),
      duration: z.number().min(1, "강의 시간이 필요합니다."),
      type: z.enum(["theory", "practice", "project", "assessment"]),
      resources: z.array(z.object({
        title: z.string().min(1, "리소스 제목이 필요합니다."),
        url: z.string().url("올바른 URL 형식이 필요합니다."),
        type: z.enum(["article", "video", "tutorial", "documentation", "book"]),
      })).optional(),
      objectives: z.array(z.string()).min(1, "학습 목표는 최소 1개 이상 필요합니다."),
    })).min(1, "모듈당 최소 1개의 강의가 필요합니다."),
  })).min(1, "최소 1개의 모듈이 필요합니다."),
  assessment: z.object({
    quizzes: z.array(z.object({
      id: z.string(),
      title: z.string().min(1, "퀴즈 제목이 필요합니다."),
      questions: z.number().min(1, "퀴즈 문제 수가 필요합니다."),
    })).optional(),
    projects: z.array(z.object({
      id: z.string(),
      title: z.string().min(1, "프로젝트 제목이 필요합니다."),
      description: z.string().min(1, "프로젝트 설명이 필요합니다."),
      requirements: z.array(z.string()).min(1, "프로젝트 요구사항이 필요합니다."),
    })).optional(),
  }).optional(),
  timeline: z.array(z.object({
    week: z.number().min(1),
    focus: z.string().min(1, "주차별 집중 영역이 필요합니다."),
    modules: z.array(z.string()).min(1, "주차별 모듈이 필요합니다."),
    milestones: z.array(z.string()).optional(),
  })).min(1, "학습 타임라인이 필요합니다."),
});

// Complete curriculum schema
export const CurriculumSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "제목이 필요합니다."),
  description: z.string().min(1, "설명이 필요합니다."),
  domain: z.string().min(1, "도메인이 필요합니다."),
  content: CurriculumContentSchema,
  isPublic: z.boolean().default(true),
  forkCount: z.number().default(0),
  creatorId: z.string().min(1, "생성자 ID가 필요합니다."),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Rate limiting schema
export const RateLimitSchema = z.object({
  userId: z.string().min(1, "사용자 ID가 필요합니다."),
  count: z.number().min(0),
  resetTime: z.date(),
});

// API response schemas
export const CurriculumGenerationResponseSchema = z.object({
  success: z.boolean(),
  curriculumId: z.string().optional(),
  error: z.string().optional(),
});

export const RateLimitResponseSchema = z.object({
  allowed: z.boolean(),
  remaining: z.number(),
  resetTime: z.date(),
});

// Type exports
export type CurriculumGenerationInput = z.infer<typeof CurriculumGenerationInputSchema>;
export type CurriculumContent = z.infer<typeof CurriculumContentSchema>;
export type Curriculum = z.infer<typeof CurriculumSchema>;
export type RateLimit = z.infer<typeof RateLimitSchema>;
export type CurriculumGenerationResponse = z.infer<typeof CurriculumGenerationResponseSchema>;
export type RateLimitResponse = z.infer<typeof RateLimitResponseSchema>;
