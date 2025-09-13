# Curri.AI 배포 가이드

## 🚀 AI 커리큘럼 생성 API 구현 완료

### 완료된 기능들

✅ **커리큘럼 생성 폼 컴포넌트**
- 목표, 기간, 학습 스타일, 숙련도, 도메인 입력
- 실시간 유효성 검사 및 사용자 친화적 UI
- 로딩 상태 및 에러 처리

✅ **Zod 검증 스키마**
- 입력 데이터 검증
- AI 응답 구조 검증
- 타입 안전성 보장

✅ **Supabase Edge Function**
- OpenAI GPT-4 연동
- Clerk JWT 인증
- 레이트 리미팅 (일일 5회 제한)
- 재시도 메커니즘 (지수 백오프)
- CORS 지원

✅ **데이터베이스 스키마**
- 커리큘럼 모델 업데이트
- 레이트 리미팅 테이블 추가
- 관계 설정 및 인덱스 최적화

## 📋 배포 전 체크리스트

### 1. 환경 변수 설정

```bash
# .env 파일 생성
cp env.example .env

# 다음 값들을 실제 값으로 업데이트:
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
OPENAI_API_KEY="your_openai_api_key"
```

### 2. 데이터베이스 마이그레이션

```bash
# Prisma 마이그레이션 생성
cd packages/prisma
npx prisma migrate dev --name "add-curriculum-generation"

# Prisma 클라이언트 생성
npx prisma generate
```

### 3. Supabase 설정

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 프로젝트 로그인
supabase login

# Edge Function 배포
supabase functions deploy generate-curriculum

# 환경 변수 설정 (Supabase 대시보드에서)
# - OPENAI_API_KEY
# - CLERK_SECRET_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### 4. Clerk 설정

1. Clerk 대시보드에서 새 프로젝트 생성
2. API 키 복사하여 환경 변수에 설정
3. 허용된 도메인에 프로덕션 URL 추가

### 5. OpenAI 설정

1. OpenAI API 키 생성
2. 사용량 한도 설정 (비용 관리)
3. 환경 변수에 API 키 설정

## 🎯 배포 옵션

### Option 1: Vercel (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 배포
vercel --prod

# 환경 변수 설정 (Vercel 대시보드에서)
# - 모든 환경 변수 추가
```

### Option 2: Railway

```bash
# Railway CLI 설치
npm install -g @railway/cli

# Railway 로그인
railway login

# 프로젝트 배포
railway deploy

# 환경 변수 설정
railway variables set DATABASE_URL="your_database_url"
railway variables set OPENAI_API_KEY="your_openai_key"
# ... 기타 환경 변수들
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Docker 이미지 빌드
docker build -t curri-ai .

# Docker 컨테이너 실행
docker run -p 3000:3000 --env-file .env curri-ai
```

## 🔧 로컬 개발 환경 실행

```bash
# 의존성 설치
npm install

# Supabase 로컬 실행
supabase start

# 개발 서버 실행
npm run dev
```

## 📊 모니터링 및 로그

### Supabase Edge Function 로그 확인
```bash
supabase functions logs generate-curriculum
```

### OpenAI API 사용량 모니터링
- OpenAI 대시보드에서 실시간 사용량 확인
- 비용 알림 설정 권장

### 에러 모니터링
- Vercel: 대시보드에서 함수 로그 확인
- Railway: 로그 탭에서 실시간 로그 확인

## 🚨 중요 사항

1. **비용 관리**: OpenAI API 사용량 모니터링 필수
2. **보안**: 환경 변수 절대 공개 저장소에 커밋 금지
3. **레이트 리미팅**: 일일 5회 제한으로 비용 통제
4. **백업**: 정기적인 데이터베이스 백업 권장

## 🎉 완료!

이제 Curri.AI의 AI 커리큘럼 생성 기능이 완전히 구현되었습니다. 사용자들은 자신의 학습 목표를 입력하면 AI가 맞춤형 커리큘럼을 생성해주는 기능을 사용할 수 있습니다.

### 다음 단계
- 사용자 대시보드 구현
- 커리큘럼 상세 페이지 개발
- 학습 진행률 시각화 (잔디 그래프)
- 커뮤니티 기능 (포크, 리뷰)
