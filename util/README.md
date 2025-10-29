# 테스트 유틸리티 (util/)

## 📋 목적

모든 테스트에서 공통으로 사용하는 헬퍼 함수, 테스트 데이터, 이미지 리소스를 관리합니다.

## 🎯 현재 구성 (2025.10.29 업데이트)

### ✅ 구현 완료

#### 테스트 계정 데이터 (data/)

- `test-accounts.ts`: 4개의 테스트 계정 정보 관리
- 주요 계정: primary, secondary, test2, test3

#### 인증 헬퍼 (helpers/)

- `auth-helper.ts`: 로그인/로그아웃 및 인증 상태 관리
- `page-helper.ts`: 페이지 공통 기능 (로딩, 스크린샷, 스크롤 등)
- `selector-helper.ts`: 플렉시블 셀렉터 시스템
- `index.ts`: 통합 export 파일

#### 테스트 이미지 (feed_image/)
```
util/feed_image/
├── alan-king-KZv7w34tluA-unsplash.jpg
├── alec-favale-Ivzo69e18nk-unsplash.jpg
├── alvan-nee-1VgfQdCuX-4-unsplash.jpg
├── alvan-nee-eoqnr8ikwFE-unsplash.jpg
├── alvan-nee-T-0EW-SEbsE-unsplash.jpg
├── alvan-nee-ZCHj_2lJP00-unsplash.jpg
├── baptist-standaert-mx0DEnfYxic-unsplash.jpg
├── charlesdeluvio-Mv9hjnEUHR4-unsplash.jpg
├── flouffy-g2FtlFrc164-unsplash.jpg
├── humberto-arellano-N_G2Sqdy9QY-unsplash.jpg
├── jamie-street-s9Tf1eBDFqw-unsplash.jpg
├── krista-mangulsone-9gz3wfHr65U-unsplash.jpg
├── matt-nelson-aI3EBLvcyu4-unsplash.jpg
├── mikhail-vasilyev-NodtnCsLdTE-unsplash.jpg
├── mona-magnussen-a7bdqjeG6M4-unsplash.jpg
├── taylor-sondgeroth-ltsKOg_q_Gc-unsplash.jpg
└── wade-austin-ellis-FtuJIuBbUhI-unsplash.jpg
```
**총 17개의 다양한 반려동물 이미지 (Unsplash 제공)**

## 📁 현재 파일 구조

```
util/
├── README.md                    # 이 파일
├── feed_image/                  # 테스트용 이미지 파일들 (17개) ✅
├── helpers/                     # 공통 헬퍼 함수들 ✅
│   ├── auth-helper.ts          # 인증 관련 공통 기능 ✅
│   ├── page-helper.ts          # 페이지 공통 기능 ✅
│   ├── selector-helper.ts      # 셀렉터 관련 헬퍼 ✅
│   └── index.ts               # 통합 export 파일 ✅
├── data/                       # 테스트 데이터 ✅
│   └── test-accounts.ts        # 테스트 계정 정보 ✅
├── fixtures/                   # Playwright 픽스처 (계획)
│   ├── authenticated-page.ts   # 로그인된 페이지 픽스처
│   └── test-context.ts         # 테스트 컨텍스트 픽스처
└── config/                     # 설정 파일들 (계획)
    ├── test-config.ts          # 테스트 설정
    └── environment.ts          # 환경별 설정
```

### 📋 추가 구현 예정

#### 테스트 데이터 (data/)

- `test-posts.ts`: 테스트 게시글 데이터
- `test-comments.ts`: 테스트 댓글 데이터

#### 고급 헬퍼 (helpers/)

- `wait-helper.ts`: 대기 및 타이밍 헬퍼
- `image-helper.ts`: 이미지 업로드 및 관리 헬퍼

#### 픽스처 시스템 (fixtures/)

- `authenticated-page.ts`: 로그인된 페이지 픽스처
- `test-context.ts`: 테스트 컨텍스트 픽스처

#### 환경 설정 (config/)

- `test-config.ts`: 테스트 설정
- `environment.ts`: 환경별 설정

## 🔧 구현된 헬퍼 함수

