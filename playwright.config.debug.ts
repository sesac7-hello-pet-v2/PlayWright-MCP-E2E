import {defineConfig} from '@playwright/test';
import devConfig from './playwright.config.dev';

/**
 * 🐛 디버그용 Playwright 설정
 * dev 설정을 기반으로 디버그 기능만 추가
 */
export default defineConfig({
  ...devConfig,

  // 🎯 디버그 전용 설정 오버라이드
  use: {
    ...devConfig.use,

    // 📸 디버그 시 모든 정보 수집
    trace: 'on',          // 모든 테스트에서 trace 생성
    screenshot: 'on',     // 모든 단계에서 스크린샷
    video: 'on',          // 모든 테스트에서 비디오 저장

    // 🔧 디버그 전용 브라우저 설정
    launchOptions: {
      ...devConfig.use?.launchOptions,
      slowMo: 1000,       // dev보다 더 느리게 (1초)
      args: [
        '--auto-open-devtools-for-tabs', // 개발자 도구 자동 열기 (새로운 방식)
        '--disable-web-security',   // CORS 제한 해제
        '--disable-features=TranslateUI' // 번역 팝업 비활성화
      ]
    }
  },
});
