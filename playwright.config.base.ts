import {defineConfig, devices} from '@playwright/test';

/**
 * 🔧 Playwright 기본 설정
 * 개발환경과 CI환경에서 공통으로 사용할 설정
 */
export const baseConfig = defineConfig({
  // 📁 테스트 파일 설정
  testDir: './',                    // 현재 폴더를 테스트 디렉토리로 설정
  testIgnore: '**/node_modules/**', // node_modules 폴더 무시

  // 🚫 CI 환경 제한
  forbidOnly: !!process.env.CI,    // CI에서 test.only 사용 금지

  // 🎯 공통 실행 환경 설정
  use: {
    // 🌐 기본 URL 설정
    baseURL: 'https://hello-pet.my', // Hello Pet 배포 환경 URL

    // 🖥️ 브라우저 뷰포트 설정
    viewport: {width: 1280, height: 720}, // 데스크톱 표준 해상도

    // 🌍 지역화 설정
    locale: 'ko-KR',                // 한국어 설정
    timezoneId: 'Asia/Seoul',       // 한국 시간대
  },

  // 🌐 브라우저 프로젝트 설정
  projects: [
    {
      name: 'chromium',             // 기본 Chromium 브라우저
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'Google Chrome',        // 실제 Chrome 브라우저 (더 실제 환경과 유사)
      use: {...devices['Desktop Chrome'], channel: 'chrome'},
    }
  ],
});