### `helpers/auth-helper.ts` ✅

```typescript
export class AuthHelper {
  // 기본 로그인/로그아웃
  static async login(page: Page, email: string, password: string): Promise<void>

  static async loginWithTestAccount(page: Page, account: TestAccount): Promise<void>
  static async logout(page: Page): Promise<void>

  // 인증 상태 관리
  static async isLoggedIn(page: Page): Promise<boolean>

  static async waitForAuthState(page: Page, expectedState): Promise<void>

  static async hasValidToken(page: Page): Promise<boolean>

  // 테스트 전용 기능
  static async expectLoginRedirect(page: Page, protectedUrl: string): Promise<void>

  static async verifyUserProfile(page: Page, expectedNickname?: string): Promise<void>
}
```

### `helpers/page-helper.ts` ✅

```typescript
export class PageHelper {
  // 페이지 로딩 및 대기
  static async waitForPageLoad(page: Page, timeout?: number): Promise<void>

  static async waitForElement(page: Page, selector: string): Promise<void>

  static async waitForElementToDisappear(page: Page, selector: string): Promise<void>

  static async waitForAllImages(page: Page): Promise<void>

  static async waitForLoadingToComplete(page: Page): Promise<void>

  static async waitForApiResponse(page: Page, urlPattern: string | RegExp): Promise<any>

  // 스크린샷 및 디버깅
  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<string | null>

  static async takeFullPageScreenshot(page: Page, filename?: string): Promise<string>

  static async takeElementScreenshot(page: Page, selector: string): Promise<string>

  // 페이지 조작
  static async scrollToBottom(page: Page, delay?: number): Promise<void>

  static async scrollToTop(page: Page): Promise<void>

  // 검증 및 확인
  static async verifyNoConsoleErrors(page: Page): Promise<void>

  static async verifyPageTitle(page: Page, expectedTitle: string | RegExp): Promise<void>

  static async verifyCurrentUrl(page: Page, expectedUrl: string | RegExp): Promise<void>

  static async getPerformanceMetrics(page: Page): Promise<any>
}
```

### `helpers/selector-helper.ts` ✅

```typescript
export class SelectorHelper {
  // 플렉시블 셀렉터 생성
  static createFlexibleSelector(selectors: string[]): string

  // 카테고리별 셀렉터 모음
  static getNavigationSelectors(): object        // 네비게이션 관련
  static getFeedNavigationSelectors(): object    // 피드 네비게이션 관련
  static getAuthFormSelectors(): object          // 인증 폼 관련
  static getFeedPostSelectors(): object          // 피드 게시글 관련
  static getErrorPageSelectors(): object         // 에러 페이지 관련
  static getLoadingSelectors(): object           // 로딩 상태 관련
  static getModalSelectors(): object             // 모달/알림 관련

  // 유틸리티 셀렉터
  static getTextSelector(text: string): string

  static getDataTestIdSelector(testId: string): string

  static getRoleSelector(role: string, name?: string): string
}
}
```

## 📊 구현된 테스트 데이터

### `data/test-accounts.ts` ✅

```typescript
export const TEST_ACCOUNTS = {
  // 주요 테스트 계정 (가장 많이 사용)
  primary: {
    email: 'test@test.test',
    password: 'test123!@#',
    nickname: '테스트유저1',
    description: '주요 테스트 계정'
  },

  // 보조 테스트 계정 (다중 사용자 테스트용)
  secondary: {
    email: 'test1@test.com',
    password: '!test123',
    nickname: '테스트유저2',
    description: '보조 테스트 계정'
  },

  // 추가 테스트 계정들
  test2: {
    email: 'test2@test.com',
    password: '!test123',
    nickname: '테스트유저3',
    description: '테스트 계정 3번'
  },

  test3: {
    email: 'test3@test.com',
    password: '!test123',
    nickname: '테스트유저4',
    description: '테스트 계정 4번'
  }
} as const;

// 헬퍼 함수들
export function getTestAccount(type: keyof typeof TEST_ACCOUNTS): TestAccount

export function getRandomTestAccount(): TestAccount

export function getAllTestAccounts(): TestAccount[]
```

