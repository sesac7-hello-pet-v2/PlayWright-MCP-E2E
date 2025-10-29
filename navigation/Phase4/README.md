# Phase 4: 에러 및 예외 상황 테스트

## 📋 개요

Phase 4는 네비게이션 과정에서 발생할 수 있는 오류 상황과 예외 처리를 검증합니다.

## 🎯 테스트 목표

- **에러 페이지**: 401, 403, 404 페이지 네비게이션 동작 확인
- **네트워크 오류**: API 실패 시 네비게이션 처리
- **토큰 만료**: 세션 만료 시 자동 로그아웃 및 리다이렉트
- **접근 권한**: 권한 없는 페이지 접근 시 처리
- **에러 복구**: 에러 상황에서 정상 네비게이션으로 복구

## 📁 테스트 파일 구조

```
Phase4/
├── README.md                    # 이 파일
├── error-pages.spec.ts          # 401, 403, 404 페이지 테스트 (예정)
└── network-errors.spec.ts       # 네트워크 오류 상황 테스트 (예정)
```

## 🧪 계획된 테스트 케이스

### error-pages.spec.ts (예정)

#### 에러 페이지 접근 및 네비게이션 테스트

```typescript
import {test, expect} from '@playwright/test';
import {AuthHelper, PageHelper, SelectorHelper, TEST_ACCOUNTS} from '../../util/helpers';

test.describe('에러 페이지 네비게이션 테스트', () => {
  test('401 권한 없음 페이지 테스트', async ({page}) => {
    // 401 페이지 직접 접근
    await page.goto('/401');
    await PageHelper.waitForPageLoad(page);

    const errorSelectors = SelectorHelper.getErrorPageSelectors();

    // 401 에러 페이지 표시 확인
    await expect(page.locator(errorSelectors.error401)).toBeVisible();

    // 에러 페이지에서도 네비게이션 바 표시 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await expect(page.locator(navigationSelectors.logo)).toBeVisible();

    // 에러 페이지에서 홈으로 이동
    await page.click(navigationSelectors.logo);
    await PageHelper.verifyCurrentUrl(page, '/');
  });

  test('403 접근 금지 페이지 테스트', async ({page}) => {
    // 403 페이지 직접 접근
    await page.goto('/403');
    await PageHelper.waitForPageLoad(page);

    const errorSelectors = SelectorHelper.getErrorPageSelectors();

    // 403 에러 페이지 표시 확인
    await expect(page.locator(errorSelectors.error403)).toBeVisible();

    // 네비게이션을 통한 다른 페이지 이동 가능 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.aboutLink);
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);
  });

  test('404 페이지를 찾을 수 없음 테스트', async ({page}) => {
    // 존재하지 않는 페이지 접근
    await page.goto('/non-existent-page');
    await PageHelper.waitForPageLoad(page);

    const errorSelectors = SelectorHelper.getErrorPageSelectors();

    // 404 에러 페이지 표시 확인
    await expect(page.locator(errorSelectors.error404)).toBeVisible();

    // 네비게이션을 통한 정상 페이지 복구
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.feedLink);
    await PageHelper.verifyCurrentUrl(page, /.*\/feed/);
  });

  test('보호된 페이지 접근 시 401 처리', async ({page}) => {
    // 비로그인 상태에서 보호된 페이지 접근
    await AuthHelper.expectLoginRedirect(page, '/feed/create');

    // 로그인 페이지로 리다이렉트 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/auth\/login/);

    // 로그인 후 원래 페이지로 복귀 (redirect_url 처리)
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

    // 원래 접근하려던 페이지로 이동 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/feed\/create/);
  });
});
```

### network-errors.spec.ts (예정)

#### 네트워크 오류 상황 테스트

