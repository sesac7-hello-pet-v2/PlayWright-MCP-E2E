# Phase 2: 인증 상태별 네비게이션 테스트

## 📋 개요

Phase 2는 로그인/로그아웃 상태에 따른 네비게이션 차이를 검증하고, 인증 관련 모달의 정상 출력을 확인합니다.

## 🎯 테스트 목표

- **비로그인 상태**: 로그인 버튼 표시 및 로그인 페이지 이동
- **로그인 프로세스**: 테스트 계정을 사용한 로그인 기능 및 성공 모달 확인
- **로그인 상태**: 프로필 드롭다운, 마이페이지 이동 기능
- **로그아웃 프로세스**: 로그아웃 기능 및 로그아웃 모달 확인
- **접근 제한**: 로그인이 필요한 페이지 접근 시 리다이렉트 처리

## 📁 테스트 파일 구조

```
Phase2/
├── README.md                    # 이 파일
├── auth-navigation.spec.ts      # 인증 상태별 네비게이션 테스트 (예정)
├── login-flow.spec.ts           # 로그인 플로우 및 모달 테스트 (예정)
└── logout-flow.spec.ts          # 로그아웃 플로우 및 모달 테스트 (예정)
```

## 🧪 계획된 테스트 케이스

### auth-navigation.spec.ts (예정)

#### 비로그인 상태 테스트

1. **로그인 버튼 표시**
    - 네비게이션에 로그인 버튼이 표시되는지 확인
    - 프로필 이미지가 표시되지 않는지 확인

2. **로그인 페이지 이동**
    - 로그인 버튼 클릭 시 `/auth/login` 페이지로 이동
    - 로그인 폼이 정상적으로 렌더링되는지 확인

3. **제한된 기능 접근**
    - `/feed/create` 등 로그인이 필요한 페이지 직접 접근 시
    - 로그인 페이지로 자동 리다이렉트 확인

#### 로그인 상태 테스트

1. **프로필 이미지 표시**
    - 로그인 후 네비게이션에 사용자 프로필 이미지 표시
    - 로그인 버튼이 사라지는지 확인

2. **드롭다운 메뉴**
    - 프로필 이미지 클릭 시 드롭다운 메뉴 표시
    - 사용자 닉네임, 마이페이지, 로그아웃 버튼 확인

3. **마이페이지 이동**
    - 드롭다운에서 마이페이지 클릭 시 `/me` 이동

4. **드롭다운 닫기**
    - 외부 클릭 시 드롭다운 메뉴 자동 닫기

### login-flow.spec.ts (예정)

```typescript
import {test, expect} from '@playwright/test';
import {AuthHelper, PageHelper, SelectorHelper, TEST_ACCOUNTS} from '../../util/helpers';

test.describe('로그인 플로우 및 모달 테스트', () => {
  test('테스트 계정 로그인 및 성공 모달 확인', async ({page}) => {
    await page.goto('/');

    // 로그인 버튼 클릭
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.loginButton);

    // 로그인 페이지로 이동 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/auth\/login/);

    // 테스트 계정으로 로그인
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

    // 로그인 성공 모달 확인
    const modalSelectors = SelectorHelper.getModalSelectors();
    await PageHelper.waitForElement(page, modalSelectors.successAlert);

    // 모달 내용 확인
    await expect(page.locator('text=로그인 되었습니다')).toBeVisible();

    // 프로필 이미지 표시 확인
    await expect(page.locator(navigationSelectors.profileButton)).toBeVisible();
  });

  test('로그인 실패 시 에러 모달 확인', async ({page}) => {
    await page.goto('/auth/login');

    // 잘못된 계정 정보로 로그인 시도
    await AuthHelper.login(page, 'invalid@test.com', 'wrongpassword');

    // 에러 모달 확인
    const modalSelectors = SelectorHelper.getModalSelectors();
    await PageHelper.waitForElement(page, modalSelectors.errorAlert);

    // 에러 메시지 확인
    await expect(page.locator('text=로그인 실패')).toBeVisible();
  });
});
```

### logout-flow.spec.ts (예정)

