/**
 * 🎯 Playwright 메인 설정 파일
 * 환경변수에 따라 적절한 설정을 자동으로 선택
 */

// 환경별 설정 파일 import
import {baseConfig} from './playwright.config.base';
import devConfig from './playwright.config.dev';
import debugConfig from './playwright.config.debug';
import ciConfig from './playwright.config.ci';

/**
 * 환경변수에 따라 적절한 설정을 반환
 * - PLAYWRIGHT_ENV=ci: CI 환경용 설정
 * - PLAYWRIGHT_ENV=dev: 개발 환경용 설정 (헤드 모드)
 * - PLAYWRIGHT_ENV=debug: 디버그 환경용 설정 (상세 로깅)
 * - process.env.CI: CI 환경 자동 감지
 * - 기본값: base 설정 (헤드리스 모드)
 */
const getConfig = () => {
  const playwrightEnv = process.env.PLAYWRIGHT_ENV;

  // PLAYWRIGHT_ENV가 명시적으로 설정된 경우
  if (playwrightEnv) {
    switch (playwrightEnv) {
      case 'ci':
        console.log('🏭 CI 환경용 설정 로드');
        return ciConfig;
      case 'dev':
        console.log('🚀 개발 환경용 설정 로드 (헤드 모드)');
        return devConfig;
      case 'debug':
        console.log('🐛 디버그 환경용 설정 로드 (상세 로깅)');
        return debugConfig;
      default:
        console.log('🔧 기본 설정 로드 (헤드리스 모드)');
        return baseConfig;
    }
  }

  // CI 환경 자동 감지
  if (process.env.CI) {
    console.log('🏭 CI 환경 자동 감지 - CI 설정 로드');
    return ciConfig;
  }

  // 기본값
  console.log('🔧 기본 설정 로드 (헤드리스 모드)');
  return baseConfig;
};

export default getConfig();
