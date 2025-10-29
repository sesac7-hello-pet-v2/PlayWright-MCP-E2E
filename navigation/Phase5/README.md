# Phase 5: 성능 및 접근성 테스트

## 📋 개요

Phase 5는 네비게이션의 성능과 접근성을 검증하여 모든 사용자가 원활하게 사이트를 이용할 수 있도록 보장합니다.

## 🎯 테스트 목표

- **성능 측정**: 페이지 로딩 시간, 메모리 사용량, 네트워크 리소스
- **접근성 검증**: 키보드 네비게이션, 스크린 리더 호환성, WCAG 가이드라인 준수
- **사용자 경험**: 응답 시간, 인터랙션 지연, 시각적 피드백
- **리소스 최적화**: 불필요한 요청 제거, 캐싱 효율성
- **크로스 브라우저**: 다양한 브라우저에서 일관된 성능

## 📁 테스트 파일 구조

```
Phase5/
├── README.md                    # 이 파일
├── performance.spec.ts          # 페이지 로딩 성능 테스트 (예정)
└── accessibility.spec.ts        # 접근성 테스트 (예정)
```

## 🧪 계획된 테스트 케이스

### performance.spec.ts (예정)

#### 페이지 로딩 성능 테스트

```typescript
import { test, expect } from '@playwright/test';
import { PageHelper, SelectorHelper } from '../../util/helpers';

test.describe('네비게이션 성능 테스트', () => {
  test('페이지 간 이동 속도 측정', async ({ page }) => {
    // 성능 메트릭 수집 시작
    await page.goto('/');
    const homeMetrics = await PageHelper.getPerformanceMetrics(page);

    // 여러 페이지 이동 시간 측정
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    const pages = [
      { selector: navigationSelectors.aboutLink, name: 'About', url: '/about' },
      { selector: navigationSelectors.feedLink, name: 'Feed', url: '/feed' },
      { selector: navigationSelectors.announcementsLink, name: 'Announcements', url: '/announcements' },
      { selector: navigationSelectors.noticesLink, name: 'Notices', url: '/notices' }
    ];

    const navigationTimes = [];

    for (const pageInfo of pages) {
      const startTime = Date.now();

      await page.click(pageInfo.selector);
      await PageHelper.waitForPageLoad(page);
      await PageHelper.verifyCurrentUrl(page, new RegExp(`.*${pageInfo.url}`));

      const endTime = Date.now();
      const navigationTime = endTime - startTime;
      navigationTimes.push({
        page: pageInfo.name,
        time: navigationTime
      });

      console.log(`📊 ${pageInfo.name} 페이지 이동 시간: ${navigationTime}ms`);

      // 각 페이지는 5초 이내에 로딩되어야 함
      expect(navigationTime).toBeLessThan(5000);
    }

    // 평균 네비게이션 시간 계산
    const averageTime = navigationTimes.reduce((sum, item) => sum + item.time, 0) / navigationTimes.length;
    console.log(`📊 평균 네비게이션 시간: ${averageTime.toFixed(2)}ms`);

    // 평균 네비게이션 시간은 3초 이내여야 함
    expect(averageTime).toBeLessThan(3000);
  });

  test('메모리 사용량 측정', async ({ page }) => {
    await page.goto('/');

    // 초기 메모리 사용량
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null;
    });

    if (initialMemory) {
      console.log(`📊 초기 메모리 사용량: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // 반복적인 네비게이션으로 메모리 누수 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    for (let i = 0; i < 10; i++) {
      await page.click(navigationSelectors.aboutLink);
      await PageHelper.waitForPageLoad(page);

      await page.click(navigationSelectors.feedLink);
      await PageHelper.waitForPageLoad(page);

      await page.click(navigationSelectors.logo);
      await PageHelper.waitForPageLoad(page);
    }

    // 최종 메모리 사용량
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize
      } : null;
    });

    if (finalMemory && initialMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      console.log(`📊 메모리 증가량: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);

      // 메모리 증가량이 50MB를 초과하지 않아야 함 (메모리 누수 방지)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('네트워크 리소스 최적화 확인', async ({ page }) => {
    const networkRequests = [];

    // 네트워크 요청 모니터링
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.goto('/');
    await PageHelper.waitForPageLoad(page);

    // 네비게이션 시 추가 요청 모니터링
    const navigationSelectors = SelectorHelper.getNavigationSelectors();
    await page.click(navigationSelectors.feedLink);
    await PageHelper.waitForPageLoad(page);

    // 네트워크 요청 분석
    const imageRequests = networkRequests.filter(req => req.resourceType === 'image');
    const jsRequests = networkRequests.filter(req => req.resourceType === 'script');
    const cssRequests = networkRequests.filter(req => req.resourceType === 'stylesheet');

    console.log(`📊 총 네트워크 요청: ${networkRequests.length}개`);
    console.log(`📊 이미지 요청: ${imageRequests.length}개`);
    console.log(`📊 JavaScript 요청: ${jsRequests.length}개`);
    console.log(`📊 CSS 요청: ${cssRequests.length}개`);

    // 리소스 요청 수가 합리적인 범위 내에 있는지 확인
    expect(networkRequests.length).toBeLessThan(100); // 총 요청 수
    expect(imageRequests.length).toBeLessThan(50);     // 이미지 요청 수
    expect(jsRequests.length).toBeLessThan(20);        // JS 요청 수
  });

  test('캐싱 효율성 확인', async ({ page }) => {
    // 첫 번째 방문
    await page.goto('/');
    await PageHelper.waitForPageLoad(page);

    // 두 번째 방문 (캐시 활용)
    await page.reload();
    await PageHelper.waitForPageLoad(page);

    // 캐시 헤더 확인 (실제 구현에서는 더 정교한 캐시 검증 필요)
    const cacheHeaders = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0];
    });

    console.log('📊 캐시 성능 메트릭:', cacheHeaders);

    // 두 번째 로딩이 첫 번째보다 빨라야 함 (캐시 효과)
    // 실제 구현에서는 더 정확한 캐시 검증 로직 필요
  });
});
```

### accessibility.spec.ts (예정)

#### 접근성 테스트

```typescript
test.describe('네비게이션 접근성 테스트', () => {
  test('키보드 네비게이션 지원', async ({ page }) => {
    await page.goto('/');
    await PageHelper.waitForPageLoad(page);

    // Tab 키를 이용한 네비게이션 요소 순회
    const focusableElements = [];

    // 첫 번째 포커스 가능한 요소로 이동
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluateHandle(() => document.activeElement);
    let tagName = await focusedElement.evaluate(el => el.tagName);
    focusableElements.push(tagName);

    // 네비게이션 바의 모든 포커스 가능한 요소 순회
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluateHandle(() => document.activeElement);
      tagName = await focusedElement.evaluate(el => el.tagName);

      if (tagName === 'BODY') break; // 순회 완료
      focusableElements.push(tagName);
    }

    console.log('📋 포커스 가능한 요소들:', focusableElements);

    // 로고, 메뉴 링크들이 키보드로 접근 가능한지 확인
    expect(focusableElements).toContain('A'); // 링크 요소들
    expect(focusableElements.length).toBeGreaterThan(3); // 최소 3개 이상의 포커스 가능 요소
  });

  test('Enter 키로 네비게이션 활성화', async ({ page }) => {
    await page.goto('/');

    // Tab으로 소개 링크에 포커스
    await page.keyboard.press('Tab');

    // 현재 포커스된 요소가 올바른 링크인지 확인
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const href = await focusedElement.evaluate(el => (el as HTMLAnchorElement).href);

    if (href && href.includes('/about')) {
      // Enter 키로 링크 활성화
      await page.keyboard.press('Enter');
      await PageHelper.waitForPageLoad(page);

      // 페이지 이동 확인
      await PageHelper.verifyCurrentUrl(page, /.*\/about/);
      console.log('✅ Enter 키 네비게이션 성공');
    }
  });

  test('스크린 리더 호환성 확인', async ({ page }) => {
    await page.goto('/');

    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // ARIA 라벨 및 역할 확인
    const logoAriaLabel = await page.locator(navigationSelectors.logo).getAttribute('aria-label');
    const navRole = await page.locator('nav').getAttribute('role');

    // 적절한 ARIA 속성이 설정되어 있는지 확인
    expect(logoAriaLabel || '').toBeTruthy(); // 로고에 ARIA 라벨 또는 alt 텍스트
    expect(navRole).toBe('navigation'); // 네비게이션 역할

    // 모든 링크에 접근 가능한 텍스트가 있는지 확인
    const menuLinks = await page.locator('nav a').all();
    for (const link of menuLinks) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');

      expect(text || ariaLabel || title).toBeTruthy();
    }

    console.log('✅ 스크린 리더 호환성 확인 완료');
  });

  test('색상 대비 및 시각적 접근성', async ({ page }) => {
    await page.goto('/');

    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // 메뉴 링크의 색상 대비 확인
    const linkStyles = await page.locator(navigationSelectors.aboutLink).evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        fontSize: styles.fontSize
      };
    });

    console.log('📊 링크 스타일:', linkStyles);

    // 글꼴 크기가 최소 기준을 만족하는지 확인
    const fontSize = parseInt(linkStyles.fontSize);
    expect(fontSize).toBeGreaterThanOrEqual(14); // 최소 14px

    // 호버 상태에서 충분한 시각적 피드백 제공 확인
    await page.hover(navigationSelectors.aboutLink);
    await page.waitForTimeout(500);

    const hoverStyles = await page.locator(navigationSelectors.aboutLink).evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // 호버 시 색상 변화가 있는지 확인
    const hasColorChange = linkStyles.color !== hoverStyles.color ||
                          linkStyles.backgroundColor !== hoverStyles.backgroundColor;

    expect(hasColorChange).toBeTruthy();
    console.log('✅ 호버 상태 시각적 피드백 확인');
  });

  test('포커스 관리 및 순서', async ({ page }) => {
    await page.goto('/');

    // 페이지 이동 시 포커스가 적절히 관리되는지 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // 링크 클릭 후 새 페이지에서 포커스 위치 확인
    await page.click(navigationSelectors.aboutLink);
    await PageHelper.waitForPageLoad(page);

    // 새 페이지에서 포커스가 적절한 위치에 있는지 확인
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate(el => el.tagName);

    // 일반적으로 페이지 이동 후에는 body나 main 요소에 포커스가 있어야 함
    expect(['BODY', 'MAIN', 'H1'].includes(tagName)).toBeTruthy();

    // 스킵 링크가 있는 경우 (접근성 향상)
    await page.keyboard.press('Tab');
    const firstFocusable = await page.evaluateHandle(() => document.activeElement);
    const isSkipLink = await firstFocusable.evaluate(el =>
      el.textContent?.includes('컨텐츠로 이동') ||
      el.textContent?.includes('메인으로 이동')
    );

    if (isSkipLink) {
      console.log('✅ 스킵 링크 발견 - 우수한 접근성');
    }
  });

  test('반응형 네비게이션 접근성', async ({ page }) => {
    // 모바일 뷰포트에서 접근성 확인
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 모바일에서 햄버거 메뉴가 있는 경우 키보드 접근성 확인
    const mobileMenuButton = page.locator('button[aria-label*="메뉴"], .hamburger, .mobile-menu-toggle');

    try {
      await expect(mobileMenuButton).toBeVisible({ timeout: 3000 });

      // 햄버거 메뉴 버튼에 적절한 ARIA 속성 확인
      const ariaLabel = await mobileMenuButton.getAttribute('aria-label');
      const ariaExpanded = await mobileMenuButton.getAttribute('aria-expanded');

      expect(ariaLabel).toBeTruthy();
      expect(ariaExpanded).toBe('false'); // 초기 상태

      // 키보드로 메뉴 열기
      await mobileMenuButton.focus();
      await page.keyboard.press('Enter');

      // 메뉴가 열린 후 aria-expanded 상태 확인
      const expandedState = await mobileMenuButton.getAttribute('aria-expanded');
      expect(expandedState).toBe('true');

      console.log('✅ 모바일 메뉴 접근성 확인 완료');
    } catch {
      console.log('ℹ️ 모바일 햄버거 메뉴 없음 - 기본 네비게이션 유지');
    }
  });
});
```

## 🚀 테스트 실행 방법

```bash
# Phase5 전체 테스트 실행
npx playwright test test/navigation/Phase5/

# 성능 테스트만 실행
npx playwright test test/navigation/Phase5/performance.spec.ts

# 접근성 테스트만 실행
npx playwright test test/navigation/Phase5/accessibility.spec.ts

# 느린 네트워크 환경에서 성능 테스트
npx playwright test test/navigation/Phase5/performance.spec.ts --project="Slow Network"

# 다양한 디바이스에서 접근성 테스트
npx playwright test test/navigation/Phase5/accessibility.spec.ts --project="Mobile"

# 성능 리포트와 함께 실행
npx playwright test test/navigation/Phase5/ --reporter=html
```

## 📊 성능 벤치마크

### 목표 성능 지표

| 메트릭         | 목표 값    | 우수 값    |
|-------------|---------|---------|
| 페이지 로딩 시간   | < 3초    | < 1초    |
| 네비게이션 응답 시간 | < 500ms | < 200ms |
| 메모리 사용량 증가  | < 50MB  | < 20MB  |
| 네트워크 요청 수   | < 100개  | < 50개   |

### 접근성 요구사항

| 항목        | 요구사항        | 검증 방법      |
|-----------|-------------|------------|
| 키보드 네비게이션 | 모든 요소 접근 가능 | Tab 순회 테스트 |
| 스크린 리더    | ARIA 라벨 완비  | 속성 검증      |
| 색상 대비     | WCAG AA 준수  | 대비율 계산     |
| 포커스 관리    | 논리적 순서      | 포커스 순서 확인  |

## 🔧 사용할 도구 및 라이브러리

### 성능 측정 도구

```typescript
// Playwright 내장 성능 API
const metrics = await PageHelper.getPerformanceMetrics(page);

// 커스텀 성능 측정
const navigationTime = await page.evaluate(() => {
  return performance.timing.loadEventEnd - performance.timing.navigationStart;
});

// 메모리 사용량 측정 (Chrome 전용)
const memoryInfo = await page.evaluate(() => (performance as any).memory);
```

### 접근성 검증 도구

```typescript
// axe-core 통합 (추가 설치 필요)
// npm install @axe-core/playwright

import { injectAxe, checkA11y } from '@axe-core/playwright';

test('axe 접근성 검사', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## 🎯 성공 기준

### 성능 기준

- ✅ 모든 페이지 로딩 시간 3초 이내
- ✅ 네비게이션 응답 시간 500ms 이내
- ✅ 메모리 누수 없음 (10회 반복 후 50MB 이내 증가)
- ✅ 네트워크 요청 최적화 (불필요한 요청 제거)

### 접근성 기준

- ✅ WCAG 2.1 AA 레벨 준수
- ✅ 키보드만으로 모든 기능 사용 가능
- ✅ 스크린 리더 완전 호환
- ✅ 색상에 의존하지 않는 정보 전달

### 사용자 경험 기준

- ✅ 시각적 피드백 제공 (호버, 포커스 상태)
- ✅ 로딩 상태 표시
- ✅ 에러 상황 접근성 유지
- ✅ 반응형 디자인 접근성

## 📋 성능 최적화 권장사항

### 코드 레벨 최적화

```typescript
// 이미지 lazy loading
<img loading="lazy" src="..." alt="..." />

// 중요하지 않은 리소스 지연 로딩
<link rel="preload" href="critical.css" as="style" />
<link rel="prefetch" href="non-critical.js" />

// 메뉴 이벤트 최적화
const handleMenuClick = useCallback((e) => {
  // 이벤트 처리 로직
}, []);
```

### 네트워크 최적화

- CDN 활용
- 이미지 압축 및 최적화
- HTTP/2 활용
- 적절한 캐시 헤더 설정

## 📋 다음 단계

Phase 5 완료 후:

1. **전체 통합 테스트**: Phase 1-5 연계 실행
2. **성능 모니터링**: 실제 사용자 환경에서 성능 추적
3. **접근성 인증**: 외부 접근성 감사
4. **지속적 개선**: 성능 및 접근성 지표 모니터링 시스템 구축
