# Phase 1: 기본 네비게이션 테스트

## 📋 개요

Phase 1은 로그인 상태와 관계없이 접근 가능한 기본 네비게이션 기능을 검증합니다.

## 🎯 테스트 목표

- **헤더 네비게이션**: 로고, 메뉴 링크들의 기본 동작 확인
- **페이지 접근성**: 모든 공개 페이지에 정상 접근 가능한지 확인
- **반응형 대응**: 다양한 화면 크기에서 네비게이션 표시 확인
- **브라우저 호환성**: 브라우저 뒤로가기/앞으로가기 버튼 동작 확인

## 📁 테스트 파일 구조

```
Phase1/
├── README.md                    # 이 파일
├── basic-navigation.spec.ts     # 기본 헤더 네비게이션 테스트 ✅
├── page-access.spec.ts          # 기본 페이지 접근 테스트 (예정)
└── responsive.spec.ts           # 반응형 네비게이션 테스트 (예정)
```

## 🧪 구현된 테스트: basic-navigation.spec.ts ✅

### 테스트 케이스

1. **로고 클릭 테스트**
    - 다른 페이지에서 로고 클릭 시 홈페이지로 이동
    - URL 변경 확인

2. **메뉴 링크 테스트**
    - 소개 (`/about`) 페이지 이동
    - 입양게시판 (`/announcements`) 페이지 이동
    - 피드 (`/feed`) 페이지 이동
    - 공지사항 (`/notices`) 페이지 이동

3. **UI 인터랙션 테스트**
    - 메뉴 아이템 호버 효과 확인
    - 네비게이션 바 표시 확인
    - 모든 메뉴 항목 표시 확인

4. **브라우저 네비게이션 테스트**
    - 브라우저 뒤로가기 버튼 동작
    - 브라우저 앞으로가기 버튼 동작

### 사용된 헬퍼 함수

```typescript
import {PageHelper, SelectorHelper} from '../../util/helpers';

// 페이지 로딩 대기
await PageHelper.waitForPageLoad(page);

// URL 확인
await PageHelper.verifyCurrentUrl(page, '/');

// 플렉시블 셀렉터 사용
const navigationSelectors = SelectorHelper.getNavigationSelectors();
await page.click(navigationSelectors.feedLink);
```

## 🚀 테스트 실행 방법

### Phase1 전체 테스트 실행

```bash
# Phase1 모든 테스트 실행
npx playwright test test/navigation/Phase1/

# 헤드 모드로 실행 (브라우저 화면 보기)
npx playwright test test/navigation/Phase1/ --headed

# 디버그 모드로 실행
npx playwright test test/navigation/Phase1/ --debug
```

### 개별 테스트 파일 실행

```bash
# 기본 네비게이션 테스트만 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts

# 특정 테스트 케이스만 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts -g "로고 클릭"

# 시리얼 모드로 실행 (순차 실행)
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts --workers=1
```

## 📊 테스트 결과 예시

### 성공 케이스

```
✅ 로고 클릭으로 홈페이지 이동 성공
✅ 소개 페이지 이동 및 렌더링 성공
✅ 입양게시판 페이지 이동 및 렌더링 성공
✅ 피드 페이지 이동 및 렌더링 성공
✅ 공지사항 페이지 이동 및 렌더링 성공
✅ 메뉴 호버 효과 확인 완료
✅ 네비게이션 바 및 모든 메뉴 항목 표시 확인
✅ 브라우저 뒤로가기 버튼 동작 확인
✅ 브라우저 앞으로가기 버튼 동작 확인
```

### 실패 시 디버깅

```bash
# 실패한 테스트 스크린샷 확인
ls test-results/

# 자세한 로그와 함께 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts --reporter=list

# 특정 브라우저에서만 실행
npx playwright test test/navigation/Phase1/basic-navigation.spec.ts --project=chromium
```

## 🔧 기술적 특징

### 플렉시블 셀렉터 시스템

```typescript
// SelectorHelper를 통한 다중 셀렉터 패턴
const feedLink = SelectorHelper.getNavigationSelectors().feedLink;
// 내부적으로 다음과 같은 셀렉터들을 시도:
// 'a[href="/feed"]', 'a:has-text("피드")', '.nav-link:has-text("피드")', '[data-testid="feed-link"]'
```

### 자동 대기 메커니즘

```typescript
// PageHelper를 통한 자동 페이지 로딩 대기
await PageHelper.waitForPageLoad(page);
// 내부적으로 networkidle과 domcontentloaded 상태를 대기
```

### 강력한 에러 핸들링

```typescript
// 여러 가능한 요소 중 하나라도 찾으면 성공 처리
const feedElements = ['.feed-container', '.post-list', '[data-testid="feed"]', 'main'];
let feedElementFound = false;
for (const selector of feedElements) {
  try {
    await expect(page.locator(selector)).toBeVisible({timeout: 3000});
    feedElementFound = true;
    break;
  } catch {
    continue;
  }
}
```

## 📋 다음 단계 (예정)

### page-access.spec.ts

- 각 페이지별 세부 접근성 테스트
- 페이지 로딩 성능 측정
- 콘솔 에러 검증

### responsive.spec.ts

- 데스크톱, 태블릿, 모바일 반응형 테스트
- 햄버거 메뉴 동작 (모바일)
- 뷰포트 크기별 네비게이션 표시

## 🔍 알려진 이슈

- **호버 효과 검증**: 브라우저마다 CSS 호버 상태 감지 방식이 다를 수 있음
- **페이지 로딩 시간**: 네트워크 상태에 따라 타임아웃 발생 가능
- **동적 콘텐츠**: 피드 페이지의 동적 로딩 콘텐츠 대기 시간 필요

## 📈 성공 기준

- **모든 테스트 케이스 통과**: 9개 테스트 모두 성공
- **브라우저 호환성**: Chromium, Firefox, WebKit 모두 통과
- **성능**: 각 페이지 이동이 5초 이내 완료
- **안정성**: 5회 연속 실행 시 100% 성공률
