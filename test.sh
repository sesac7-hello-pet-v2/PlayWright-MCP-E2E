#!/bin/bash

# 🎯 Hello Pet E2E Test Runner
# 계층적 인터랙티브 테스트 실행

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 전역 변수
test_mode="fast"  # 기본값: fast

# 헤더 출력
show_header() {
    clear
    echo -e "${PURPLE}🐾 Hello Pet E2E Test Runner${NC}"
    echo "=================================="
    echo -e "${CYAN}현재 모드: ${test_mode}${NC}"
    echo ""
}

# 테스트 실행 함수
run_test() {
    local test_name=$1
    local test_command=$2

    echo ""
    echo -e "${GREEN}🚀 ${test_name} 실행 중...${NC}"
    echo -e "${YELLOW}명령어: ${test_command}${NC}"
    echo ""

    eval $test_command

    echo ""
    echo -e "${GREEN}✅ 테스트 완료!${NC}"
    echo ""
    read -p "아무 키나 눌러 계속하세요..."
}

# 메인 메뉴
main_menu() {
    while true; do
        show_header
        echo -e "${CYAN}테스트 카테고리를 선택하세요:${NC}"
        echo ""
        echo "  1. 전체 테스트"
        echo "  2. 기능 테스트 (예정)"
        echo "  3. 네비게이션 테스트"
        echo "  4. 테스트 옵션 선택"
        echo "  5. 테스트 보고서 보기"
        echo ""
        echo "  0. 종료"
        echo ""

        read -p "숫자를 입력하세요 (0-5): " choice

        case $choice in
            1) all_tests_menu ;;
            2) echo -e "${YELLOW}기능 테스트는 아직 구현되지 않았습니다.${NC}"; sleep 2 ;;
            3) navigation_menu ;;
            4) options_menu ;;
            5) run_test "테스트 보고서 보기" "npm run report" ;;
            0) echo -e "${GREEN}👋 안녕히 가세요!${NC}"; exit 0 ;;
            *) echo -e "${RED}❌ 잘못된 선택입니다.${NC}"; sleep 1 ;;
        esac
    done
}

# 전체 테스트 메뉴
all_tests_menu() {
    while true; do
        show_header
        echo -e "${GREEN}📦 전체 테스트${NC}"
        echo ""
        echo "  1. 전체 테스트 실행"
        echo "  2. UI 모드"
        echo "  3. 브라우저 설치"
        echo "  4. 리포트 보기"
        echo ""
        echo "  0. 뒤로가기"
        echo ""

        read -p "숫자를 입력하세요 (0-4): " choice

        case $choice in
            1) run_test "전체 테스트 (${test_mode})" "npm run test:${test_mode}" ;;
            2) run_test "UI 모드" "npm run test:ui" ;;
            3) run_test "브라우저 설치" "npm run install" ;;
            4) run_test "리포트 보기" "npm run report" ;;
            0) return ;;
            *) echo -e "${RED}❌ 잘못된 선택입니다.${NC}"; sleep 1 ;;
        esac
    done
}

# 네비게이션 테스트 메뉴
navigation_menu() {
    while true; do
        show_header
        echo -e "${BLUE}🧭 네비게이션 테스트${NC}"
        echo ""
        echo "  1. 전체 네비게이션 테스트"
        echo "  2. Phase 1 테스트"
        echo "  3. Phase 2 테스트 (예정)"
        echo "  4. Phase 3 테스트 (예정)"
        echo "  5. Phase 4 테스트 (예정)"
        echo "  6. Phase 5 테스트 (예정)"
        echo ""
        echo "  0. 뒤로가기"
        echo ""

        read -p "숫자를 입력하세요 (0-6): " choice

        case $choice in
            1) run_test "전체 네비게이션 테스트 (${test_mode})" "npm run test:${test_mode}" ;;
            2) phase1_menu ;;
            3|4|5|6) echo -e "${YELLOW}Phase $((choice-1))은 아직 구현되지 않았습니다.${NC}"; sleep 2 ;;
            0) return ;;
            *) echo -e "${RED}❌ 잘못된 선택입니다.${NC}"; sleep 1 ;;
        esac
    done
}

# Phase 1 상세 메뉴
phase1_menu() {
    while true; do
        show_header
        echo -e "${BLUE}🎯 Phase 1: 기본 네비게이션 테스트${NC}"
        echo ""
        echo "  1. Phase 1 전체 테스트"
        echo "  2. 기본 네비게이션만 (basic-navigation.spec.ts)"
        echo ""
        echo "  0. 뒤로가기"
        echo ""

        read -p "숫자를 입력하세요 (0-2): " choice

        case $choice in
            1) run_test "Phase 1 전체 테스트 (${test_mode})" "npm run phase1:${test_mode}" ;;
            2) run_test "기본 네비게이션 테스트 (${test_mode})" "npm run basic:${test_mode}" ;;
            0) return ;;
            *) echo -e "${RED}❌ 잘못된 선택입니다.${NC}"; sleep 1 ;;
        esac
    done
}

# 옵션 메뉴
options_menu() {
    while true; do
        show_header
        echo -e "${PURPLE}⚙️ 테스트 옵션 설정${NC}"
        echo ""
        echo -e "${CYAN}현재 모드: ${test_mode}${NC}"
        echo ""
        echo "  1. fast (빠름, 헤드리스)"
        echo "  2. dev (헤드 모드, 300ms 지연)"
        echo "  3. debug (디버그, 1초 지연, 상세 로깅)"
        echo ""
        echo "  0. 뒤로가기"
        echo ""

        read -p "숫자를 입력하세요 (0-3): " choice

        case $choice in
            1) test_mode="fast"; echo -e "${GREEN}✅ fast 모드로 설정되었습니다.${NC}"; sleep 1 ;;
            2) test_mode="dev"; echo -e "${GREEN}✅ dev 모드로 설정되었습니다.${NC}"; sleep 1 ;;
            3) test_mode="debug"; echo -e "${GREEN}✅ debug 모드로 설정되었습니다.${NC}"; sleep 1 ;;
            0) return ;;
            *) echo -e "${RED}❌ 잘못된 선택입니다.${NC}"; sleep 1 ;;
        esac
    done
}

# 메인 실행
main_menu