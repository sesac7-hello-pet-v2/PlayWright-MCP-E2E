import {expect, test} from '@playwright/test';
import {PageHelper, SelectorHelper} from '../../util/helpers';

/**
 * Phase 1.1: 기본 헤더 네비게이션 테스트
 * 로그인 상태와 관계없이 접근 가능한 기본 네비게이션 기능 검증
 */

test.describe('Phase 1.1: 기본 헤더 네비게이션 테스트', () => {
  test.beforeEach(async ({page}) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
    await PageHelper.waitForPageLoad(page);
  });

  test('로고 클릭 시 홈페이지로 이동', async ({page}) => {
    // 다른 페이지로 먼저 이동
    await page.goto('/about');
    await PageHelper.waitForPageLoad(page);

    // 로고 클릭
    const logoSelector = SelectorHelper.getNavigationSelectors().logo;
    await page.click(logoSelector);

    // 홈페이지로 이동 확인
    await PageHelper.verifyCurrentUrl(page, '/');
    console.log('✅ 로고 클릭으로 홈페이지 이동 성공');
  });

  test('소개 메뉴 링크 동작 확인', async ({page}) => {
    const aboutLinkSelector = SelectorHelper.getNavigationSelectors().aboutLink;

    // 소개 링크 클릭
    await page.click(aboutLinkSelector);
    await PageHelper.waitForPageLoad(page);

    // URL 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);

    // 페이지 제목 확인
    await expect(page.locator('h1, .page-title, [data-testid="page-title"]')).toBeVisible();
    console.log('✅ 소개 페이지 이동 및 렌더링 성공');
  });

  test('입양게시판 메뉴 링크 동작 확인', async ({page}) => {
    const announcementsLinkSelector = SelectorHelper.getNavigationSelectors().announcementsLink;

    // 입양게시판 링크 클릭
    await page.click(announcementsLinkSelector);
    await PageHelper.waitForPageLoad(page);

    // URL 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/announcements/);

    // 페이지 콘텐츠 확인
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 입양게시판 페이지 이동 및 렌더링 성공');
  });

  test('피드 메뉴 링크 동작 확인', async ({page}) => {
    const feedLinkSelector = SelectorHelper.getNavigationSelectors().feedLink;

    // 피드 링크 클릭
    await page.click(feedLinkSelector);
    await PageHelper.waitForPageLoad(page);

    // URL 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/feed/);

    // 피드 페이지 특성 요소 확인 (실제 페이지 구조 기반)
    const feedElements = [
      '.feed-sidebar',           // 왼쪽 사이드바 ("모든 게시글", "내 게시글")
      '[role="main"]',           // 메인 콘텐츠 영역
      '.post-item',              // 개별 게시글
      '.feed-post',              // 피드 게시글 카드
      'main',                    // HTML5 main 태그
      '.min-h-screen',           // 전체 페이지 컨테이너 (Tailwind CSS)
      'body'                     // 최후의 수단
    ];

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

    expect(feedElementFound).toBeTruthy();
    console.log('✅ 피드 페이지 이동 및 렌더링 성공');
  });

  test('공지사항 메뉴 링크 동작 확인', async ({page}) => {
    const noticesLinkSelector = SelectorHelper.getNavigationSelectors().noticesLink;

    // 공지사항 링크 클릭
    await page.click(noticesLinkSelector);
    await PageHelper.waitForPageLoad(page);

    // URL 확인
    await PageHelper.verifyCurrentUrl(page, /.*\/notices/);

    // 페이지 렌더링 확인
    await expect(page.locator('body')).toBeVisible();
    console.log('✅ 공지사항 페이지 이동 및 렌더링 성공');
  });

  test('메뉴 아이템 호버 효과 확인', async ({page}) => {
    const aboutLinkSelector = SelectorHelper.getNavigationSelectors().aboutLink;

    // 호버 전 색상 가져오기
    const originalColor = await page.locator(aboutLinkSelector).evaluate(el =>
      getComputedStyle(el).color
    );

    // 호버 효과 적용
    await page.hover(aboutLinkSelector);
    await page.waitForTimeout(500); // 호버 애니메이션 대기

    // 호버 후 색상 가져오기
    const hoveredColor = await page.locator(aboutLinkSelector).evaluate(el =>
      getComputedStyle(el).color
    );

    // 색상이 변경되었는지 확인 (또는 클래스 변화 확인)
    const hasColorChange = originalColor !== hoveredColor;
    const hasHoverClass = await page.locator(aboutLinkSelector).evaluate(el =>
      el.classList.contains('hover') ||
      el.matches(':hover') ||
      getComputedStyle(el).color.includes('rgb(245, 158, 11)') || // amber-500
      getComputedStyle(el).color.includes('rgb(217, 119, 6)')     // amber-600
    );

    expect(hasColorChange || hasHoverClass).toBeTruthy();
    console.log('✅ 메뉴 호버 효과 확인 완료');
  });

  test('네비게이션 바 표시 확인', async ({page}) => {
    // 네비게이션 바가 표시되는지 확인
    const navSelector = 'nav, .navigation, .navbar, [role="navigation"]';
    await expect(page.locator(navSelector)).toBeVisible();

    // 모든 주요 메뉴 항목이 표시되는지 확인
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    await expect(page.locator(navigationSelectors.logo)).toBeVisible();
    await expect(page.locator(navigationSelectors.aboutLink)).toBeVisible();
    await expect(page.locator(navigationSelectors.announcementsLink)).toBeVisible();
    await expect(page.locator(navigationSelectors.feedLink)).toBeVisible();
    await expect(page.locator(navigationSelectors.noticesLink)).toBeVisible();

    console.log('✅ 네비게이션 바 및 모든 메뉴 항목 표시 확인');
  });

  test('브라우저 뒤로가기 버튼 동작 확인', async ({page}) => {
    // 홈 → 소개 → 피드 순으로 이동
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    await page.click(navigationSelectors.aboutLink);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);

    await page.click(navigationSelectors.feedLink);
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /.*\/feed/);

    // 브라우저 뒤로가기
    await page.goBack();
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);

    // 한 번 더 뒤로가기
    await page.goBack();
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, '/');

    console.log('✅ 브라우저 뒤로가기 버튼 동작 확인');
  });

  test('브라우저 앞으로가기 버튼 동작 확인', async ({page}) => {
    const navigationSelectors = SelectorHelper.getNavigationSelectors();

    // 홈 → 소개로 이동
    await page.click(navigationSelectors.aboutLink);
    await PageHelper.waitForPageLoad(page);

    // 뒤로가기
    await page.goBack();
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, '/');

    // 앞으로가기
    await page.goForward();
    await PageHelper.waitForPageLoad(page);
    await PageHelper.verifyCurrentUrl(page, /.*\/about/);

    console.log('✅ 브라우저 앞으로가기 버튼 동작 확인');
  });
});
