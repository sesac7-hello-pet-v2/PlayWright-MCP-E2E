# 테스트 유틸리티 (util/)

## 📋 목적

모든 테스트에서 공통으로 사용하는 헬퍼 함수, 테스트 데이터, 이미지 리소스를 관리합니다.

## 🎯 현재 구성

### 테스트 이미지 (feed_image/)

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

## 📁 계획된 파일 구조

```
util/
├── README.md                    # 이 파일
├── feed_image/                  # 테스트용 이미지 파일들 (17개)
├── helpers/                     # 공통 헬퍼 함수들
│   ├── auth-helper.ts          # 인증 관련 공통 기능
│   ├── page-helper.ts          # 페이지 공통 기능
│   ├── wait-helper.ts          # 대기 및 타이밍 헬퍼
│   └── selector-helper.ts      # 셀렉터 관련 헬퍼
├── data/                       # 테스트 데이터
│   ├── test-accounts.ts        # 테스트 계정 정보
│   ├── test-posts.ts           # 테스트 게시글 데이터
│   └── test-comments.ts        # 테스트 댓글 데이터
├── fixtures/                   # Playwright 픽스처
│   ├── authenticated-page.ts   # 로그인된 페이지 픽스처
│   └── test-context.ts         # 테스트 컨텍스트 픽스처
└── config/                     # 설정 파일들
    ├── test-config.ts          # 테스트 설정
    └── environment.ts          # 환경별 설정
```

## 🔧 주요 헬퍼 함수 (예정)

### `helpers/auth-helper.ts`

```typescript
export class AuthHelper {
  static async login(page: Page, email: string, password: string): Promise<void>
  static async logout(page: Page): Promise<void>
  static async isLoggedIn(page: Page): Promise<boolean>
  static async waitForAuthState(page: Page): Promise<void>
}
```

### `helpers/page-helper.ts`

```typescript
export class PageHelper {
  static async waitForPageLoad(page: Page): Promise<void>
  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<void>
  static async scrollToBottom(page: Page): Promise<void>
  static async verifyNoConsoleErrors(page: Page): Promise<void>
}
```

### `helpers/wait-helper.ts`

```typescript
export class WaitHelper {
  static async waitForImageLoad(page: Page, selector: string): Promise<void>
  static async waitForApiResponse(page: Page, urlPattern: string): Promise<void>
  static async waitForOptimisticUI(page: Page): Promise<void>
  static async waitForCacheInvalidation(page: Page): Promise<void>
}
```

### `helpers/selector-helper.ts`

```typescript
export class SelectorHelper {
  static createFlexibleSelector(selectors: string[]): string
  static getFeedPostSelector(): string
  static getCreatePostButtonSelector(): string
  static getLikeButtonSelector(): string
  static getCommentButtonSelector(): string
}
```

## 📊 테스트 데이터 관리

### `data/test-accounts.ts`

```typescript
export const TEST_ACCOUNTS = {
  primary: {
    email: 'test@test.test',
    password: 'test123!@#',
    nickname: '테스트유저1'
  },
  secondary: {
    email: 'test2@test.test',
    password: 'test123!@#',
    nickname: '테스트유저2'
  }
} as const;
```

### `data/test-posts.ts`

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

### 헬퍼 함수 사용 예시

```typescript
import { AuthHelper, ImageHelper } from '../util/helpers';
import { TEST_ACCOUNTS, TEST_POSTS } from '../util/data';

test('게시글 작성 테스트', async ({ page }) => {
  // 로그인
  await AuthHelper.login(page, TEST_ACCOUNTS.primary.email, TEST_ACCOUNTS.primary.password);

  // 이미지 선택 및 업로드
  const images = ImageHelper.getRandomImages(3);
  await ImageHelper.uploadImages(page, images);

  // 게시글 내용 입력
  await page.fill('textarea', TEST_POSTS.shortText);

  // 게시 버튼 클릭
  await page.click(SelectorHelper.getCreatePostButtonSelector());
});
```

## 📊 우선순위

### P0 (최우선) - 1주차

- 기본 auth-helper, page-helper 구현
- test-accounts, test-posts 데이터 정의
- image-helper 기본 기능

### P1 (중요) - 2주차

- wait-helper 고급 기능
- selector-helper 플렉시블 셀렉터
- 픽스처 시스템

### P2 (보완) - 3주차

- 환경별 설정 관리
- 성능 모니터링 헬퍼
- 에러 리포팅 시스템

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

### 현재 상황

- ✅ 테스트 이미지 17개 준비 완료
- [ ] 헬퍼 함수 구현 필요
- [ ] 테스트 데이터 정의 필요
- [ ] 픽스처 시스템 구축 필요

### 개선 로드맵

1. **1주차**: 기본 헬퍼 함수 및 데이터 구조 구축
2. **2주차**: 고급 기능 및 플렉시블 셀렉터 시스템
3. **3주차**: 성능 최적화 및 유지보수성 개선
4. **4주차**: 문서화 및 사용법 가이드 완성

---

**목표**: 모든 테스트에서 재사용 가능한 안정적이고 유연한 유틸리티 시스템 구축
