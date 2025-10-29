# Navigation E2E 테스트 전략

Hello Pet v2 프로젝트의 네비게이션 기능에 대한 E2E 테스트 계획 및 단계별 진행 방법

## 📋 프론트엔드 네비게이션 구조 분석

### 1. 레이아웃 구조

- **루트 레이아웃** (`app/layout.tsx`): 기본 HTML 구조
- **사이트 레이아웃** (`app/(site)/layout.tsx`): Navigator + Bottom 포함
- **인증 레이아웃** (`app/auth/layout.tsx`): 간단한 헤더만 포함

### 2. 주요 네비게이션 컴포넌트

#### Navigator 컴포넌트 (`app/components/Navigator.tsx`)

- **로고**: Hello Pet 브랜드 링크 (홈으로 이동)
- **메인 메뉴**:
    - 소개 (`/about`)
    - 입양게시판 (`/announcements`)
    - 피드 (`/feed`)
    - 공지사항 (`/notices`)
- **사용자 인증**:
    - 로그인 전: 로그인 버튼 (`/auth/login`)
    - 로그인 후: 프로필 드롭다운 (마이페이지, 로그아웃)

#### FeedNavigation 컴포넌트 (`app/(site)/feed/components/FeedNavigation.tsx`)

- **모든 게시글** (`/feed`)
- **내 게시글** (`/feed/{userId}`) - 로그인 시에만 활성화

### 3. 주요 페이지 라우팅

```
/(site)/
├── about/                 # 소개 페이지
├── announcements/         # 입양게시판
│   ├── create/           # 게시글 작성
│   ├── edit/[id]/        # 게시글 편집
│   └── [id]/             # 게시글 상세
├── feed/                 # 피드
│   ├── create/           # 게시글 작성
│   ├── edit/[id]/        # 게시글 편집
│   └── [userId]/         # 사용자별 피드
├── me/                   # 마이페이지
├── notices/              # 공지사항
├── 401/, 403/            # 에러 페이지
/auth/
├── signup/               # 회원가입
├── login/                # 로그인
└── ...                   # 기타 인증 관련 페이지
```

## 🧪 단계별 E2E 테스트 진행 계획

### Phase 1: 기본 네비게이션 테스트

**목표**: 로그인 상태와 관계없이 접근 가능한 기본 네비게이션 기능 검증

#### 1.1 헤더 네비게이션 테스트

- [ ] **로고 클릭**: Hello Pet 로고 클릭 시 홈페이지 이동
- [ ] **메뉴 링크**: 소개, 입양게시판, 피드, 공지사항 링크 동작
- [ ] **반응형**: 다양한 화면 크기에서 네비게이션 표시
- [ ] **호버 효과**: 메뉴 아이템 호버 시 색상 변경

#### 1.2 기본 페이지 접근 테스트

- [ ] `/about` 페이지 접근 및 렌더링
- [ ] `/announcements` 페이지 접근 및 렌더링
- [ ] `/feed` 페이지 접근 및 렌더링
- [ ] `/notices` 페이지 접근 및 렌더링

### Phase 2: 인증 상태별 네비게이션 테스트

**목표**: 로그인/로그아웃 상태에 따른 네비게이션 차이 검증

#### 2.1 비로그인 상태 테스트

- [ ] **로그인 버튼**: 네비게이션에 로그인 버튼 표시
- [ ] **로그인 페이지 이동**: 로그인 버튼 클릭 시 `/auth/login` 이동
- [ ] **제한된 기능**: 로그인이 필요한 페이지 접근 시 처리 (예시 `/feed/create`)
- [ ] **로그인 처리**: 테스트 계정을 사용해서 로그인 기능 테스트 후 모달 정상 출력 여부

#### 2.2 로그인 상태 테스트

- [ ] **프로필 이미지**: 사용자 프로필 이미지 표시
- [ ] **드롭다운 메뉴**: 프로필 클릭 시 드롭다운 메뉴 표시
- [ ] **마이페이지 이동**: 드롭다운에서 마이페이지 클릭 시 `/me` 이동
- [ ] **로그아웃 기능**: 로그아웃 버튼 클릭 시 로그아웃 처리 후 로그아웃 모달 정상 출력
- [ ] **드롭다운 닫기**: 외부 클릭 시 드롭다운 메뉴 닫기

### Phase 3: 피드 내부 네비게이션 테스트

**목표**: 피드 페이지 내 서브 네비게이션 기능 검증

#### 3.1 FeedNavigation 컴포넌트 테스트

- [ ] **모든 게시글**: "모든 게시글" 버튼 클릭 시 `/feed` 이동
- [ ] **내 게시글**: "내 게시글" 버튼 클릭 시 `/feed/{userId}` 이동
- [ ] **로그인 제한**: 비로그인 시 "내 게시글" 버튼 비활성화
- [ ] **활성 상태**: 현재 페이지에 따른 버튼 활성 상태 표시

### Phase 4: 에러 및 예외 상황 테스트

**목표**: 오류 상황에서의 네비게이션 동작 검증

