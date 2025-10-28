# 인증 테스트 (auth/)

## 📋 목적

사용자 로그인/로그아웃 및 인증 관련 기능을 테스트합니다.

## 🎯 테스트 범위

### 핵심 기능

- [ ] 로그인 플로우 (`test@test.test` / `test123!@#`)
- [ ] 로그아웃 기능
- [ ] 인증 상태 유지 (새로고침 후)
- [ ] 비로그인 상태에서 보호된 페이지 접근
- [ ] 토큰 만료 처리

### 에러 케이스

- [ ] 잘못된 이메일/비밀번호
- [ ] 빈 입력값 처리
- [ ] 네트워크 오류 시 처리
- [ ] 서버 응답 지연 처리

## 📁 파일 구조 (예정)

```
auth/
├── README.md                    # 이 파일
├── login.spec.ts               # 로그인 기본 기능
├── logout.spec.ts              # 로그아웃 기능
├── auth-state.spec.ts          # 인증 상태 관리
├── auth-errors.spec.ts         # 인증 에러 처리
└── helpers/
    ├── auth-helper.ts          # 로그인/로그아웃 헬퍼
    └── auth-data.ts            # 테스트 계정 데이터
```

## 🧪 테스트 시나리오

### 기본 로그인 플로우

1. `/auth/login` 페이지 접근
2. 이메일/비밀번호 입력
3. 로그인 버튼 클릭
4. 메인 페이지로 리다이렉트 확인
5. 로그인 상태 UI 확인

### 인증 보호 확인

1. 비로그인 상태에서 `/feed` 접근
2. 로그인 페이지로 리다이렉트 확인
3. 로그인 후 원래 페이지로 복귀

### 세션 관리

1. 로그인 후 새로고침
2. 로그인 상태 유지 확인
3. 일정 시간 후 토큰 만료 처리

## 🔧 헬퍼 함수 (예정)

### `auth-helper.ts`

```typescript
export class AuthHelper {
  async login(email: string, password: string): Promise<void>
  async logout(): Promise<void>
  async isLoggedIn(): Promise<boolean>
  async waitForLogin(): Promise<void>
  async clearAuthState(): Promise<void>
}
```

## 📊 우선순위

### P0 (최우선)

- 기본 로그인/로그아웃 플로우
- 인증 상태 확인

### P1 (중요)

- 에러 처리 (잘못된 인증정보)
- 세션 유지 확인

### P2 (보완)

- 토큰 만료 처리
- 다중 디바이스 로그인

## 🚀 실행 방법

```bash
# 인증 테스트만 실행
cd test && npx playwright test auth/ --headed

# 특정 테스트 실행
cd test && npx playwright test auth/login.spec.ts --debug

# 모든 브라우저에서 테스트
cd test && npx playwright test auth/ --project=chromium --project=firefox
```

## 🔍 현재 이슈

### 알려진 문제

- [ ] 테스트 계정 설정 필요
- [ ] 로그인 페이지 URL 확인 필요
- [ ] 인증 토큰 저장 방식 파악 필요

### 개선 계획

1. **1주차**: 기본 로그인/로그아웃 테스트 구현
2. **2주차**: 에러 처리 및 세션 관리 테스트
3. **3주차**: 성능 및 보안 테스트 추가

---

**목표**: 안정적이고 신뢰할 수 있는 인증 시스템 검증
