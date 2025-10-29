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
-
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

### 1. Playwright 설정

```javascript
// playwright.config.ts
import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './test/navigation',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

### 2. 테스트 파일 구조
```
test/navigation/
├── README.md                    # 이 파일
├── basic-navigation.spec.ts     # Phase 1: 기본 네비게이션
├── auth-navigation.spec.ts      # Phase 2: 인증 상태별 네비게이션
├── feed-navigation.spec.ts      # Phase 3: 피드 내부 네비게이션
├── error-handling.spec.ts       # Phase 4: 에러 및 예외 상황
├── performance.spec.ts          # Phase 5: 성능 및 접근성
└── helpers/
    ├── auth-helper.ts          # 로그인/로그아웃 헬퍼
    ├── navigation-helper.ts    # 네비게이션 공통 함수
    └── assertions.ts           # 커스텀 assertion
```

### 3. 테스트 실행 순서

1. **개발 환경 준비**: `npm run dev` 실행하여 로컬 서버 시작
2. **Phase 1 실행**: 기본 네비게이션 테스트부터 순차 실행
3. **Phase 2-5 실행**: 각 단계별 테스트 실행
4. **리포트 생성**: 테스트 결과 리포트 확인

### 4. 테스트 데이터 관리

- **테스트 사용자**: 테스트용 사용자 계정 미리 생성
- **Mock 데이터**: API 응답 Mock 데이터 준비
- **환경 변수**: 테스트 환경별 설정 분리

## 📊 예상 산출물

1. **테스트 결과 리포트**: HTML 형태의 상세 테스트 결과
2. **스크린샷**: 실패한 테스트의 스크린샷
3. **비디오**: 테스트 실행 과정 비디오 (실패 시)
4. **성능 메트릭**: 페이지 로딩 시간, 메모리 사용량 등
5. **접근성 리포트**: WCAG 가이드라인 준수 여부

## 🔄 지속적인 개선

- **CI/CD 통합**: GitHub Actions에 E2E 테스트 추가
- **정기 실행**: 주요 브랜치 변경 시 자동 테스트 실행
- **알림 설정**: 테스트 실패 시 팀에 알림
- **테스트 유지보수**: UI 변경 시 테스트 코드 업데이트

## 📁 레거시 README 참고사항

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