### 📋 계획된 테스트 데이터

#### `data/test-posts.ts` (예정)

```typescript
export const TEST_POSTS = {
  shortText: '간단한 테스트 게시글입니다.',
  longText: '아주 긴 테스트 게시글 내용...',
  withEmoji: '우리 강아지가 너무 귀여워요! 🐕‍🦺❤️',
  korean: '한글 테스트 게시글 내용입니다.',
  english: 'This is an English test post content.',
  mixed: '한글과 English가 섞인 mixed content test.'
} as const;
```

#### `data/test-comments.ts` (예정)

```typescript
export const TEST_COMMENTS = {
  positive: '정말 귀여워요! ❤️',
  question: '몇 살인가요?',
  long: '아주 긴 댓글 내용...'
} as const;
```

## 🖼️ 이미지 헬퍼 (계획)

### `helpers/image-helper.ts`

```typescript
export class ImageHelper {
  static getRandomImages(count: number): string[] {
    // feed_image 폴더에서 랜덤하게 선택
  }

  static getAllImagePaths(): string[] {
    // 모든 이미지 경로 반환
  }

  static async uploadImages(page: Page, imagePaths: string[]): Promise<void> {
    // 이미지 업로드 로직
  }

  static async verifyImagePreview(page: Page, count: number): Promise<void> {
    // 이미지 미리보기 확인
  }
}
```

## 🎨 플렉시블 셀렉터 시스템

### 레거시 코드 대응 셀렉터

```typescript
// 다양한 구현에 대응하는 유연한 셀렉터 생성
export const SELECTORS = {
  createPostButton: [
    'button:has-text("새 게시물")',
    'button:has-text("게시글 작성")',
    '.create-post-button',
    '[data-testid="create-post"]',
    '[title*="게시물"]',
    '[aria-label*="작성"]'
  ],

  likeButton: [
    'button:has(svg[stroke="currentColor"]):has(path[d*="M4.318 6.318"])',
    'button:has-text("좋아요")',
    '.like-button',
    '[data-testid="like-button"]',
    '[aria-label*="좋아요"]'
  ],

  feedPost: [
    '.feed-post',
    '.post-card',
    '[data-testid="feed-post"]',
    'article:has(.post-content)',
    '.post-item'
  ]
} as const;
```

## 🚀 사용법

### 헬퍼 함수 사용 예시 ✅

```typescript
import {AuthHelper, PageHelper, SelectorHelper, TEST_ACCOUNTS} from '../util/helpers';

test('네비게이션 로그인 테스트', async ({page}) => {
  // 페이지 이동 및 로딩 대기
  await page.goto('/');
  await PageHelper.waitForPageLoad(page);

  // 로그인
  await AuthHelper.loginWithTestAccount(page, TEST_ACCOUNTS.primary);

  // 로그인 상태 확인
  const isLoggedIn = await AuthHelper.isLoggedIn(page);
  expect(isLoggedIn).toBe(true);

  // 사용자 프로필 확인
  await AuthHelper.verifyUserProfile(page, TEST_ACCOUNTS.primary.nickname);

  // 로그아웃
  await AuthHelper.logout(page);

  // 스크린샷 촬영 (실패 시)
  if (!isLoggedIn) {
    await PageHelper.takeScreenshotOnFailure(page, 'login-test');
  }
});
```

### 셀렉터 사용 예시 ✅

```typescript
import {SelectorHelper} from '../util/helpers';

test('네비게이션 메뉴 테스트', async ({page}) => {
  // 플렉시블 셀렉터 사용
  const navigationSelectors = SelectorHelper.getNavigationSelectors();

  // 피드 링크 클릭
  await page.click(navigationSelectors.feedLink);

  // 로그인 버튼 확인
  await expect(page.locator(navigationSelectors.loginButton)).toBeVisible();

  // 커스텀 셀렉터 생성
  const customSelector = SelectorHelper.createFlexibleSelector([
    'button:has-text("커스텀 버튼")',
    '.custom-button',
    '[data-testid="custom"]'
  ]);
});
```

