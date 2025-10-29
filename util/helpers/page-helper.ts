import {expect, Page} from '@playwright/test';

/**
 * 페이지 공통 기능 헬퍼 클래스
 * 페이지 로딩, 스크린샷, 스크롤, 콘솔 에러 확인 등의 공통 기능 제공
 */
export class PageHelper {
  /**
   * 페이지 완전 로딩 대기
   */
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    try {
      // 네트워크 idle 대기
      await page.waitForLoadState('networkidle', {timeout});

      // DOM 로딩 완료 대기
      await page.waitForLoadState('domcontentloaded', {timeout});

      console.log('✅ 페이지 로딩 완료');
    } catch (error) {
      console.log('⚠️ 페이지 로딩 시간 초과, 계속 진행');
    }
  }

  /**
   * 테스트 실패 시 스크린샷 촬영
   */
  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<string | null> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${testName}-failure-${timestamp}.png`;
      const screenshotPath = `test-results/screenshots/${filename}`;

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      console.log(`📸 실패 스크린샷 저장: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.log('⚠️ 스크린샷 저장 실패:', error);
      return null;
    }
  }

  /**
   * 페이지 하단까지 스크롤
   */
  static async scrollToBottom(page: Page, delay: number = 1000): Promise<void> {
    await page.evaluate(async (scrollDelay) => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            setTimeout(resolve, scrollDelay);
          }
        }, 100);
      });
    }, delay);

    console.log('✅ 페이지 하단까지 스크롤 완료');
  }

  /**
   * 페이지 상단으로 스크롤
   */
  static async scrollToTop(page: Page): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    console.log('✅ 페이지 상단으로 스크롤 완료');
  }

  /**
   * 콘솔 에러 확인
   */
  static async verifyNoConsoleErrors(page: Page): Promise<void> {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 잠시 대기하여 콘솔 에러 수집
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('❌ 콘솔 에러 발견:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
      throw new Error(`콘솔 에러 발견: ${consoleErrors.length}개`);
    }

    console.log('✅ 콘솔 에러 없음');
  }

  /**
   * 페이지 제목 확인
   */
  static async verifyPageTitle(page: Page, expectedTitle: string | RegExp): Promise<void> {
    if (typeof expectedTitle === 'string') {
      await expect(page).toHaveTitle(expectedTitle);
    } else {
      await expect(page).toHaveTitle(expectedTitle);
    }

    console.log(`✅ 페이지 제목 확인: ${expectedTitle}`);
  }

  /**
   * URL 확인
   */
  static async verifyCurrentUrl(page: Page, expectedUrl: string | RegExp): Promise<void> {
    if (typeof expectedUrl === 'string') {
      await expect(page).toHaveURL(expectedUrl);
    } else {
      await expect(page).toHaveURL(expectedUrl);
    }

    console.log(`✅ URL 확인: ${expectedUrl}`);
  }

  /**
   * 요소가 표시될 때까지 대기
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    await page.waitForSelector(selector, {timeout, state: 'visible'});
    console.log(`✅ 요소 표시 확인: ${selector}`);
  }

  /**
   * 요소가 사라질 때까지 대기
   */
  static async waitForElementToDisappear(page: Page, selector: string, timeout: number = 10000): Promise<void> {
    await page.waitForSelector(selector, {timeout, state: 'hidden'});
    console.log(`✅ 요소 숨김 확인: ${selector}`);
  }

  /**
   * 모든 이미지 로딩 완료 대기
   */
  static async waitForAllImages(page: Page, timeout: number = 15000): Promise<void> {
    await page.waitForFunction(() => {
      const images = Array.from(document.images);
      return images.every(img => img.complete && img.naturalHeight !== 0);
    }, {timeout});

    console.log('✅ 모든 이미지 로딩 완료');
  }

  /**
   * 페이지 전체 스크린샷 촬영
   */
  static async takeFullPageScreenshot(page: Page, filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = filename || `full-page-${timestamp}.png`;
    const screenshotPath = `test-results/screenshots/${screenshotName}`;

    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    console.log(`📸 전체 페이지 스크린샷 저장: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * 특정 요소 스크린샷 촬영
   */
  static async takeElementScreenshot(page: Page, selector: string, filename?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = filename || `element-${timestamp}.png`;
    const screenshotPath = `test-results/screenshots/${screenshotName}`;

    const element = page.locator(selector);
    await element.screenshot({path: screenshotPath});

    console.log(`📸 요소 스크린샷 저장: ${screenshotPath}`);
    return screenshotPath;
  }

  /**
   * 페이지 성능 메트릭 수집
   */
  static async getPerformanceMetrics(page: Page): Promise<any> {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.startTime,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    console.log('📊 성능 메트릭:', metrics);
    return metrics;
  }

  /**
   * 로딩 스피너 대기
   */
  static async waitForLoadingToComplete(page: Page, timeout: number = 15000): Promise<void> {
    try {
      // 로딩 스피너가 나타나길 대기
      await page.waitForSelector([
        '.loading',
        '.spinner',
        '[data-testid="loading"]',
        '.loading-overlay'
      ].join(', '), {timeout: 5000});

      // 로딩 스피너가 사라지길 대기
      await page.waitForSelector([
        '.loading',
        '.spinner',
        '[data-testid="loading"]',
        '.loading-overlay'
      ].join(', '), {state: 'hidden', timeout});

      console.log('✅ 로딩 완료');
    } catch {
      // 로딩 스피너가 없거나 이미 사라진 경우
      console.log('✅ 로딩 스피너 없음 또는 이미 완료');
    }
  }

  /**
   * API 응답 대기
   */
  static async waitForApiResponse(page: Page, urlPattern: string | RegExp, timeout: number = 15000): Promise<any> {
    const response = await page.waitForResponse(
      response => {
        const url = response.url();
        return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
      },
      {timeout}
    );

    console.log(`✅ API 응답 수신: ${response.url()}`);
    return response;
  }
}
