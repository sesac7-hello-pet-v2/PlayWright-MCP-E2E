# 네비게이션 테스트 (navigation/)

## 📋 목적

페이지 간 이동, 라우팅, 네비게이션 UI 등 사용자 이동 경로를 테스트합니다.

## 🎯 테스트 범위

### 기본 페이지 이동

- [ ] 메인 페이지 (`/`) 접근
- [ ] 피드 페이지 (`/feed`) 이동
- [ ] 게시글 작성 (`/feed/create`) 이동
- [ ] 게시글 수정 (`/feed/edit/:id`) 이동
- [ ] 사용자별 피드 (`/feed/:userId`) 이동

### 네비게이션 UI

- [ ] 헤더 네비게이션 링크
- [ ] 사이드바 네비게이션 (`FeedNavigation`)
- [ ] 브레드크럼 (있는 경우)
- [ ] 뒤로가기 버튼

### 인증 기반 라우팅

- [ ] 비로그인 시 보호된 페이지 접근
- [ ] 로그인 후 원래 페이지로 리다이렉트
- [ ] 권한 없는 페이지 접근 (타인 게시글 수정)

## 📁 파일 구조 (예정)

```
navigation/
├── README.md                    # 이 파일
├── basic-navigation.spec.ts     # 기본 페이지 이동
├── feed-navigation.spec.ts      # 피드 관련 네비게이션
├── auth-navigation.spec.ts      # 인증 기반 라우팅
├── breadcrumb.spec.ts          # 브레드크럼 네비게이션
├── responsive-nav.spec.ts       # 반응형 네비게이션
└── helpers/
    ├── navigation-helper.ts     # 네비게이션 헬퍼
    └── route-data.ts           # 라우트 정의
```

## 🧪 핵심 테스트 시나리오

### 기본 페이지 이동 플로우

1. 메인 페이지 (`/`) 로드
2. "피드" 링크 클릭
3. 피드 페이지 (`/feed`) 로드 확인
4. URL 변경 확인
5. 페이지 제목 업데이트 확인

### 피드 사이드바 네비게이션

1. 피드 페이지에서 사이드바 확인
2. "모든 게시글" 버튼 클릭
3. "내 게시글" 버튼 클릭 (로그인 필요)
4. 비로그인 시 "내 게시글" 버튼 비활성화 확인

### 인증 기반 리다이렉트

1. 비로그인 상태에서 `/feed/create` 접근
2. 로그인 페이지로 리다이렉트 확인
3. 로그인 완료 후 `/feed/create`로 복귀
4. 정상적으로 게시글 작성 페이지 표시

## 🔧 헬퍼 함수 (예정)

### `navigation-helper.ts`

```typescript
export class NavigationHelper {
  async navigateToFeed(): Promise<void>
  async navigateToCreate(): Promise<void>
  async navigateToUserFeed(userId: string): Promise<void>
  async goBack(): Promise<void>
  async verifyCurrentUrl(expectedUrl: string): Promise<void>
  async verifyPageTitle(expectedTitle: string): Promise<void>
}
```

## 📊 우선순위

### P0 (최우선) - 1주차

- 기본 페이지 이동 (/, /feed, /feed/create)
- 피드 사이드바 네비게이션
- 인증 기반 리다이렉트

### P1 (중요) - 2주차

- 뒤로가기/앞으로가기 브라우저 버튼
- URL 직접 입력 접근
- 새 탭에서 열기

### P2 (보완) - 3주차

- 반응형 네비게이션 (모바일)
- 브레드크럼 (구현된 경우)
- 딥링크 처리

## 🎨 레거시 코드 기반 셀렉터

### 메인 네비게이션

```typescript
// 헤더의 네비게이션 링크
const feedLink = page.locator([
  'a[href="/feed"]',
  'nav a:has-text("피드")',
  '.nav-link:has-text("피드")',
  'header a:has-text("피드")'
].join(', '));
```

### 피드 사이드바 네비게이션

```typescript
// FeedNavigation 컴포넌트
const allPostsButton = page.locator([
  'button:has-text("모든 게시글")',
  '.nav-button:has-text("모든 게시글")',
  '[data-testid="all-posts-nav"]'
].join(', '));

const myPostsButton = page.locator([
  'button:has-text("내 게시글")',
  '.nav-button:has-text("내 게시글")',
  '[data-testid="my-posts-nav"]'
].join(', '));
```

### 뒤로가기 버튼

```typescript
// 게시글 작성/수정 페이지의 뒤로가기
const backButton = page.locator([
  'button:has-text("취소")',
  'button:has-text("뒤로")',
  '.back-button',
  '[aria-label*="뒤로"]'
].join(', '));
```

## 🚀 실행 방법

```bash
# 네비게이션 테스트만 실행
cd test && npx playwright test navigation/ --headed

# 기본 네비게이션 테스트
cd test && npx playwright test navigation/basic-navigation.spec.ts --debug

# 인증 기반 라우팅 테스트
cd test && npx playwright test navigation/auth-navigation.spec.ts
```

## 🔍 레거시 코드 분석 결과

### 주요 라우트

- `/`: 메인 페이지 (홈)
- `/feed`: 모든 게시글 피드
- `/feed/create`: 게시글 작성
- `/feed/edit/:id`: 게시글 수정
- `/feed/:userId`: 사용자별 피드
- `/auth/login`: 로그인 페이지

### 관련 컴포넌트

- `FeedNavigation.tsx`: 피드 사이드바 네비게이션
- 헤더 네비게이션 (분석 필요)
- 인증 미들웨어 (라우트 보호)

### 네비게이션 패턴

- **Next.js Router**: `useRouter()` 훅 사용
- **Link 컴포넌트**: Next.js Link 컴포넌트
- **동적 라우팅**: `[id]`, `[userId]` 패라미터

## 🧪 특별 고려사항

### SSR vs CSR 네비게이션

```typescript
// 첫 페이지는 SSR, 이후 네비게이션은 CSR
test('SSR에서 CSR로 네비게이션 전환', async ({ page }) => {
  // 1. 직접 URL 접근 (SSR)
  await page.goto('/feed');
  await expect(page.locator('text=입양을 기다리는 동물들')).toBeVisible();

  // 2. 클라이언트 사이드 네비게이션 (CSR)
  await page.click('a[href="/feed/create"]');
  await expect(page).toHaveURL(/.*\/feed\/create/);

  // 3. 페이지 새로고침 없이 이동했는지 확인
});
```

### 모바일 반응형 네비게이션

```typescript
// 모바일에서 햄버거 메뉴 등
test('모바일 네비게이션', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  // 햄버거 메뉴 또는 하단 네비게이션 확인
  const mobileNav = page.locator('.mobile-nav, .bottom-nav, .hamburger');
  await expect(mobileNav).toBeVisible();
});
```

## 🔍 현재 이슈 및 개선 계획

### 알려진 이슈

- [ ] 브라우저 뒤로가기 시 상태 관리
- [ ] 새 탭에서 열기 시 인증 상태
- [ ] 깊은 링크 접근 시 로딩 상태

### 개선 로드맵

1. **1주차**: 기본 페이지 간 이동 테스트
2. **2주차**: 인증 기반 라우팅 및 리다이렉트
3. **3주차**: 반응형 네비게이션 및 브라우저 호환성
4. **4주차**: 성능 및 SEO 관련 네비게이션 테스트

---

**목표**: 사용자가 직관적이고 예측 가능한 방식으로 페이지 간 이동할 수 있음을 보장
