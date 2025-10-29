import {defineConfig} from '@playwright/test';
import {baseConfig} from './playwright.config.base';

/**
 * 🚀 개발 환경용 Playwright 설정
 * 디버깅과 개발 편의성을 우선시한 설정
 */
export default defineConfig({
  ...baseConfig,

  // 🔄 병렬 실행 설정 (개발환경)
  fullyParallel: false,             // 순차 실행으로 디버깅 용이
  workers: 1,                       // 1개 워커로 안정성 확보

  // 🔁 재시도 설정 (개발환경)
  retries: 0,                       // 개발 시 재시도 없음 (즉시 피드백)

  // ⏱️ 타임아웃 설정 (개발환경)
  timeout: 60 * 1000,               // 60초 - 디버깅 시간 확보

  // 📊 리포터 설정 (개발환경)
  reporter: [
    ['html', {open: 'on-failure'}], // 실패 시 HTML 리포트 자동 열기
    ['line'],                        // 실시간 콘솔 출력
  ],

  // 🎯 개발환경 전용 설정
  use: {
    ...baseConfig.use,

    // 🔍 디버깅 설정 (개발환경)
    headless: false,                // 브라우저 화면 표시

    // 📸 미디어 수집 설정 (개발환경)
    screenshot: 'only-on-failure',  // 실패 시만 스크린샷
    video: 'retain-on-failure',     // 실패 시만 비디오 저장
    trace: 'retain-on-failure',     // 실패 시만 trace 수집

    // ⏱️ 액션 타임아웃 (개발환경)
    actionTimeout: 15 * 1000,       // 15초 - 넉넉한 액션 타임아웃
    navigationTimeout: 30 * 1000,   // 30초 - SSR 렌더링 고려

    // 🔧 개발 편의 설정
    launchOptions: {
      slowMo: 300,                  // 액션 간 300ms 지연 (디버깅 용이)
    }
  },
});
