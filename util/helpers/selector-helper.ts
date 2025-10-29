/**
 * 셀렉터 헬퍼 클래스
 * 플렉시블 셀렉터 생성 및 관리
 */
export class SelectorHelper {
  /**
   * 여러 셀렉터를 결합하여 플렉시블 셀렉터 생성
   */
  static createFlexibleSelector(selectors: string[]): string {
    return selectors.join(', ');
  }

  /**
   * 네비게이션 관련 셀렉터
   */
  static getNavigationSelectors() {
    return {
      // 메인 로고
      logo: this.createFlexibleSelector([
        'a[href="/"] img[alt="Home Logo"]',
        '.logo',
        '[data-testid="logo"]',
        'img[alt*="Hello Pet"]'
      ]),

      // 메인 메뉴 링크들
      aboutLink: this.createFlexibleSelector([
        'nav a[href="/about"]',
        'header a[href="/about"]',
        '.navigation a[href="/about"]',
        '[data-testid="about-link"]'
      ]),

      announcementsLink: this.createFlexibleSelector([
        'nav a[href="/announcements"]',
        'header a[href="/announcements"]',
        '.navigation a[href="/announcements"]',
        '[data-testid="announcements-link"]'
      ]),

      feedLink: this.createFlexibleSelector([
        'nav a[href="/feed"]',
        'header a[href="/feed"]',
        '.navigation a[href="/feed"]',
        '[data-testid="feed-link"]'
      ]),

      noticesLink: this.createFlexibleSelector([
        'nav a[href="/notices"]',
        'header a[href="/notices"]',
        '.navigation a[href="/notices"]',
        '[data-testid="notices-link"]'
      ]),

      // 로그인 버튼
      loginButton: this.createFlexibleSelector([
        'a[href="/auth/login"]',
        'button:has-text("로그인")',
        '.login-button',
        '[data-testid="login-button"]'
      ]),

      // 프로필 드롭다운
      profileButton: this.createFlexibleSelector([
        'img[alt="Profile"]',
        '.profile-image',
        '[data-testid="profile-button"]',
        'button:has(img[alt="Profile"])'
      ]),

      // 프로필 드롭다운 메뉴
      profileDropdown: this.createFlexibleSelector([
        '.profile-dropdown',
        '[data-testid="profile-dropdown"]',
        '.dropdown-menu'
      ]),

      // 마이페이지 링크
      myPageLink: this.createFlexibleSelector([
        'a[href="/me"]',
        'a:has-text("마이페이지")',
        '[data-testid="my-page-link"]'
      ]),

      // 로그아웃 버튼
      logoutButton: this.createFlexibleSelector([
        'button:has-text("로그아웃")',
        '.logout-button',
        '[data-testid="logout-button"]'
      ])
    };
  }

  /**
   * 피드 네비게이션 관련 셀렉터
   */
  static getFeedNavigationSelectors() {
    return {
      // 피드 사이드바
      feedSidebar: this.createFlexibleSelector([
        '.feed-navigation',
        '[data-testid="feed-navigation"]',
        '.sidebar'
      ]),

      // 모든 게시글 버튼
      allPostsButton: this.createFlexibleSelector([
        'button:has-text("모든 게시글")',
        'a[href="/feed"]',
        '[data-testid="all-posts-nav"]'
      ]),

      // 내 게시글 버튼
      myPostsButton: this.createFlexibleSelector([
        'button:has-text("내 게시글")',
        '[data-testid="my-posts-nav"]',
        '.my-posts-button'
      ])
    };
  }

  /**
   * 인증 폼 관련 셀렉터
   */
  static getAuthFormSelectors() {
    return {
      // 로그인 폼
      loginForm: this.createFlexibleSelector([
        'form:has(input[type="email"], input[name="email"])',
        '.login-form',
        '[data-testid="login-form"]'
      ]),

      // 이메일 입력
      emailInput: this.createFlexibleSelector([
        'input[type="email"]',
        'input[name="email"]',
        'input[placeholder*="이메일"]',
        'input[placeholder*="email"]',
        '#email'
      ]),

      // 패스워드 입력
      passwordInput: this.createFlexibleSelector([
        'input[type="password"]',
        'input[name="password"]',
        'input[placeholder*="패스워드"]',
        'input[placeholder*="password"]',
        '#password'
      ]),

      // 로그인 제출 버튼
      loginSubmitButton: this.createFlexibleSelector([
        'button[type="submit"]',
        'button:has-text("로그인")',
        'button:has-text("Login")',
        'input[type="submit"]',
        '.login-submit-button'
      ])
    };
  }

