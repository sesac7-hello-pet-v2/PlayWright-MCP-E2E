import {expect, Page} from '@playwright/test';
import {TestAccount} from '../data/test-accounts';

/**
 * 인증 관련 헬퍼 클래스
 * 로그인, 로그아웃, 인증 상태 확인 등의 공통 기능 제공
 */
export class AuthHelper {
  /**
   * 로그인 수행
   */
  static async login(page: Page, email: string, password: string): Promise<void> {
    console.log(`🔐 로그인 시도: ${email}`);

    // 로그인 페이지로 이동
    await page.goto('/auth/login');

    // 로그인 폼이 로드될 때까지 대기
    await page.waitForSelector('form', {timeout: 10000});

    // 이메일 입력
    const emailInput = page.locator([
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="이메일"]',
      'input[placeholder*="email"]',
      '#email'
    ].join(', '));
    await emailInput.fill(email);

    // 패스워드 입력
    const passwordInput = page.locator([
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="패스워드"]',
      'input[placeholder*="password"]',
      '#password'
    ].join(', '));
    await passwordInput.fill(password);

    // 로그인 버튼 클릭
    const loginButton = page.locator([
      'button[type="submit"]',
      'button:has-text("로그인")',
      'button:has-text("Login")',
      'input[type="submit"]',
      '.login-button',
      '[data-testid="login-button"]'
    ].join(', '));

    await loginButton.click();

    // 로그인 완료 대기 (리다이렉트 또는 프로필 아이콘 표시)
    await Promise.race([
      // 홈페이지로 리다이렉트 대기
      page.waitForURL('/', {timeout: 15000}),
      // 또는 프로필 이미지 표시 대기
      page.waitForSelector('img[alt="Profile"], .profile-image, [data-testid="profile-image"]', {timeout: 15000})
    ]);

    console.log(`✅ 로그인 성공: ${email}`);
  }

  /**
   * 테스트 계정으로 로그인
   */
  static async loginWithTestAccount(page: Page, account: TestAccount): Promise<void> {
    await this.login(page, account.email, account.password);
  }

  /**
   * 로그아웃 수행
   */
  static async logout(page: Page): Promise<void> {
    console.log('🚪 로그아웃 시도');

    try {
      // 프로필 드롭다운 클릭
      const profileButton = page.locator([
        'img[alt="Profile"]',
        '.profile-image',
        '[data-testid="profile-image"]',
        'button:has(img[alt="Profile"])'
      ].join(', '));

      await profileButton.click();

      // 드롭다운 메뉴가 열릴 때까지 대기
      await page.waitForSelector([
        'button:has-text("로그아웃")',
        'a:has-text("로그아웃")',
        '.logout-button',
        '[data-testid="logout-button"]'
      ].join(', '), {timeout: 5000});

      // 로그아웃 버튼 클릭
      const logoutButton = page.locator([
        'button:has-text("로그아웃")',
        'a:has-text("로그아웃")',
        '.logout-button',
        '[data-testid="logout-button"]'
      ].join(', '));

      await logoutButton.click();

      // 로그아웃 완료 대기 (로그인 버튼 표시)
      await page.waitForSelector([
        'a[href="/auth/login"]',
        'button:has-text("로그인")',
        '.login-button',
        '[data-testid="login-button"]'
      ].join(', '), {timeout: 10000});

      console.log('✅ 로그아웃 성공');
    } catch (error) {
      console.log('⚠️ 로그아웃 중 오류 발생, 강제 로그아웃 시도');

      // 강제 로그아웃: 쿠키 삭제
      await page.context().clearCookies();
      await page.reload();

      console.log('✅ 강제 로그아웃 완료');
    }
  }

  /**
   * 현재 로그인 상태 확인
   */
  static async isLoggedIn(page: Page): Promise<boolean> {
    try {
      // 프로필 이미지가 있으면 로그인 상태
      const profileImage = page.locator([
        'img[alt="Profile"]',
        '.profile-image',
        '[data-testid="profile-image"]'
      ].join(', '));

      await profileImage.waitFor({timeout: 3000});
      return true;
    } catch {
      // 로그인 버튼이 있으면 비로그인 상태
      try {
        const loginButton = page.locator([
          'a[href="/auth/login"]',
          'button:has-text("로그인")',
          '.login-button'
        ].join(', '));

        await loginButton.waitFor({timeout: 3000});
        return false;
      } catch {
        // 확실하지 않은 경우 false 반환
        return false;
      }
    }
  }

  /**
   * 인증 상태 대기 (로그인/로그아웃 완료까지)
   */
  static async waitForAuthState(page: Page, expectedState: 'logged-in' | 'logged-out' = 'logged-in'): Promise<void> {
    const timeout = 10000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const isLoggedIn = await this.isLoggedIn(page);

      if (expectedState === 'logged-in' && isLoggedIn) {
        return;
      }

      if (expectedState === 'logged-out' && !isLoggedIn) {
        return;
      }

      await page.waitForTimeout(500);
    }

    throw new Error(`인증 상태 대기 시간 초과: 예상=${expectedState}`);
  }

  /**
   * 로그인이 필요한 페이지 접근 시 리다이렉트 확인
   */
  static async expectLoginRedirect(page: Page, protectedUrl: string): Promise<void> {
    await page.goto(protectedUrl);

    // 로그인 페이지로 리다이렉트되었는지 확인
    await expect(page).toHaveURL(/.*\/auth\/login/);

    console.log(`✅ 보호된 페이지 ${protectedUrl}에서 로그인 페이지로 리다이렉트 확인`);
  }

  /**
   * 사용자 프로필 정보 확인
   */
  static async verifyUserProfile(page: Page, expectedNickname?: string): Promise<void> {
    // 프로필 드롭다운 열기
    const profileButton = page.locator([
      'img[alt="Profile"]',
      '.profile-image',
      '[data-testid="profile-image"]'
    ].join(', '));

    await profileButton.click();

    if (expectedNickname) {
      // 닉네임 확인
      await expect(page.locator(`text=${expectedNickname}`)).toBeVisible();
      console.log(`✅ 사용자 닉네임 확인: ${expectedNickname}`);
    }

    // 마이페이지 링크 확인
    await expect(page.locator([
      'a:has-text("마이페이지")',
      'a[href="/me"]',
      '[data-testid="my-page-link"]'
    ].join(', '))).toBeVisible();

    // 로그아웃 버튼 확인
    await expect(page.locator([
      'button:has-text("로그아웃")',
      '.logout-button',
      '[data-testid="logout-button"]'
    ].join(', '))).toBeVisible();
  }

  /**
   * 인증 토큰 확인 (localStorage 또는 cookie)
   */
  static async hasValidToken(page: Page): Promise<boolean> {
    try {
      // localStorage에서 토큰 확인
      const token = await page.evaluate(() => {
        return localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      });

      if (token) {
        return true;
      }

      // 쿠키에서 토큰 확인
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie =>
        cookie.name.includes('token') ||
        cookie.name.includes('auth') ||
        cookie.name === 'session'
      );

      return !!authCookie;
    } catch {
      return false;
    }
  }
}
