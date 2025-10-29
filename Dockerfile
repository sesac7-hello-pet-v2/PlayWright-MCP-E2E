# E2E 테스트용 최적화된 Docker 이미지
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# 한국 시간대 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일들을 먼저 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# Playwright 브라우저 설치 (이미 베이스 이미지에 포함됨)
# RUN npx playwright install --with-deps chromium

# 테스트 파일들 복사
COPY . .

# 테스트 결과 디렉토리 생성
RUN mkdir -p test-results playwright-report

# 기본 명령어
CMD ["npm", "run", "test:ci"]