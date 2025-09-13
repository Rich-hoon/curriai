import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

// Input validation schema
const CurriculumGenerationInputSchema = z.object({
  goal: z.string().min(10).max(500),
  duration: z.number().min(1).max(52),
  learningStyle: z.enum(["hands-on", "theoretical", "project-based", "mixed"]),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  domain: z.enum(["frontend", "backend", "fullstack", "mobile", "data-science"]),
});

// Curriculum content validation schema
const CurriculumContentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedHours: z.number().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).min(1),
  modules: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    duration: z.number().min(1),
    order: z.number().min(1),
    lessons: z.array(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().min(1),
      duration: z.number().min(1),
      type: z.enum(["theory", "practice", "project", "assessment"]),
      resources: z.array(z.object({
        title: z.string().min(1),
        url: z.string().url(),
        type: z.enum(["article", "video", "tutorial", "documentation", "book"]),
      })).optional(),
      objectives: z.array(z.string()).min(1),
    })).min(1),
  })).min(1),
  assessment: z.object({
    quizzes: z.array(z.object({
      id: z.string(),
      title: z.string().min(1),
      questions: z.number().min(1),
    })).optional(),
    projects: z.array(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().min(1),
      requirements: z.array(z.string()).min(1),
    })).optional(),
  }).optional(),
  timeline: z.array(z.object({
    week: z.number().min(1),
    focus: z.string().min(1),
    modules: z.array(z.string()).min(1),
    milestones: z.array(z.string()).optional(),
  })).min(1),
});

// Clerk JWT verification
async function verifyClerkJWT(token: string): Promise<string> {
  try {
    const response = await fetch(`https://api.clerk.com/v1/sessions/${token}/verify`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CLERK_SECRET_KEY')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();
    return data.user_id;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Authentication failed');
  }
}

// Rate limiting check
async function checkRateLimit(userId: string, supabase: any): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  const limit = 5; // Daily limit
  const currentCount = existing?.count || 0;

  if (currentCount >= limit) {
    return false;
  }

  // Update or create rate limit record
  await supabase
    .from('rate_limits')
    .upsert({
      user_id: userId,
      date: today,
      count: currentCount + 1,
    });

  return true;
}

// Build OpenAI prompt
function buildPrompt(input: z.infer<typeof CurriculumGenerationInputSchema>): string {
  const domainLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발", 
    fullstack: "풀스택 개발",
    mobile: "모바일 앱 개발",
    data-science: "데이터 사이언스"
  };

  const levelLabels = {
    beginner: "초급자",
    intermediate: "중급자", 
    advanced: "고급자"
  };

  const styleLabels = {
    "hands-on": "실습 중심",
    "theoretical": "이론 중심",
    "project-based": "프로젝트 기반",
    "mixed": "혼합형"
  };

  return `
당신은 전문적인 교육과정 설계자입니다. 다음 요구사항에 따라 상세한 학습 커리큘럼을 JSON 형식으로 생성해주세요.

**학습 목표**: ${input.goal}
**기술 도메인**: ${domainLabels[input.domain]}
**학습 기간**: ${input.duration}주
**현재 숙련도**: ${levelLabels[input.currentLevel]}
**학습 스타일**: ${styleLabels[input.learningStyle]}

다음 JSON 스키마를 정확히 따라주세요:

{
  "title": "커리큘럼 제목",
  "description": "상세한 커리큘럼 설명",
  "estimatedHours": 예상총학습시간(숫자),
  "difficulty": "beginner|intermediate|advanced",
  "prerequisites": ["선수지식1", "선수지식2"],
  "learningOutcomes": ["학습결과1", "학습결과2"],
  "modules": [
    {
      "id": "모듈고유ID",
      "title": "모듈제목",
      "description": "모듈설명",
      "duration": 모듈기간(숫자),
      "order": 순서번호(숫자),
      "lessons": [
        {
          "id": "강의고유ID",
          "title": "강의제목",
          "description": "강의설명",
          "duration": 강의시간(숫자),
          "type": "theory|practice|project|assessment",
          "resources": [
            {
              "title": "리소스제목",
              "url": "https://example.com",
              "type": "article|video|tutorial|documentation|book"
            }
          ],
          "objectives": ["학습목표1", "학습목표2"]
        }
      ]
    }
  ],
  "assessment": {
    "quizzes": [
      {
        "id": "퀴즈ID",
        "title": "퀴즈제목",
        "questions": 문제수(숫자)
      }
    ],
    "projects": [
      {
        "id": "프로젝트ID",
        "title": "프로젝트제목",
        "description": "프로젝트설명",
        "requirements": ["요구사항1", "요구사항2"]
      }
    ]
  },
  "timeline": [
    {
      "week": 주차번호(숫자),
      "focus": "주차별집중영역",
      "modules": ["모듈ID1", "모듈ID2"],
      "milestones": ["마일스톤1", "마일스톤2"]
    }
  ]
}

중요 사항:
1. 모든 필드는 필수이며, 정확한 JSON 형식을 지켜주세요
2. ID는 고유한 문자열이어야 합니다
3. 실제 존재하는 학습 리소스 URL을 제공해주세요
4. 학습자의 현재 수준에 맞는 적절한 난이도로 구성해주세요
5. ${input.learningStyle} 학습 스타일에 맞게 구성해주세요
6. 한국어로 작성해주세요
`;
}

// Retry mechanism with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const userId = await verifyClerkJWT(token);

    // Check rate limit
    const rateLimitAllowed = await checkRateLimit(userId, supabase);
    if (!rateLimitAllowed) {
      return new Response(
        JSON.stringify({ success: false, error: 'Daily limit exceeded' }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Parse and validate input
    const body = await req.json();
    const input = CurriculumGenerationInputSchema.parse(body);

    // Build prompt and call OpenAI
    const prompt = buildPrompt(input);
    
    const openaiResponse = await retryWithBackoff(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are a professional curriculum designer. Return strict JSON following the provided schema.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      return response;
    });

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse and validate curriculum content
    const curriculumData = JSON.parse(content);
    const validatedCurriculum = CurriculumContentSchema.parse(curriculumData);

    // Save to database
    const { data: curriculum, error } = await supabase
      .from('curriculums')
      .insert({
        creatorId: userId,
        title: validatedCurriculum.title,
        description: validatedCurriculum.description,
        domain: input.domain,
        content: validatedCurriculum,
        isPublic: true,
        forkCount: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save curriculum');
    }

    console.log(`Curriculum created successfully: ${curriculum.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        curriculumId: curriculum.id 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Curriculum generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        }
      }
    );
  }
});