  /**
   * 피드 게시글 관련 셀렉터
   */
  static getFeedPostSelectors() {
    return {
      // 게시글 생성 버튼
      createPostButton: this.createFlexibleSelector([
        'button:has-text("새 게시물")',
        'button:has-text("게시글 작성")',
        '.create-post-button',
        '[data-testid="create-post"]',
        'a[href="/feed/create"]'
      ]),

      // 피드 게시글
      feedPost: this.createFlexibleSelector([
        '.feed-post',
        '.post-card',
        '[data-testid="feed-post"]',
        'article:has(.post-content)',
        '.post-item'
      ]),

      // 좋아요 버튼
      likeButton: this.createFlexibleSelector([
        'button:has(svg[stroke="currentColor"]):has(path[d*="M4.318 6.318"])',
        'button:has-text("좋아요")',
        '.like-button',
        '[data-testid="like-button"]',
        '[aria-label*="좋아요"]'
      ]),

      // 댓글 버튼
      commentButton: this.createFlexibleSelector([
        'button:has-text("댓글")',
        '.comment-button',
        '[data-testid="comment-button"]',
        '[aria-label*="댓글"]'
      ])
    };
  }

  /**
   * 에러 페이지 관련 셀렉터
   */
  static getErrorPageSelectors() {
    return {
      // 401 에러 페이지
      error401: this.createFlexibleSelector([
        'h1:has-text("401")',
        '.error-401',
        '[data-testid="error-401"]',
        'text="권한이 없습니다"'
      ]),

      // 403 에러 페이지
      error403: this.createFlexibleSelector([
        'h1:has-text("403")',
        '.error-403',
        '[data-testid="error-403"]',
        'text="접근이 금지되었습니다"'
      ]),

      // 404 에러 페이지
      error404: this.createFlexibleSelector([
        'h1:has-text("404")',
        '.error-404',
        '[data-testid="error-404"]',
        'text="페이지를 찾을 수 없습니다"'
      ])
    };
  }

  /**
   * 로딩 상태 관련 셀렉터
   */
  static getLoadingSelectors() {
    return {
      // 로딩 스피너
      loadingSpinner: this.createFlexibleSelector([
        '.loading',
        '.spinner',
        '[data-testid="loading"]',
        '.loading-overlay',
        '.loading-indicator'
      ]),

      // 스켈레톤 로더
      skeleton: this.createFlexibleSelector([
        '.skeleton',
        '.skeleton-loader',
        '[data-testid="skeleton"]',
        '.loading-skeleton'
      ])
    };
  }

  /**
   * 알림/모달 관련 셀렉터
   */
  static getModalSelectors() {
    return {
      // 모달 오버레이
      modalOverlay: this.createFlexibleSelector([
        '.modal-overlay',
        '.modal-backdrop',
        '[data-testid="modal-overlay"]'
      ]),

      // 모달 컨텐츠
      modalContent: this.createFlexibleSelector([
        '.modal-content',
        '.modal-body',
        '[data-testid="modal-content"]'
      ]),

      // 모달 닫기 버튼
      modalCloseButton: this.createFlexibleSelector([
        '.modal-close',
        'button[aria-label="Close"]',
        '[data-testid="modal-close"]',
        'button:has-text("×")'
      ]),

      // 성공 알림
      successAlert: this.createFlexibleSelector([
        '.alert-success',
        '.success-message',
        '[data-testid="success-alert"]'
      ]),

      // 에러 알림
      errorAlert: this.createFlexibleSelector([
        '.alert-error',
        '.error-message',
        '[data-testid="error-alert"]'
      ])
    };
  }

  /**
   * 특정 텍스트를 포함한 요소 셀렉터 생성
   */
  static getTextSelector(text: string): string {
    return this.createFlexibleSelector([
      `text="${text}"`,
      `:has-text("${text}")`,
      `[aria-label*="${text}"]`,
      `[title*="${text}"]`
    ]);
  }

  /**
   * 데이터 속성을 포함한 셀렉터 생성
   */
  static getDataTestIdSelector(testId: string): string {
    return `[data-testid="${testId}"]`;
  }

  /**
   * 역할(role) 기반 셀렉터 생성
   */
  static getRoleSelector(role: string, name?: string): string {
    const baseSelector = `[role="${role}"]`;
    return name ? `${baseSelector}[aria-label*="${name}"]` : baseSelector;
  }
}