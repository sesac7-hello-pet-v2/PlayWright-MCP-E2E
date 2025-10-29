# 🐾 Hello Pet E2E Test Reports

이 디렉토리는 자동화된 E2E 테스트 리포트가 저장되는 곳입니다.

## 📊 테스트 리포트 확인하기

GitHub Actions에서 E2E 테스트가 실행되면, 결과가 이 디렉토리에 자동으로 업데이트됩니다.

### 📋 리포트 내용

- **index.html**: 메인 대시보드 페이지
- **report.html**: Playwright 생성 상세 테스트 리포트
- **기타 파일들**: 테스트 결과 관련 assets

### 🚀 GitHub Pages 배포

이 폴더의 내용은 GitHub Pages로 자동 배포됩니다.

Repository Settings > Pages > Source를 "Deploy from a branch"로 설정하고, Branch를 "main"의 "/docs" 폴더로 설정하세요.

### 🔄 자동 업데이트

매번 E2E 테스트가 실행될 때마다:

1. 새로운 테스트 결과가 생성됩니다
2. 이 디렉토리의 파일들이 업데이트됩니다
3. GitHub Actions이 자동으로 커밋/푸시합니다
4. GitHub Pages가 자동으로 배포됩니다

---

🤖 이 파일은 자동으로 관리됩니다.