# 🚀 E2E 테스트 자동화 및 GitHub Pages 배포 가이드

이 가이드는 Hello Pet v2 프로젝트의 E2E 테스트를 GitHub Actions로 자동화하고, 테스트 결과를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 설정 완료 항목

✅ GitHub Actions 워크플로우 (`/.github/workflows/e2e-test.yml`)
✅ Playwright CI 설정 (`/test/playwright.config.ci.ts`)
✅ 자동 HTML 리포트 생성
✅ GitHub Pages 배포 설정

## 🔧 GitHub 리포지토리 설정 필요 사항

### 1. GitHub Pages 활성화

1. **GitHub 리포지토리 → Settings → Pages**
2. **Source**: "GitHub Actions" 선택
3. **Save** 클릭

### 2. Actions 권한 설정 (필요시)

1. **GitHub 리포지토리 → Settings → Actions → General**
2. **Workflow permissions**: "Read and write permissions" 선택
3. **Allow GitHub Actions to create and approve pull requests** 체크
4. **Save** 클릭

## 🎯 자동화 플로우

### 트리거 조건

- `main` 브랜치에 push
- `main` 브랜치로 PR 생성
- 수동 실행 (GitHub Actions 탭에서)

### 실행 단계

1. **환경 준비**: Node.js 20, Playwright 브라우저 설치
2. **서버 시작**: Next.js 프로덕션 빌드 및 서버 실행
3. **테스트 실행**: `npm run test:ci`로 전체 E2E 테스트 실행
4. **결과 수집**: HTML 리포트, 스크린샷, 실패 아티팩트 저장
5. **배포**: GitHub Pages에 테스트 리포트 자동 배포

## 📊 테스트 리포트 확인

### 배포 후 접근 경로

- **메인 페이지**: `https://{username}.github.io/{repository-name}/`
- **상세 리포트**: `https://{username}.github.io/{repository-name}/playwright-report/`

### 리포트 내용

- 테스트 실행 결과 요약
- 개별 테스트별 상세 정보
- 실패 시 스크린샷 및 오류 정보
- 실행 시간 및 성능 메트릭

## 🎨 리포트 페이지 구성

### 메인 페이지 (`index.html`)

- 프로젝트 개요 및 테스트 정보
- Playwright 리포트 링크
- 마지막 업데이트 시간

### Playwright 리포트

- 인터랙티브 HTML 리포트
- 테스트별 상세 실행 정보
- 실패 원인 분석 및 디버깅 정보

## ⚙️ 설정 커스터마이징

### 테스트 실행 환경 수정

```yaml
# .github/workflows/e2e-test.yml 에서 수정 가능
- name: 🧪 Run E2E tests
  working-directory: ./test
  run: npm run test:ci  # 다른 스크립트로 변경 가능
```

### 브라우저 변경

```typescript
// playwright.config.ci.ts 에서 수정
projects: [
  {name: 'chromium', use: {...devices['Desktop Chrome']}},
  // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
]
```

### 리포트 스타일 수정

`index.html` 템플릿은 워크플로우 파일 내부에 있으며, 필요시 수정 가능합니다.

## 🚨 문제 해결

### 일반적인 문제

1. **GitHub Pages 404 오류**: Settings → Pages에서 소스가 "GitHub Actions"로 설정되었는지 확인
2. **권한 오류**: Actions 권한이 "Read and write"로 설정되었는지 확인
3. **서버 시작 실패**: 프론트엔드 빌드 오류 시 로그 확인

### 디버깅 방법

- GitHub Actions 탭에서 실행 로그 확인
- 실패한 테스트의 아티팩트 다운로드
- 로컬에서 `npm run test:ci` 실행하여 재현

## 📈 확장 가능성

### 추가 가능한 기능

- **Slack/Discord 알림**: 테스트 실패 시 자동 알림
- **성능 모니터링**: Lighthouse 점수 추적
- **크로스 브라우저 테스트**: Firefox, Safari 추가
- **시각적 회귀 테스트**: 스크린샷 비교
- **API 테스트**: REST API 엔드포인트 테스트

이제 `main` 브랜치에 push하면 자동으로 E2E 테스트가 실행되고, 결과가 GitHub Pages에 호스팅됩니다! 🎉
