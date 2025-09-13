# 🚀 Curri.AI Production Deployment Guide

This guide covers the complete deployment process for Curri.AI to Vercel with Supabase and Clerk integration.

## 📋 Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code pushed to GitHub repository
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Edge Functions tested locally

### 2. Service Accounts
- [ ] Vercel account with GitHub integration
- [ ] Supabase project created
- [ ] Clerk application configured
- [ ] OpenAI API key obtained

## 🔧 Step 1: Supabase Setup

### 1.1 Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create new project (or link existing)
supabase projects create curri-ai --region us-east-1
```

### 1.2 Database Setup
```bash
# Link to your project
supabase link --project-ref [PROJECT-REF]

# Run database migrations
supabase db push

# Generate Prisma client
cd packages/prisma
pnpm db:generate
```

### 1.3 Edge Functions Deployment
```bash
# Deploy Edge Functions
supabase functions deploy generate-curriculum
supabase functions deploy fork-curriculum

# Set CORS for production domain
supabase functions serve --env-file .env.local
```

### 1.4 Environment Variables from Supabase
Get these values from your Supabase dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL`

## 🔐 Step 2: Clerk Setup

### 2.1 Create Clerk Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Configure authentication methods (Email, Google, GitHub)
4. Set up webhooks for user sync

### 2.2 Configure Redirects
Set these redirect URLs in Clerk:
- **Sign-in URL**: `https://curri-ai.vercel.app/sign-in`
- **Sign-up URL**: `https://curri-ai.vercel.app/sign-up`
- **After sign-in URL**: `https://curri-ai.vercel.app/app/dashboard`
- **After sign-up URL**: `https://curri-ai.vercel.app/app/dashboard`

### 2.3 Webhook Configuration
Create webhook endpoint in Clerk:
- **Endpoint URL**: `https://curri-ai.vercel.app/api/webhooks/clerk`
- **Events**: `user.created`, `user.updated`, `user.deleted`

### 2.4 Environment Variables from Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

## 🌐 Step 3: Vercel Deployment

### 3.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:

**Root Directory**: Leave empty (monorepo)
**Build Command**: `pnpm build`
**Output Directory**: Leave empty
**Install Command**: `pnpm install`

### 3.2 Environment Variables
Add all environment variables from `env.production.example`:

#### Public Variables (Client-side safe):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

#### Private Variables (Server-side only):
```
DATABASE_URL
DIRECT_URL
SUPABASE_SERVICE_ROLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
OPENAI_API_KEY
JWT_SECRET
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### 3.3 Build Configuration
Update `vercel.json` if needed for your specific setup.

### 3.4 Deploy
```bash
# Trigger deployment
git push origin main

# Or deploy manually
vercel --prod
```

## 🔍 Step 4: Post-Deployment Verification

### 4.1 Basic Functionality Test
- [ ] Homepage loads correctly
- [ ] Authentication flow works
- [ ] Dashboard displays
- [ ] Curriculum creation works
- [ ] Community features function
- [ ] Grass chart displays

### 4.2 API Endpoints Test
```bash
# Test Supabase Edge Functions
curl -X POST "https://[PROJECT-REF].supabase.co/functions/v1/generate-curriculum" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"goal": "Learn React", "duration": 90, "domain": "frontend"}'

# Test Clerk webhook
curl -X POST "https://curri-ai.vercel.app/api/webhooks/clerk" \
  -H "Content-Type: application/json" \
  -d '{"type": "user.created", "data": {...}}'
```

### 4.3 Database Verification
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies;
```

### 4.4 Security Checks
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Environment variables not exposed
- [ ] Rate limiting active

## 📊 Step 5: Monitoring Setup

### 5.1 Vercel Analytics
```javascript
// Already configured in next.config.js
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

### 5.2 Error Tracking
```javascript
// Add to your error boundary
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 5.3 Logging
Monitor these logs:
- Vercel Function logs
- Supabase Edge Function logs
- Clerk webhook logs
- Database query logs

## 🔄 Step 6: CI/CD Pipeline

### 6.1 GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
```

### 6.2 Branch Protection
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs [deployment-url]

# Common fixes
pnpm install --frozen-lockfile
pnpm build --debug
```

#### 2. Environment Variables
```bash
# Verify env vars are set
vercel env ls

# Update env vars
vercel env add VARIABLE_NAME
```

#### 3. Database Connection
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check migrations
supabase db diff
```

#### 4. Edge Functions
```bash
# Check function logs
supabase functions logs generate-curriculum

# Redeploy functions
supabase functions deploy generate-curriculum --no-verify-jwt
```

## 📈 Performance Optimization

### 1. Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### 2. Bundle Analysis
```bash
# Analyze bundle size
pnpm build
pnpm analyze
```

### 3. Caching Strategy
- Static assets: Long-term caching
- API responses: Appropriate cache headers
- Database queries: Connection pooling

## 🔒 Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] CORS properly set up
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection configured

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase function logs
3. Verify environment variables
4. Test locally with production config
5. Contact support with specific error messages

---

**Deployment Complete!** 🎉

Your Curri.AI application should now be live at `https://curri-ai.vercel.app`
