import {defineConfig} from '@playwright/test';
import {baseConfig} from './playwright.config.base';

/**
 * 🏭 CI 환경용 Playwright 설정
 * 안정성과 성능을 우선시한 설정
 */
export default defineConfig({
  ...baseConfig,

  // 🔄 병렬 실행 설정 (CI환경) - 제한적 병렬 실행
  fullyParallel: true,              // 병렬 실행으로 속도 향상
  workers: 2,                       // 2개 워커로 적당한 균형 (안정성 vs 속도)

  // 🔁 재시도 설정 (CI환경)
  retries: 2,                       // 네트워크 불안정성 대응 2회 재시도

  // ⏱️ 타임아웃 설정 (CI환경)
  timeout: 30 * 1000,               // 30초 - 빠른 피드백

  // 📊 리포터 설정 (CI환경)
  reporter: [
    ['github'],                     // GitHub Actions 통합
    ['json', {outputFile: 'test-results/results.json'}], // CI 데이터 처리용
    ['junit', {outputFile: 'test-results/junit.xml'}],   // Jenkins/Azure DevOps용
    ['html', {
      open: 'never',               // CI에서 자동으로 열지 않음
      outputFolder: 'playwright-report'  // GitHub Pages 배포용 경로
    }],
  ],

  // 📁 출력 디렉토리
  outputDir: 'test-results/artifacts', // CI 아티팩트 저장

  // 🎯 CI환경 전용 설정
  use: {
    ...baseConfig.use,

    // 🔍 CI 실행 설정
    headless: true,                 // 헤드리스 모드 (서버 리소스 절약)

    // 📸 미디어 수집 설정 (CI환경)
    screenshot: 'only-on-failure',  // 실패 시만 스크린샷 (디스크 절약)
    video: 'retain-on-failure',     // 실패 시만 비디오 저장
    trace: 'on-first-retry',        // 재시도 시에만 trace 수집

    // ⏱️ 액션 타임아웃 (CI환경)
    actionTimeout: 10 * 1000,       // 10초 - 빠른 실패 감지
    navigationTimeout: 20 * 1000,   // 20초 - CI 환경 고려

    // 🔧 CI 최적화 설정
    launchOptions: {
      args: [
        '--no-sandbox',             // CI 환경 권한 문제 해결
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',  // 메모리 최적화
        '--disable-gpu',            // GPU 가속 비활성화
        '--disable-web-security',   // CORS 제한 해제
        '--disable-features=TranslateUI,VizDisplayCompositor' // 불필요한 기능 비활성화
      ]
    }
  },

  // 🚨 CI 전용 추가 설정
  maxFailures: 5,                   // 5개 실패 시 조기 종료 (리소스 절약)
  globalTimeout: 15 * 60 * 1000,    // 전체 테스트 15분 제한
});