### 테스트 계정 사용 예시 ✅

```typescript
import {TEST_ACCOUNTS, getTestAccount, getRandomTestAccount} from '../util/helpers';

test('다중 사용자 테스트', async ({page}) => {
  // 기본 계정 사용
  const primaryAccount = TEST_ACCOUNTS.primary;
  await AuthHelper.loginWithTestAccount(page, primaryAccount);

  // 특정 계정 선택
  const secondaryAccount = getTestAccount('secondary');

  // 랜덤 계정 선택
  const randomAccount = getRandomTestAccount();
});
```

## 📊 구현 현황 및 우선순위

### ✅ P0 완료 (2024.10.29)

- ✅ 기본 auth-helper 구현 (`AuthHelper` 클래스)
- ✅ 기본 page-helper 구현 (`PageHelper` 클래스)
- ✅ selector-helper 플렉시블 셀렉터 구현 (`SelectorHelper` 클래스)
- ✅ test-accounts 데이터 정의 (4개 테스트 계정)
- ✅ 통합 export 시스템 (`helpers/index.ts`)

### 🔄 P1 진행 중

- [ ] test-posts, test-comments 데이터 정의
- [ ] wait-helper 고급 기능
- [ ] image-helper 기본 기능
- [ ] 픽스처 시스템 구축

### 📋 P2 계획

- [ ] 환경별 설정 관리
- [ ] 성능 모니터링 헬퍼
- [ ] 에러 리포팅 시스템
- [ ] 고급 이미지 처리 기능

## 🖼️ 이미지 리소스 관리

### 현재 이미지 특징

- **출처**: Unsplash (고품질 무료 이미지)
- **주제**: 다양한 반려동물 (강아지, 고양이 등)
- **개수**: 17개 (1-5개 랜덤 선택용)
- **크기**: 적절한 웹 업로드 크기

### 이미지 사용 패턴

```typescript
// 1-5개 랜덤 선택
const imageCount = Math.floor(Math.random() * 5) + 1;
const selectedImages = ImageHelper.getRandomImages(imageCount);

// 특정 개수 지정
const threeImages = ImageHelper.getRandomImages(3);

// 모든 이미지 사용 (테스트용)
const allImages = ImageHelper.getAllImagePaths();
```

## 🔍 현재 이슈 및 개선 계획

### 현재 상황 (2024.10.29)

- ✅ 테스트 이미지 17개 준비 완료
- ✅ 핵심 헬퍼 함수 구현 완료 (AuthHelper, PageHelper, SelectorHelper)
- ✅ 테스트 계정 데이터 정의 완료
- ✅ 플렉시블 셀렉터 시스템 구축 완료
- [ ] 픽스처 시스템 구축 필요
- [ ] 추가 테스트 데이터 정의 필요

### 개선 로드맵

1. **✅ 1주차 완료**: 기본 헬퍼 함수 및 데이터 구조 구축
2. **🔄 2주차 진행중**: 고급 기능 및 픽스처 시스템
3. **📋 3주차 계획**: 성능 최적화 및 유지보수성 개선
4. **📋 4주차 계획**: 문서화 및 사용법 가이드 완성

## 🎉 주요 성과

### 구축된 유틸리티 시스템

1. **인증 시스템**: 완전한 로그인/로그아웃 자동화
2. **페이지 관리**: 로딩, 스크린샷, 성능 측정 등 종합 기능
3. **셀렉터 시스템**: 다양한 UI 구현에 대응하는 플렉시블 셀렉터
4. **테스트 데이터**: 4개 테스트 계정으로 다양한 시나리오 지원

### 재사용성 및 확장성

- 모든 헬퍼 함수는 static 메서드로 구현하여 간편한 사용
- 플렉시블 셀렉터로 UI 변경에 대한 높은 적응성
- 체계적인 폴더 구조로 향후 확장 용이

---

**달성 목표**: ✅ 모든 테스트에서 재사용 가능한 안정적이고 유연한 유틸리티 시스템 구축 완료

**다음 목표**: 🎯 픽스처 시스템 및 고급 테스트 도구 구축
