/**
 * 테스트용 사용자 계정 정보
 */

export interface TestAccount {
  email: string;
  password: string;
  nickname?: string;
  description?: string;
}

/**
 * 테스트 계정 데이터
 * README.md의 계획된 구조에 따른 명명
 */
export const TEST_ACCOUNTS = {
  // 주요 테스트 계정 (가장 많이 사용)
  primary: {
    email: 'test@test.test',
    password: 'test123!@#',
    nickname: '테스트유저1',
    description: '주요 테스트 계정'
  },

  // 보조 테스트 계정 (다중 사용자 테스트용)
  secondary: {
    email: 'test1@test.com',
    password: '!test123',
    nickname: '테스트유저2',
    description: '보조 테스트 계정'
  },

  // 추가 테스트 계정들
  test2: {
    email: 'test2@test.com',
    password: '!test123',
    nickname: '테스트유저3',
    description: '테스트 계정 3번'
  },

  test3: {
    email: 'test3@test.com',
    password: '!test123',
    nickname: '테스트유저4',
    description: '테스트 계정 4번'
  }
} as const;

/**
 * 기본 테스트 사용자 (가장 많이 사용될 계정)
 */
export const DEFAULT_TEST_ACCOUNT = TEST_ACCOUNTS.primary;

/**
 * 보조 테스트 사용자 (다중 사용자 테스트용)
 */
export const SECONDARY_TEST_ACCOUNT = TEST_ACCOUNTS.secondary;

/**
 * 계정 타입별 반환
 */
export function getTestAccount(type: keyof typeof TEST_ACCOUNTS): TestAccount {
  return TEST_ACCOUNTS[type];
}

/**
 * 랜덤 테스트 계정 선택
 */
export function getRandomTestAccount(): TestAccount {
  const accounts = Object.values(TEST_ACCOUNTS);
  return accounts[Math.floor(Math.random() * accounts.length)];
}

/**
 * 모든 테스트 계정 목록
 */
export function getAllTestAccounts(): TestAccount[] {
  return Object.values(TEST_ACCOUNTS);
}