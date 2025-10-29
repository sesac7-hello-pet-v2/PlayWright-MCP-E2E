# Playwright Configuration 설정 가이드

## 📋 개요

이 문서는 Hello Pet v2 프로젝트의 Playwright 테스트 설정에 대한 상세한 가이드입니다. 현재 프로젝트에 최적화된 설정과 추가 옵션들을 설명합니다.

## 🔧 현재 설정 분석

### 기본 구조 (`playwright.config.ts`)

```typescript
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './',                    // 현재 폴더를 테스트 디렉토리로 설정
  testIgnore: '**/node_modules/**', // node_modules 폴더 무시
  fullyParallel: false,             // 테스트를 순차적으로 실행
  forbidOnly: !!process.env.CI,     // CI 환경에서 test.only 금지
  retries: process.env.CI ? 2 : 0,  // CI에서만 재시도
  workers: process.env.CI ? 1 : undefined, // CI에서 단일 워커

  // 리포터 설정
  reporter: [
    ['html'],                       // HTML 리포트
    ['json', {outputFile: 'test-results.json'}],
    ['junit', {outputFile: 'results.xml'}],
    ['line']                        // 콘솔 출력
  ],

  // 공통 설정
  use: {
    baseURL: 'https://hello-pet.my',
    trace: 'on-first-retry',
    screenshot: "on",
    video: "on",
    viewport: {width: 1280, height: 720},
    headless: false,
  },

  // 브라우저 프로젝트
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'Google Chrome',
      use: {...devices['Desktop Chrome'], channel: 'chrome'},
    }
  ],
});
```

## ⚙️ 주요 설정 옵션 상세 설명

### 1. 테스트 디렉토리 설정

```typescript
{
  testDir: './',                    // 테스트 파일을 찾을 디렉토리
    testMatch
:
  '**/*.spec.ts',        // 테스트 파일 패턴
    testIgnore
:
  '**/node_modules/**', // 무시할 파일/폴더 패턴
}
```

**옵션들:**

- `testDir`: 테스트 파일 위치 (기본값: current directory)
- `testMatch`: 테스트 파일 패턴 (기본값: `**/*.@(spec|test).?(c|m)[jt]s?(x)`)
- `testIgnore`: 제외할 파일 패턴

### 2. 병렬 실행 제어

```typescript
{
  fullyParallel: false,             // 완전 병렬 실행 여부
    workers
:
  process.env.CI ? 1 : undefined, // 동시 실행 워커 수
    retries
:
  process.env.CI ? 2 : 0,  // 실패 시 재시도 횟수
}
```

**Hello Pet v2 선택 이유:**

- `fullyParallel: false`: 인증 상태 공유와 데이터 일관성 보장
- `workers: 1` (CI): 서버 부하 최소화 및 안정성 확보
- `retries: 2` (CI): 네트워크 불안정성 대응

### 3. 타임아웃 설정

```typescript
{
  timeout: 30 * 1000,               // 개별 테스트 타임아웃 (30초)
    expect
:
  {
    timeout: 5 * 1000,              // expect 타임아웃 (5초)
  }
,
  use: {
    actionTimeout: 0,               // 액션별 타임아웃 (0 = 무제한)
      navigationTimeout
  :
    30 * 1000,   // 페이지 네비게이션 타임아웃
  }
}
```

**권장 설정:**

- **개발환경**: timeout 60초 (디버깅 여유)
- **CI환경**: timeout 30초 (빠른 피드백)
- **네비게이션**: 30초 (SSR 렌더링 고려)

### 4. 리포터 설정

```typescript
{
  reporter: [
    ['html'],                       // 브라우저에서 볼 수 있는 상세 리포트
    ['json', {outputFile: 'test-results.json'}], // CI 통합용
    ['junit', {outputFile: 'results.xml'}],      // Jenkins/Azure DevOps용
    ['line']                        // 실시간 콘솔 출력
  ]
}
```

**사용 가능한 리포터:**

- `html`: 가장 상세한 시각적 리포트
- `line`: 실시간 진행상황 (개발 시 유용)
- `dot`: 간결한 점 표시
- `json`: 프로그래밍 처리용
- `junit`: CI/CD 통합

### 5. 브라우저 및 디바이스 설정

```typescript
{
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {width: 1280, height: 720}
      }
    },
    // 추가 가능한 설정들
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']}
    },
    {
      name: 'mobile',
      use: {...devices['iPhone 12']}
    }
  ]
}
```