```typescript
test.describe('로그아웃 플로우 및 모달 테스트', () => {
  test.beforeEach(async ({page}) => {
    // 각 테스트 전에 로그인 상태로 설정
    await page.goto('/');
    await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);
  });

  test('로그아웃 처리 및 모달 확인', async ({page}) => {
    // 프로필 드롭다운 열기
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.profileButton);

    // 로그아웃 버튼 클릭
    await page.click(navigationSelectors.logoutButton);

    // 로그아웃 모달 확인
    const modalSelectors = SelectorHelper.getModalSelectors();
    await PageHelper.waitForElement(page, modalSelectors.successAlert);

    // 모달 내용 확인
    await expect(page.locator('text=로그아웃 되었습니다')).toBeVisible();

    // 로그인 버튼 다시 표시 확인
    await expect(page.locator(navigationSelectors.loginButton)).toBeVisible();
  });
});
```

## 🚀 테스트 실행 방법

```bash
# Phase2 전체 테스트 실행
npx playwright test test/navigation/Phase2/

# 개별 테스트 파일 실행
npx playwright test test/navigation/Phase2/login-flow.spec.ts

# 헤드 모드로 실행 (로그인 과정 시각적 확인)
npx playwright test test/navigation/Phase2/ --headed

# 디버그 모드로 실행
npx playwright test test/navigation/Phase2/auth-navigation.spec.ts --debug
```

## 🔧 사용할 헬퍼 함수

### AuthHelper 활용

```typescript
// 테스트 계정으로 로그인
await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

// 로그인 상태 확인
const isLoggedIn = await AuthHelper.isLoggedIn(page);

// 로그아웃
await AuthHelper.logout(page);

// 보호된 페이지 접근 시 리다이렉트 확인
await AuthHelper.expectLoginRedirect(page, '/feed/create');

// 사용자 프로필 확인
await AuthHelper.verifyUserProfile(page, TEST_ACCOUNTS.primary.nickname);
```

### SelectorHelper 활용

```typescript
// 네비게이션 셀렉터
const navSelectors = SelectorHelper.getNavigationSelectors();
// 모달 셀렉터
const modalSelectors = SelectorHelper.getModalSelectors();
// 인증 폼 셀렉터
const authSelectors = SelectorHelper.getAuthFormSelectors();
```

## 📊 테스트 데이터

### 사용할 테스트 계정

- **primary**: `test@test.test` / `test123!@#` (주요 테스트용)
- **secondary**: `test1@test.com` / `!test123` (다중 사용자 테스트용)
- **test2**: `test2@test.com` / `!test123` (추가 테스트용)

### 테스트 시나리오별 계정 활용

```typescript
// 성공적인 로그인 테스트
await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

// 다중 사용자 시나리오
await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.secondary);

// 랜덤 계정 테스트
const randomAccount = getRandomTestAccount();
await AuthHelper.loginWithTestAccount(page, randomAccount);
```

## 🎯 성공 기준

### 기능적 요구사항

- ✅ 로그인/로그아웃 기능 정상 동작
- ✅ 인증 상태에 따른 UI 변화 확인
- ✅ 보호된 페이지 접근 제한 동작
- ✅ 모달 정상 출력 및 메시지 확인

### 성능 요구사항

- 로그인 프로세스 10초 이내 완료
- 모달 표시 3초 이내
- 페이지 리다이렉트 5초 이내

### 안정성 요구사항

- 모든 테스트 케이스 100% 성공
- 3개 브라우저(Chromium, Firefox, WebKit) 모두 통과
- 5회 연속 실행 시 안정적 동작

## 🔍 주의사항

### 테스트 격리

- 각 테스트는 독립적으로 실행
- 로그인 상태가 다른 테스트에 영향 주지 않도록 beforeEach에서 초기화

### 모달 타이밍

- 모달 표시 대기 시간 충분히 설정
- 애니메이션 완료 후 내용 확인

### 에러 처리

- 로그인 실패 시나리오도 포함
- 네트워크 오류 상황 대응

## 📋 다음 단계

Phase 2 완료 후:

1. **Phase 3**: 피드 내부 네비게이션 테스트
2. **통합 테스트**: Phase 1-2 연계 시나리오
3. **성능 최적화**: 불필요한 대기 시간 단축
