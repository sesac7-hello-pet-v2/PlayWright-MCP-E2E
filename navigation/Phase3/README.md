# Phase 3: 피드 내부 네비게이션 테스트

## 📋 개요

Phase 3는 피드 페이지 내 서브 네비게이션 기능을 검증하고, 로그인 상태에 따른 접근 제한을 확인합니다.

## 🎯 테스트 목표

- **피드 사이드바**: FeedNavigation 컴포넌트 동작 확인
- **모든 게시글**: 전체 피드 보기 기능
- **내 게시글**: 사용자별 피드 필터링 기능
- **로그인 제한**: 비로그인 시 "내 게시글" 버튼 비활성화
- **활성 상태**: 현재 페이지에 따른 버튼 활성 상태 표시

## 📁 테스트 파일 구조

```
Phase3/
├── README.md                    # 이 파일
├── feed-navigation.spec.ts      # 피드 내부 네비게이션 테스트 (예정)
└── feed-sidebar.spec.ts         # 피드 사이드바 상세 테스트 (예정)
```

## 🧪 계획된 테스트 케이스

### feed-navigation.spec.ts (예정)

#### FeedNavigation 컴포넌트 테스트

```typescript
import {test, expect} from '@playwright/test';
import {AuthHelper, PageHelper, SelectorHelper, TEST_ACCOUNTS} from '../../util/helpers';

test.describe('피드 내부 네비게이션 테스트', () => {
  test.beforeEach(async ({page}) => {
    // 피드 페이지로 이동
    await page.goto('/feed');
    await PageHelper.waitForPageLoad(page);
  });

  test('모든 게시글 버튼 클릭 시 /feed 이동', async ({page}) => {
    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();

    // 사이드바 표시 확인
    await expect(page.locator(feedNavSelectors.feedSidebar)).toBeVisible();

    // "모든 게시글" 버튼 클릭
    await page.click(feedNavSelectors.allPostsButton);
    await PageHelper.waitForPageLoad(page);

    // URL 확인
    await PageHelper.verifyCurrentUrl(page, '/feed');

    // 버튼 활성 상태 확인
    const allPostsButton = page.locator(feedNavSelectors.allPostsButton);
    await expect(allPostsButton).toHaveClass(/active|selected|bg-blue-500/);
  });

  test('비로그인 시 "내 게시글" 버튼 비활성화', async ({page}) => {
    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();

    // 로그아웃 상태 확인
    const isLoggedIn = await AuthHelper.isLoggedIn(page);
    if (isLoggedIn) {
      await AuthHelper.logout(page);
      await page.goto('/feed');
      await PageHelper.waitForPageLoad(page);
    }

    // "내 게시글" 버튼 비활성화 확인
    const myPostsButton = page.locator(feedNavSelectors.myPostsButton);
    await expect(myPostsButton).toBeDisabled();

    // 비활성화 스타일 확인
    await expect(myPostsButton).toHaveClass(/disabled|cursor-not-allowed|text-gray-400/);
  });

  test('로그인 후 "내 게시글" 버튼 활성화 및 이동', async ({page}) => {
    // 로그인
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
    await page.goto('/feed');
    await PageHelper.waitForPageLoad(page);

    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();

    // "내 게시글" 버튼 활성화 확인
    const myPostsButton = page.locator(feedNavSelectors.myPostsButton);
    await expect(myPostsButton).toBeEnabled();

    // 버튼 클릭
    await page.click(feedNavSelectors.myPostsButton);
    await PageHelper.waitForPageLoad(page);

    // 사용자별 피드 URL 확인 (/feed/{userId})
    await PageHelper.verifyCurrentUrl(page, /\/feed\/\w+/);

    // 버튼 활성 상태 확인
    await expect(myPostsButton).toHaveClass(/active|selected|bg-blue-500/);
  });
});
```

### feed-sidebar.spec.ts (예정)

#### 사이드바 상세 기능 테스트

```typescript
test.describe('피드 사이드바 상세 테스트', () => {
  test('사이드바 sticky 위치 고정', async ({page}) => {
    await page.goto('/feed');
    await PageHelper.waitForPageLoad(page);

    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();
    const sidebar = page.locator(feedNavSelectors.feedSidebar);

    // 사이드바가 sticky 위치에 고정되어 있는지 확인
    const position = await sidebar.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('sticky');

    // 스크롤 후에도 사이드바가 보이는지 확인
    await PageHelper.scrollToBottom(page);
    await expect(sidebar).toBeVisible();
  });

  test('사이드바 반응형 표시', async ({page}) => {
    await page.goto('/feed');

    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();
    const sidebar = page.locator(feedNavSelectors.feedSidebar);

    // 데스크톱에서 사이드바 표시
    await page.setViewportSize({width: 1280, height: 720});
    await expect(sidebar).toBeVisible();

    // 모바일에서 사이드바 숨김 또는 변경된 표시
    await page.setViewportSize({width: 375, height: 667});
    // 모바일에서는 사이드바가 숨겨지거나 다른 형태로 표시될 수 있음
    const isSidebarVisible = await sidebar.isVisible();
    const hasMobileNav = await page.locator('.mobile-nav, .bottom-nav').isVisible();

    expect(isSidebarVisible || hasMobileNav).toBeTruthy();
  });

  test('빠른 네비게이션 테스트', async ({page}) => {
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
    await page.goto('/feed');

    const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();

    // 모든 게시글 → 내 게시글 → 모든 게시글 빠른 전환
    await page.click(feedNavSelectors.allPostsButton);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, '/feed');

    await page.click(feedNavSelectors.myPostsButton);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /\/feed\/\w+/);

    await page.click(feedNavSelectors.allPostsButton);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, '/feed');

    // 각 전환이 정상적으로 이루어졌는지 확인
    console.log('✅ 빠른 네비게이션 전환 성공');
  });
});
```