```typescript
test.describe('네트워크 오류 상황 테스트', () => {
  test('로그아웃 API 실패 시 처리', async ({page}) => {
    // 로그인
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
    await page.goto('/');

    // 네트워크 요청 차단 (로그아웃 API)
    await page.route('**/auth/logout', route => route.abort());

    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // 프로필 드롭다운 열기
    await page.click(navigationSelectors.profileButton);

    // 로그아웃 버튼 클릭
    await page.click(navigationSelectors.logoutButton);

    // API 실패에도 불구하고 강제 로그아웃 처리 확인
    await PageHelper.waitForElement(page, navigationSelectors.loginButton);

    // 로그인 버튼 표시 확인 (클라이언트 측 강제 로그아웃)
    await expect(page.locator(navigationSelectors.loginButton)).toBeVisible();
  });

  test('토큰 만료 시 자동 로그아웃', async ({page}) => {
    // 로그인
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

    // 만료된 토큰으로 변경 (localStorage 조작)
    await page.evaluate(() => {
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('authToken', 'expired-token');
    });

    // API 요청이 필요한 페이지로 이동
    await page.goto('/feed/create');

    // 401 응답으로 인한 자동 로그아웃 및 로그인 페이지 리다이렉트
    await PageHelper.verifyCurrentUrl(page, /.*\/auth\/login/);

    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await expect(page.locator(navigationSelectors.loginButton)).toBeVisible();
  });

  test('네트워크 연결 오류 시 처리', async ({page}) => {
    // 오프라인 상태 시뮬레이션
    await page.context().setOffline(true);

    await page.goto('/');

    // 네트워크 오류 상황에서도 기본 네비게이션 동작 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // 클라이언트 사이드 라우팅은 동작해야 함
    await page.click(navigationSelectors.aboutLink);

    // URL 변경 확인 (캐시된 페이지)
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);

    // 온라인 복구
    await page.context().setOffline(false);

    // 정상 네비게이션 복구 확인
    await page.click(navigationSelectors.feedLink);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /.*\/feed/);
  });

  test('API 응답 지연 시 로딩 상태 처리', async ({page}) => {
    // API 응답 지연 시뮬레이션
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 지연
      route.continue();
    });

    await page.goto('/feed');

    // 로딩 상태 표시 확인
    const loadingSelectors = SelectorHelper.getLoadingSelectors();
    await expect(page.locator(loadingSelectors.loadingSpinner)).toBeVisible();

    // 로딩 완료 후 정상 콘텐츠 표시
    await PageHelper.waitForLoadingToComplete(page);

    // 네비게이션 여전히 동작하는지 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.aboutLink);
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);
  });
});
```

## 🚀 테스트 실행 방법

```bash
# Phase4 전체 테스트 실행
npx playwright test test/navigation/Phase4/

# 에러 페이지 테스트만 실행
npx playwright test test/navigation/Phase4/error-pages.spec.ts

# 네트워크 오류 테스트만 실행
npx playwright test test/navigation/Phase4/network-errors.spec.ts

# 헤드 모드로 실행 (에러 상황 시각적 확인)
npx playwright test test/navigation/Phase4/ --headed

# 디버그 모드로 실행
npx playwright test test/navigation/Phase4/error-pages.spec.ts --debug

# 네트워크 속도 제한 테스트
npx playwright test test/navigation/Phase4/network-errors.spec.ts --project="Slow Network"
```

## 🔧 사용할 헬퍼 함수

### SelectorHelper - 에러 페이지

```typescript
const errorSelectors = SelectorHelper.getErrorPageSelectors();
// 사용 가능한 셀렉터:
// - error401: 401 에러 페이지 요소
// - error403: 403 에러 페이지 요소
// - error404: 404 에러 페이지 요소

const loadingSelectors = SelectorHelper.getLoadingSelectors();
// 사용 가능한 셀렉터:
// - loadingSpinner: 로딩 스피너
// - skeleton: 스켈레톤 로더
```

### AuthHelper - 권한 및 인증 처리

```typescript
// 보호된 페이지 접근 시 리다이렉트 확인
await AuthHelper.expectLoginRedirect(page, '/protected-page');

// 토큰 유효성 확인
const hasValidToken = await AuthHelper.hasValidToken(page);

// 강제 로그아웃 (쿠키 삭제)
await page.context().clearCookies();
```

### PageHelper - 네트워크 상태 관리

```typescript
// 로딩 완료 대기
await PageHelper.waitForLoadingToComplete(page);

// API 응답 대기
await PageHelper.waitForApiResponse(page, '/api/feed');

// 에러 상황 스크린샷
await PageHelper.takeScreenshotOnFailure(page, 'network-error');
```

