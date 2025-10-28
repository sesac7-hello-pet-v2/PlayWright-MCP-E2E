# Feed 페이지 E2E 테스트

## 🎯 현재 상황

### 현재 test 폴더 구성

```
test/
├── README.md                     # 이 파일 - 전체 테스트 가이드
├── auth/                         # 인증 관련 테스트
├── feed/                         # 피드 핵심 기능 테스트
│   └── comment/                  # 댓글 기능 세부 테스트
├── navigation/                   # 페이지 네비게이션 테스트
└── util/                         # 테스트 유틸리티 및 리소스
    └── feed_image/               # 테스트용 이미지 파일들 (17개)
```

### 레거시 프론트엔드 분석 완료

- **SSR + CSR 하이브리드 구조**: 초기 로드는 SSR, 이후 상호작용은 CSR
- **Optimistic UI**: 즉시 UI 업데이트 후 서버 동기화
- **캐시 무효화**: Server Action으로 5초 쿨다운 메커니즘
- **상태 관리**: Zustand 기반 PostStore, UserStore

## 📋 테스트 진행 계획

### 1단계: 기본 환경 구축 (우선)

```bash
# Playwright 설치 및 설정
npm init playwright@latest
cd test && npx playwright install

# 기본 설정 파일
playwright.config.ts
```

### 2단계: 핵심 기능 테스트 구현

```
test/
├── playwright.config.ts         # Playwright 설정
├── auth.spec.ts                 # 로그인/로그아웃 기본 기능
├── feed-navigation.spec.ts      # 페이지 이동 및 기본 UI
├── feed-crud.spec.ts           # 게시글 CRUD 핵심 기능
└── utils/
    ├── auth-helper.ts          # 로그인 헬퍼
    └── feed-helper.ts          # 피드 상호작용 헬퍼
```

### 3단계: 고급 기능 테스트 추가

```
test/
├── feed-interactions.spec.ts   # 좋아요/댓글 기능
├── image-upload.spec.ts        # 이미지 업로드 (1-5개)
├── modal-behaviors.spec.ts     # 게시글 상세 모달
└── performance.spec.ts         # SSR+CSR, 캐시 무효화
```

## 🧪 테스트 접근 방식

### 실제 사용자 관점

```typescript
// ❌ 개발자 관점
await page.locator('[data-testid="create-post"]').click();

// ✅ 사용자 관점
await page.locator('button:has-text("새 게시물"), .create-post, [title*="작성"]').click();
```

### 레거시 코드 기반

- 현재 구현된 실제 셀렉터와 동작 방식 사용
- 이상적인 구현이 아닌 현실적인 구현 테스트
- data-testid가 없어도 동작하는 안정적인 셀렉터

### 점진적 구현

1. **MVP**: 로그인 → 게시글 작성 → 조회 기본 플로우
2. **확장**: 이미지 업로드, 좋아요, 댓글 기능
3. **고도화**: 성능, 접근성, 에러 처리

## 🎯 핵심 테스트 시나리오

### P0 (최우선)

1. **로그인 플로우**: test@test.test / test123!@# 계정 사용
2. **게시글 작성**: 텍스트 + 이미지 업로드
3. **게시글 조회**: 피드에서 작성한 게시글 확인
4. **기본 네비게이션**: /feed, /feed/create 이동

### P1 (중요)

1. **좋아요 기능**: 클릭 시 즉시 반영 및 서버 동기화
2. **댓글 기능**: 댓글 작성 및 조회
3. **게시글 수정/삭제**: 본인 게시글 편집
4. **모달 상호작용**: 상세보기, ESC 키, 배경 클릭

### P2 (보완)

1. **무한 스크롤**: 200px 임계값 트리거
2. **반응형 디자인**: 모바일/태블릿/데스크톱
3. **에러 처리**: 네트워크 실패, 인증 만료
4. **접근성**: 키보드 네비게이션

## 🔧 기술 스택 및 설정

### 도구 선택

- **Framework**: Playwright (크로스 브라우저, 안정성)
- **Language**: TypeScript (타입 안정성)
- **Target**: https://hello-pet.my (실제 배포 환경)
- **Execution**: 순차 실행 (안정성 우선)

### 테스트 계정

- **Primary**: test@test.test / test123!@#
- **Backup**: 필요시 추가 계정 생성

### 설정 방향

```typescript
// playwright.config.ts 기본 방향
{
  testDir: './test',
  fullyParallel: false,     // 순차 실행
  workers: 1,               // 안정성 확보
  retries: 2,               // CI 환경에서만
  use: {
    baseURL: 'https://hello-pet.my',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
}
```

## 🚀 실행 방법 (예정)

### 개발 환경

```bash
# 브라우저 화면 보면서 실행
cd test && npx playwright test --headed

# 특정 테스트만 실행
cd test && npx playwright test auth.spec.ts

# 디버그 모드 (단계별 실행)
cd test && npx playwright test --debug
```

### CI 환경

```bash
# 헤드리스 모드로 전체 실행
cd test && npx playwright test

# 리포트 생성
cd test && npx playwright show-report
```

## 📊 성공 기준

### 기능적 목표

- **핵심 플로우**: 로그인 → 작성 → 조회 → 상호작용 100% 성공
- **안정성**: Flaky test 0% (재실행 없이 안정적)
- **커버리지**: 주요 사용자 시나리오 95% 커버

### 비기능적 목표

- **실행 시간**: 전체 테스트 < 5분
- **유지보수성**: 코드 변경 시 테스트 수정 최소화
- **가독성**: 테스트 시나리오가 명확하게 이해 가능

## 🔄 다음 액션 아이템

### 즉시 실행

1. **Playwright 초기 설정**: `npm init playwright@latest`
2. **기본 테스트 파일 생성**: auth.spec.ts, feed-navigation.spec.ts
3. **헬퍼 함수 구현**: 로그인, 페이지 이동 유틸리티

### 1주 내

1. **핵심 CRUD 테스트**: 게시글 작성/조회/수정/삭제
2. **이미지 업로드 테스트**: 1-5개 이미지 처리
3. **기본 상호작용**: 좋아요, 댓글 기능

### 1개월 내

1. **성능 테스트**: SSR+CSR 하이브리드, 캐시 무효화
2. **접근성 테스트**: 키보드, 스크린 리더
3. **에러 처리**: 네트워크 실패, 권한 에러

## 💡 핵심 철학

### 실용성 우선

- 완벽한 테스트보다는 **동작하는 안정적인 테스트**
- 이론적 완성도보다는 **실제 문제 발견 능력**
- 복잡한 구조보다는 **이해하기 쉬운 단순함**

### 사용자 중심

- 개발자가 편한 방식이 아닌 **실제 사용자가 사용하는 방식**
- 기술적 구현보다는 **비즈니스 가치 검증**
- 단위 테스트보다는 **통합 시나리오**

### 점진적 발전

- 한 번에 완벽하게 만들기보다는 **작은 것부터 안정적으로**
- 기존 것을 버리지 말고 **개선하며 확장**
- 이론보다는 **실제 경험을 통한 학습**

---

**현재 목표**: Playwright 설정 완료 후 기본 로그인 → 게시글 작성 → 조회 플로우 테스트 구현