#### 4.1 에러 페이지 테스트

- [ ] **401 페이지**: 권한 없음 페이지 접근 및 네비게이션
- [ ] **403 페이지**: 접근 금지 페이지 접근 및 네비게이션
- [ ] **404 페이지**: 존재하지 않는 페이지 접근 시 처리

#### 4.2 네트워크 오류 상황

- [ ] **API 실패**: 로그아웃 API 실패 시 처리
- [ ] **토큰 만료**: 토큰 만료 시 자동 로그아웃 및 리다이렉트

### Phase 5: 성능 및 접근성 테스트

**목표**: 네비게이션의 성능과 접근성 검증

#### 5.1 성능 테스트

- [ ] **로딩 시간**: 페이지 간 네비게이션 시 로딩 속도
- [ ] **메모리 누수**: 반복적인 네비게이션 시 메모리 사용량
- [ ] **캐싱**: 이미 방문한 페이지 캐싱 동작

#### 5.2 접근성 테스트

- [ ] **키보드 네비게이션**: Tab 키를 이용한 메뉴 접근
- [ ] **스크린 리더**: 스크린 리더로 메뉴 항목 읽기
- [ ] **포커스 관리**: 페이지 이동 시 포커스 관리

## 🛠️ 테스트 구현 방법

### 1. 구현된 유틸리티 시스템 활용 ✅

```typescript
// ../util/helpers에서 구현된 헬퍼 클래스들 활용
import { AuthHelper, PageHelper, SelectorHelper, TEST_ACCOUNTS } from '../util/helpers';

test('네비게이션 테스트 예시', async ({ page }) => {
  // 페이지 로딩 대기
  await PageHelper.waitForPageLoad(page);

  // 플렉시블 셀렉터 사용
  const navSelectors = SelectorHelper.getNavigationSelectors();

  // 테스트 계정으로 로그인
  await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
});
```

### 2. 현재 테스트 파일 구조 ✅

```
test/navigation/
├── README.md                    # 이 파일 (테스트 전략 문서)
├── Phase1/                      # Phase 1: 기본 네비게이션 테스트
│   └── (테스트 파일 생성 예정)
├── Phase2/                      # Phase 2: 인증 상태별 네비게이션 테스트
│   └── (테스트 파일 생성 예정)
├── Phase3/                      # Phase 3: 피드 내부 네비게이션 테스트
│   └── (테스트 파일 생성 예정)
├── Phase4/                      # Phase 4: 에러 및 예외 상황 테스트
│   └── (테스트 파일 생성 예정)
└── Phase5/                      # Phase 5: 성능 및 접근성 테스트
    └── (테스트 파일 생성 예정)
```

### 예정된 테스트 파일 구조

```
Phase1/
├── basic-navigation.spec.ts     # 기본 헤더 네비게이션
├── page-access.spec.ts          # 기본 페이지 접근
└── responsive.spec.ts           # 반응형 네비게이션

Phase2/
├── auth-navigation.spec.ts      # 인증 상태별 네비게이션
├── login-flow.spec.ts           # 로그인 플로우 및 모달
└── logout-flow.spec.ts          # 로그아웃 플로우 및 모달

Phase3/
├── feed-navigation.spec.ts      # 피드 내부 네비게이션
└── feed-sidebar.spec.ts         # 피드 사이드바 테스트

Phase4/
├── error-pages.spec.ts          # 401, 403, 404 페이지
└── network-errors.spec.ts       # 네트워크 오류 상황

Phase5/
├── performance.spec.ts          # 페이지 로딩 성능
└── accessibility.spec.ts        # 접근성 테스트
```

### 3. Playwright 설정

```javascript
// playwright.config.ts (프로젝트 루트)
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

### 4. 테스트 실행 순서

1. **개발 환경 준비**: `npm run dev` 실행하여 로컬 서버 시작
2. **Phase 1 실행**: 기본 네비게이션 테스트부터 순차 실행
3. **Phase 2-5 실행**: 각 단계별 테스트 실행
4. **리포트 생성**: 테스트 결과 리포트 확인

### 5. 테스트 데이터 관리 ✅

- **테스트 계정**: `../util/data/test-accounts.ts`에 4개 계정 정의 완료
    - primary: `test@test.test` / `test123!@#`
    - secondary: `test1@test.com` / `!test123`
    - test2, test3: `test2@test.com`, `test3@test.com` / `!test123`
- **헬퍼 시스템**: 인증, 페이지 관리, 셀렉터 시스템 구축 완료
- **플렉시블 셀렉터**: UI 변경에 대응하는 다중 셀렉터 패턴 적용

## 🚀 테스트 실행 방법

### 개별 테스트 실행

```bash
# 네비게이션 전체 테스트
npx playwright test test/navigation/

# Phase별 테스트 실행
npx playwright test test/navigation/Phase1/
npx playwright test test/navigation/Phase2/

# 특정 테스트 파일 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts

# 헤드 모드로 실행 (브라우저 화면 보기)
npx playwright test test/navigation/Phase1/ --headed

# 디버그 모드로 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts --debug
```