## 📊 테스트 시나리오

### 에러 페이지 시나리오

1. **직접 접근**: 에러 페이지 URL 직접 입력
2. **권한 오류**: 권한 없는 페이지 접근
3. **존재하지 않는 페이지**: 잘못된 URL 접근
4. **에러 복구**: 에러 페이지에서 정상 페이지로 이동

### 네트워크 오류 시나리오

1. **API 실패**: 로그아웃, 로그인 API 실패
2. **토큰 만료**: 세션 만료 후 자동 처리
3. **연결 오류**: 오프라인/온라인 전환
4. **응답 지연**: 느린 네트워크 환경

### 복구 시나리오

1. **자동 복구**: 시스템 자동 처리
2. **수동 복구**: 사용자 액션을 통한 복구
3. **부분 복구**: 일부 기능만 복구
4. **전체 복구**: 모든 기능 정상화

## 🎯 성공 기준

### 에러 처리 요구사항

- ✅ 모든 에러 페이지에서 기본 네비게이션 동작
- ✅ 에러 상황에서 적절한 사용자 안내
- ✅ 에러 페이지에서 정상 페이지로 복구 가능
- ✅ 권한 오류 시 적절한 리다이렉트

### 네트워크 오류 요구사항

- ✅ API 실패 시 graceful degradation
- ✅ 토큰 만료 시 자동 로그아웃 및 리다이렉트
- ✅ 네트워크 연결 오류 시 기본 기능 유지
- ✅ 로딩 상태 적절한 표시

### 복구 성능 요구사항

- 에러 감지 및 처리 3초 이내
- 자동 리다이렉트 5초 이내
- 에러 페이지 렌더링 2초 이내
- 복구 후 정상 동작 확인

## 🔍 고급 테스트 시나리오

### 동시 오류 처리

```typescript
test('토큰 만료와 네트워크 오류 동시 발생', async ({page}) => {
  // 만료된 토큰 설정
  await page.evaluate(() => localStorage.setItem('token', 'expired'));

  // 네트워크 오류 시뮬레이션
  await page.context().setOffline(true);

  await page.goto('/feed/create');

  // 적절한 에러 처리 확인
  await expect(page.locator('.error-message, .offline-message')).toBeVisible();
});
```

### 에러 재시도 메커니즘

```typescript
test('API 실패 후 재시도 성공', async ({page}) => {
  let requestCount = 0;

  await page.route('**/api/logout', route => {
    requestCount++;
    if (requestCount === 1) {
      route.abort(); // 첫 번째 요청 실패
    } else {
      route.continue(); // 두 번째 요청 성공
    }
  });

  // 로그아웃 시도 및 재시도 동작 확인
});
```

### 점진적 복구

```typescript
test('네트워크 복구 시 점진적 기능 활성화', async ({page}) => {
  // 오프라인으로 시작
  await page.context().setOffline(true);

  // 기본 네비게이션만 동작 확인
  // 온라인 복구 후 전체 기능 활성화 확인
});
```

## 📋 알려진 이슈 및 대응

### 브라우저별 차이

- **Chrome**: 네트워크 오류 메시지 다름
- **Firefox**: 오프라인 감지 방식 다름
- **Safari**: 쿠키 삭제 동작 다름

### 타이밍 이슈

- 네트워크 상태 변경 후 충분한 대기 시간 필요
- API 응답 지연 시뮬레이션 시 타임아웃 조정
- 에러 모달 표시 타이밍 고려

### 환경별 설정

- 개발/스테이징/프로덕션 환경별 에러 처리 차이
- 로컬 개발 시 CORS 오류 처리
- 실제 서버 오류와 시뮬레이션 오류 차이

## 📋 다음 단계

Phase 4 완료 후:

1. **Phase 5**: 성능 및 접근성 테스트
2. **통합 테스트**: 전체 Phase 연계 테스트
3. **회귀 테스트**: 에러 수정 후 기존 기능 영향 확인
4. **모니터링**: 실제 환경에서 에러 발생 패턴 분석
