/**
 * 🎯 Playwright 메인 설정 파일
 * 환경에 따라 적절한 설정을 자동으로 선택
 */

// 환경별 설정 파일 import
import devConfig from './playwright.config.dev';
import ciConfig from './playwright.config.ci';

/**
 * 현재 환경에 따라 적절한 설정을 반환
 * - CI 환경: 안정성과 성능 최적화
 * - 개발 환경: 디버깅과 개발 편의성 우선
 */
const getConfig = () => {
  if (process.env.CI) {
    console.log('🏭 CI 환경용 설정 로드');
    return ciConfig;
  } else {
    console.log('🚀 개발 환경용 설정 로드');
    return devConfig;
  }
};

export default getConfig();