### 테스트 결과 확인

```bash
# 리포트 생성 및 열기
npx playwright show-report

# 스크린샷 및 비디오 확인
ls test-results/
```

## 📊 예상 산출물

1. **테스트 결과 리포트**: HTML 형태의 상세 테스트 결과
2. **스크린샷**: 실패한 테스트의 스크린샷 (PageHelper 자동 촬영)
3. **비디오**: 테스트 실행 과정 비디오 (실패 시)
4. **성능 메트릭**: 페이지 로딩 시간, 메모리 사용량 등 (PageHelper 수집)
5. **콘솔 로그**: 테스트 진행 상황 및 에러 정보

## 🔄 지속적인 개선

- **CI/CD 통합**: GitHub Actions에 E2E 테스트 추가
- **정기 실행**: 주요 브랜치 변경 시 자동 테스트 실행
- **알림 설정**: 테스트 실패 시 팀에 알림
- **테스트 유지보수**: 플렉시블 셀렉터로 UI 변경에 자동 대응

## 🎯 구현 현황 및 우선순위

### ✅ 완료된 작업 (2024.10.29)

1. **util 시스템 구축**: 인증, 페이지 관리, 셀렉터 헬퍼 완성
2. **테스트 계정 관리**: 4개 테스트 계정 정의 및 헬퍼 함수
3. **navigation README**: 테스트 전략 및 구현 계획 문서화
4. **플렉시블 셀렉터**: UI 변경에 대응하는 다중 셀렉터 패턴

### 🔄 다음 단계 (우선순위 순)

1. **Phase 1 구현**: basic-navigation.spec.ts 작성 (기본 네비게이션)
2. **Phase 2 구현**: auth-navigation.spec.ts 작성 (로그인/로그아웃 모달 포함)
3. **Phase 3 구현**: feed-navigation.spec.ts 작성 (피드 내부 네비게이션)

### 📋 장기 계획

- **Phase 4**: 에러 및 예외 상황 테스트
- **Phase 5**: 성능 및 접근성 테스트
- **기존 폴더 활용**: about/, auth/, feed/ 등 기능별 세부 테스트

## 🧪 핵심 테스트 시나리오 (업데이트)

### 📍 Phase 1: 기본 페이지 이동 플로우 (구현 예정)

```typescript
// Phase1/basic-navigation.spec.ts
test('로고 클릭 시 홈페이지로 이동', async ({ page }) => {
  const logoSelector = SelectorHelper.getNavigationSelectors().logo;
  await page.click(logoSelector);
  await PageHelper.verifyCurrentUrl(page, '/');
});

// Phase1/page-access.spec.ts
test('메뉴 링크 동작 확인', async ({ page }) => {
  const navSelectors = SelectorHelper.getNavigationSelectors();
  await page.click(navSelectors.feedLink);
  await PageHelper.verifyCurrentUrl(page, /.*\/feed/);
});
```

### 📍 Phase 2: 인증 기반 네비게이션 (구현 예정)

```typescript
// Phase2/login-flow.spec.ts
test('로그인 처리 및 모달 확인', async ({ page }) => {
  await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
  // 로그인 성공 모달 확인
  const modalSelectors = SelectorHelper.getModalSelectors();
  await PageHelper.waitForElement(page, modalSelectors.successAlert);
});

// Phase2/logout-flow.spec.ts
test('로그아웃 처리 및 모달 확인', async ({ page }) => {
  await AuthHelper.logout(page);
  // 로그아웃 모달 확인
  const modalSelectors = SelectorHelper.getModalSelectors();
  await PageHelper.waitForElement(page, modalSelectors.successAlert);
});
```

### 📍 Phase 3: 피드 사이드바 네비게이션 (구현 예정)

```typescript
// Phase3/feed-navigation.spec.ts
test('피드 내부 네비게이션', async ({ page }) => {
  const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();
  await page.click(feedNavSelectors.allPostsButton);
  await PageHelper.verifyCurrentUrl(page, '/feed');
});
```

## 💡 기술적 특징

### 플렉시블 셀렉터 시스템

```typescript
// UI 변경에 강한 다중 셀렉터 패턴
const feedLink = SelectorHelper.createFlexibleSelector([
  'a[href="/feed"]',              // 기본 링크
  'a:has-text("피드")',           // 텍스트 기반
  '.nav-link:has-text("피드")',   // 클래스 + 텍스트
  '[data-testid="feed-link"]'     // 테스트 ID
]);
```

### 자동 대기 및 재시도 메커니즘

```typescript
// AuthHelper에서 로그인 시 자동 대기
await Promise.race([
  page.waitForURL('/', { timeout: 15000 }),           // URL 변경 대기
  page.waitForSelector('.profile-image', { timeout: 15000 })  // 프로필 표시 대기
]);
```

### 강력한 에러 핸들링

```typescript
// 로그아웃 실패 시 자동 복구
try {
  await normalLogout();
} catch (error) {
  await page.context().clearCookies();  // 강제 로그아웃
  await page.reload();
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