### 6. 공통 use 설정

```typescript
{
  use: {
    baseURL: 'https://hello-pet.my',  // 기본 URL
      trace
  :
    'on-first-retry',          // 디버깅용 trace 수집
      screenshot
  :
    'on',                 // 스크린샷 수집
      video
  :
    'on',                      // 비디오 녹화
      headless
  :
    false,                  // 브라우저 화면 표시 (개발용)
      viewport
  :
    {
      width: 1280, height
    :
      720
    }
  , // 뷰포트 크기
  }
}
```

## 🎯 프로젝트별 최적화 설정

### 개발 환경 (`playwright.config.dev.ts`)

```typescript
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: false,              // 브라우저 화면 표시
    slowMo: 500,                  // 액션 간 지연 (디버깅용)
    video: 'on',                  // 모든 테스트 비디오 저장
  },
  timeout: 60 * 1000,             // 넉넉한 타임아웃
  workers: 1,                     // 디버깅을 위한 순차 실행
});
```

### CI 환경 (`playwright.config.ci.ts`)

```typescript
export default defineConfig({
  ...baseConfig,
  use: {
    ...baseConfig.use,
    headless: true,               // 헤드리스 모드
    video: 'retain-on-failure',   // 실패 시만 비디오
  },
  timeout: 30 * 1000,             // 빠른 피드백
  retries: 2,                     // 안정성을 위한 재시도
  workers: 1,                     // 서버 부하 최소화
});
```

## 🔍 고급 설정 옵션

### 1. 전역 설정 (Global Setup)

```typescript
{
  globalSetup: './global-setup.ts',  // 모든 테스트 전 실행
    globalTeardown
:
  './global-teardown.ts', // 모든 테스트 후 실행
}
```

**활용 예:**

- 테스트 데이터베이스 준비
- 인증 토큰 사전 생성
- 서버 상태 초기화

### 2. 프록시 및 네트워크 설정

```typescript
{
  use: {
    proxy: {
      server: 'http://localhost:8080'
    }
  ,
    ignoreHTTPSErrors: true,        // HTTPS 인증서 오류 무시
      bypassCSP
  :
    true,                // CSP 우회 (테스트용)
  }
}
```

### 3. 인증 상태 관리

```typescript
{
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'authenticated',
      use: {
        storageState: 'auth-state.json' // 인증 상태 재사용
      },
      dependencies: ['setup'],
    }
  ]
}
```

## 📊 현재 프로젝트 최적화 근거

### 1. 순차 실행 선택 이유

```typescript
fullyParallel: false,
  workers
:
process.env.CI ? 1 : undefined,
```

**장점:**

- ✅ 인증 상태 공유 안정성
- ✅ 데이터베이스 상태 일관성
- ✅ SSR 캐시 무효화 테스트 정확성
- ✅ 서버 부하 최소화

**단점:**

- ❌ 테스트 실행 시간 증가
- ❌ 리소스 활용도 낮음

### 2. 리포터 다중 설정

```typescript
reporter: [
  ['html'],      // 개발자 디버깅용
  ['json'],      // CI 데이터 처리용
  ['junit'],     // CI 통합용
  ['line']       // 실시간 피드백용
]
```

**효과:**

- 개발 환경: HTML 리포트로 상세 분석
- CI 환경: JSON/JUnit으로 자동화 통합
- 실시간: Line 리포터로 즉각적 피드백

### 3. 스크린샷 및 비디오 수집

```typescript
screenshot: 'on',
  video
:
'on'
```

**이유:**

- UI/UX 테스트 특성상 시각적 확인 필수
- SSR+CSR 하이브리드에서 렌더링 상태 추적
- 이미지 업로드 기능 검증

## 🚀 실행 명령어

### 개발 환경

```bash
# 기본 실행
npx playwright test

# 브라우저 화면 보며 실행
npx playwright test --headed

# 디버그 모드 (단계별 실행)
npx playwright test --debug

# UI 모드 (대화형 테스트)
npx playwright test --ui

# 특정 테스트만 실행
npx playwright test auth.spec.ts

# 특정 라인만 실행
npx playwright test auth.spec.ts:24
```

### CI 환경

```bash
# 헤드리스 모드 전체 실행
npx playwright test

# 리포트 생성 및 확인
npx playwright show-report

# 결과 파일 확인
cat test-results.json
cat results.xml
```
