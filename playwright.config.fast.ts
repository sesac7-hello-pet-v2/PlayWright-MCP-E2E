import {defineConfig} from '@playwright/test';
import {baseConfig} from './playwright.config.base';

/**
 * ⚡ 빠른 테스트용 Playwright 설정
 * 속도 최우선 - 디버깅 기능 최소화
 */
export default defineConfig({
  ...baseConfig,

  // 🔄 병렬 실행 설정 (빠른 테스트)
  fullyParallel: true,              // 병렬 실행 활성화
  workers: 5,                       // 4개 워커로 병렬 처리

  // 🔁 재시도 설정 (빠른 테스트)
  retries: 0,                       // 재시도 없음 (빠른 실행)

  // ⏱️ 타임아웃 설정 (빠른 테스트)
  timeout: 30 * 1000,               // 30초 - 적절한 타임아웃

  // 📊 리포터 설정 (빠른 테스트)
  reporter: [
    ['line'],                       // 간단한 콘솔 출력만
  ],

  // 🎯 빠른 테스트 전용 설정
  use: {
    ...baseConfig.use,

    // 🔍 빠른 실행 설정
    headless: true,                 // 헤드리스 모드 (빠름)

    // 📸 미디어 수집 설정 (빠른 테스트)
    screenshot: 'only-on-failure',  // 실패시만
    video: 'off',                   // 비디오 저장 안함 (속도 향상)
    trace: 'off',                   // trace 수집 안함 (속도 향상)

    // ⏱️ 액션 타임아웃 (빠른 테스트)
    actionTimeout: 10 * 1000,       // 10초 - 적절한 액션 타임아웃
    navigationTimeout: 20 * 1000,   // 20초 - 적절한 네비게이션

    // 🔧 속도 최적화 설정
    launchOptions: {
      // slowMo 제거 - 지연 없음
      args: [
        '--disable-web-security',   // CORS 제한 해제
        '--disable-features=TranslateUI', // 번역 팝업 비활성화
        '--disable-background-networking', // 백그라운드 네트워킹 비활성화
        '--disable-background-timer-throttling', // 백그라운드 타이머 제한 해제
        '--disable-renderer-backgrounding', // 렌더러 백그라운딩 비활성화
        '--disable-backgrounding-occluded-windows', // 가려진 창 백그라운딩 비활성화
        '--disable-client-side-phishing-detection', // 피싱 감지 비활성화
        '--disable-default-apps', // 기본 앱 비활성화
        '--disable-dev-shm-usage', // 메모리 최적화
        '--disable-extensions', // 확장 프로그램 비활성화
        '--no-first-run', // 첫 실행 설정 건너뛰기
        '--no-sandbox', // 샌드박스 비활성화 (속도 향상)
        '--disable-setuid-sandbox',
      ]
    }
  },
});
