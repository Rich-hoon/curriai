# CurriAI.com 도메인 설정 가이드

## 1. 도메인 구매
- **Namecheap**: https://www.namecheap.com/ (추천)
- **GoDaddy**: https://www.godaddy.com/
- **Google Domains**: https://domains.google/
- **Cloudflare Registrar**: https://www.cloudflare.com/products/registrar/

## 2. Vercel 프로젝트에 도메인 추가

### 방법 1: Vercel 대시보드에서 (추천)
1. https://vercel.com/dashboard 접속
2. Curri.AI 프로젝트 선택
3. Settings → Domains 클릭
4. "Add Domain" 버튼 클릭
5. `curriai.com` 입력
6. "Add" 클릭

### 방법 2: Vercel CLI로
```bash
vercel domains add curriai.com
```

## 3. DNS 설정

### A. Vercel DNS 사용 (가장 간단)
1. Vercel 대시보드에서 도메인 설정 페이지로 이동
2. "Use Vercel DNS" 옵션 선택
3. Vercel에서 제공하는 Nameservers를 도메인 등록업체에 설정

### B. 기존 DNS 사용
도메인 등록업체의 DNS에서 다음 레코드 추가:

#### Apex 도메인 (curriai.com)
```
Type: A
Name: @
Value: 76.76.19.61
```

#### www 서브도메인
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 4. SSL 인증서
Vercel이 자동으로 Let's Encrypt SSL 인증서를 발급합니다.
- 도메인 연결 후 24시간 이내에 자동 활성화
- HTTPS 리다이렉트 자동 설정

## 5. 환경 변수 업데이트
도메인 연결 후 환경 변수를 업데이트해야 합니다:

```bash
# .env.local 파일에 추가
NEXT_PUBLIC_APP_URL=https://curriai.com
NEXT_PUBLIC_WWW_URL=https://curriai.com
```

## 6. 애플리케이션 설정 업데이트

### Clerk 설정
1. Clerk 대시보드 → Settings → Domains
2. `https://curriai.com` 추가
3. Redirect URLs 업데이트:
   - `https://curriai.com/api/auth/callback/clerk`
   - `https://curriai.com/sign-in`
   - `https://curriai.com/sign-up`

### Supabase 설정
1. Supabase 대시보드 → Settings → API
2. Site URL을 `https://curriai.com`으로 변경

## 7. 검증
도메인 설정 완료 후 확인사항:
- [ ] `https://curriai.com` 접속 가능
- [ ] `https://www.curriai.com` 접속 가능 (www 리다이렉트)
- [ ] SSL 인증서 활성화 (녹색 자물쇠)
- [ ] Clerk 인증 작동
- [ ] Supabase 연결 정상

## 8. SEO 최적화
도메인 연결 후 SEO 설정:

### robots.txt 업데이트
```
User-agent: *
Allow: /
Sitemap: https://curriai.com/sitemap.xml
```

### sitemap.xml 업데이트
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://curriai.com</loc>
    <lastmod>2025-01-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://curriai.com/app</loc>
    <lastmod>2025-01-22</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 비용
- **도메인 등록**: 연간 $10-15
- **Vercel Pro**: 월 $20 (커스텀 도메인, 더 많은 빌드 시간)
- **SSL 인증서**: 무료 (Vercel 제공)

## 문제 해결
1. **DNS 전파 지연**: 최대 48시간 소요
2. **SSL 인증서 오류**: 도메인 연결 후 24시간 대기
3. **CORS 오류**: 환경 변수에서 도메인 URL 확인

## 다음 단계
도메인 설정 완료 후:
1. Google Search Console 등록
2. Google Analytics 설정
3. 소셜 미디어 메타 태그 최적화
4. 성능 모니터링 설정