## 🚀 테스트 실행 방법

```bash
# Phase3 전체 테스트 실행
npx playwright test test/navigation/Phase3/

# 개별 테스트 파일 실행
npx playwright test test/navigation/Phase3/feed-navigation.spec.ts

# 로그인 상태 테스트만 실행
npx playwright test test/navigation/Phase3/ -g "로그인"

# 헤드 모드로 실행 (사이드바 동작 시각적 확인)
npx playwright test test/navigation/Phase3/ --headed

# 모바일 반응형 테스트
npx playwright test test/navigation/Phase3/feed-sidebar.spec.ts --project=Mobile
```

## 🔧 사용할 헬퍼 함수

### SelectorHelper - 피드 네비게이션

```typescript
const feedNavSelectors = SelectorHelper.getFeedNavigationSelectors();
// 사용 가능한 셀렉터:
// - feedSidebar: 피드 사이드바
// - allPostsButton: "모든 게시글" 버튼
// - myPostsButton: "내 게시글" 버튼
```

### AuthHelper - 인증 상태 관리

```typescript
// 로그인 상태 확인
const isLoggedIn = await AuthHelper.isLoggedIn(page);

// 테스트 계정으로 로그인
await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

// 로그아웃
await AuthHelper.logout(page);
```

### PageHelper - 페이지 관리

```typescript
// 페이지 로딩 대기
await PageHelper.waitForPageLoad(page);

// URL 확인
await PageHelper.verifyCurrentUrl(page, /\/feed\/\w+/);

// 스크롤 테스트
await PageHelper.scrollToBottom(page);
```

## 📊 테스트 시나리오

### 기본 시나리오

1. **비로그인 사용자**
    - 피드 페이지 접근
    - "모든 게시글"만 활성화
    - "내 게시글" 비활성화

2. **로그인 사용자**
    - 피드 페이지 접근
    - 모든 버튼 활성화
    - 사용자별 피드 접근 가능

### 고급 시나리오

1. **빠른 전환**
    - 모든 게시글 ↔ 내 게시글 빠른 전환
    - 각 전환 시 로딩 상태 확인

2. **반응형 테스트**
    - 데스크톱/태블릿/모바일 사이드바 표시
    - 각 화면 크기별 동작 확인

3. **상태 유지**
    - 페이지 새로고침 후 현재 선택 상태 유지
    - 브라우저 뒤로가기/앞으로가기 시 상태 복원

## 🎯 성공 기준

### 기능적 요구사항

- ✅ 사이드바 정상 표시 및 sticky 위치 고정
- ✅ 버튼별 정확한 URL 이동
- ✅ 로그인 상태에 따른 버튼 활성화/비활성화
- ✅ 현재 페이지에 따른 활성 상태 표시

### 성능 요구사항

- 사이드바 렌더링 2초 이내
- 버튼 클릭 후 페이지 이동 3초 이내
- 스크롤 시 사이드바 위치 고정 지연 없음

### 접근성 요구사항

- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 적절한 ARIA 라벨 제공

## 🔍 알려진 이슈 및 해결 방안

### 사용자 ID 동적 처리

```typescript
// 사용자별 피드 URL에서 동적 userId 처리
await PageHelper.verifyCurrentUrl(page, /\/feed\/\w+/);
// 정확한 userId 확인이 필요한 경우:
const currentUserId = await AuthHelper.getCurrentUserId(page);
await PageHelper.verifyCurrentUrl(page, `/feed/${currentUserId}`);
```

### 로딩 상태 대기

```typescript
// 피드 데이터 로딩 완료 대기
await PageHelper.waitForLoadingToComplete(page);
// 또는 특정 피드 콘텐츠 표시 대기
await PageHelper.waitForElement(page, '.feed-post, .post-item');
```

### 반응형 테스트 주의사항

```typescript
// 뷰포트 변경 후 충분한 대기 시간
await page.setViewportSize({width: 375, height: 667});
await page.waitForTimeout(1000); // 레이아웃 재계산 대기
```

## 📋 다음 단계

Phase 3 완료 후:

1. **Phase 4**: 에러 페이지 및 예외 상황 테스트
2. **Phase 5**: 성능 및 접근성 테스트
3. **통합 테스트**: Phase 1-3 연계 전체 플로우 테스트
4. **회귀 테스트**: 모든 Phase 통합 실행 및 안정성 확인
