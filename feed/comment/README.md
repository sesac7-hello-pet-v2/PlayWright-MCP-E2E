# 댓글 기능 테스트 (feed/comment/)

## 📋 목적

게시글의 댓글 작성, 수정, 삭제 및 대댓글 기능을 세밀하게 테스트합니다.

## 🎯 테스트 범위

### 댓글 CRUD

- [ ] 댓글 작성 (로그인 필수)
- [ ] 댓글 목록 조회 (페이지네이션)
- [ ] 댓글 수정 (본인 댓글만)
- [ ] 댓글 삭제 (본인 댓글만)

### 댓글 상호작용

- [ ] 댓글 수 실시간 업데이트
- [ ] 댓글 작성 후 즉시 표시
- [ ] 댓글 작성자 정보 표시
- [ ] 댓글 시간 표시

### UI/UX

- [ ] 댓글 입력창 포커스
- [ ] 빈 댓글 입력 방지
- [ ] 댓글 길이 제한
- [ ] 로딩 상태 표시

## 📁 파일 구조 (예정)

```
comment/
├── README.md                    # 이 파일
├── comment-crud.spec.ts        # 댓글 CRUD 기본 기능
├── comment-ui.spec.ts          # 댓글 UI/UX 테스트
├── comment-validation.spec.ts   # 댓글 유효성 검사
├── comment-pagination.spec.ts   # 댓글 페이지네이션
└── helpers/
    ├── comment-helper.ts       # 댓글 관련 헬퍼
    └── comment-data.ts         # 테스트 댓글 데이터
```

## 🧪 핵심 테스트 시나리오

### 기본 댓글 작성 플로우

1. 게시글 상세 모달 열기
2. 댓글 입력창에 텍스트 입력
3. 엔터 키 또는 "게시" 버튼 클릭
4. 댓글이 즉시 목록에 추가됨
5. 댓글 수 카운터 업데이트 확인

### 댓글 상호작용 테스트

1. 다른 사용자가 댓글 작성
2. 실시간으로 댓글 수 업데이트 확인
3. 새로고침 후에도 댓글 유지 확인
4. 본인 댓글만 수정/삭제 버튼 표시

### 댓글 페이지네이션

1. 20개 이상의 댓글이 있는 게시글
2. 초기 20개 댓글 로드 확인
3. "더보기" 또는 무한 스크롤로 추가 로드
4. 새 댓글 작성 시 최상단에 표시

## 🔧 헬퍼 함수 (예정)

### `comment-helper.ts`

```typescript
export class CommentHelper {
  async addComment(postId: string, content: string): Promise<void>
  async editComment(commentId: string, content: string): Promise<void>
  async deleteComment(commentId: string): Promise<void>
  async getCommentCount(postId: string): Promise<number>
  async loadMoreComments(): Promise<void>
  async verifyCommentVisible(content: string): Promise<boolean>
}
```

## 📊 우선순위

### P0 (최우선) - 1주차

- 기본 댓글 작성/조회
- 댓글 수 업데이트
- 로그인 필수 확인

### P1 (중요) - 2주차

- 댓글 수정/삭제
- 본인 댓글만 편집 가능
- 실시간 업데이트

### P2 (보완) - 3주차

- 댓글 페이지네이션
- 댓글 유효성 검사
- 에러 처리

## 🎨 레거시 코드 기반 셀렉터

### 댓글 입력창

```typescript
// CommentForm 컴포넌트 기반
const commentInput = page.locator([
  'textarea[placeholder*="댓글"]',
  '.comment-input',
  'input[type="text"][placeholder*="댓글"]',
  '[data-testid="comment-input"]'
].join(', '));
```

### 댓글 목록

```typescript
// CommentList 컴포넌트 기반
const commentList = page.locator([
  '.comment-list',
  '[data-testid="comment-list"]',
  '.comments-container'
].join(', '));
```

### 댓글 수 표시

```typescript
// PostActions 컴포넌트의 댓글 수
const commentCount = page.locator([
  'text=댓글',
  '.comment-count',
  '[data-testid="comment-count"]'
].join(', '));
```

## 🚀 실행 방법

```bash
# 댓글 테스트만 실행
cd test && npx playwright test feed/comment/ --headed

# 특정 댓글 기능 테스트
cd test && npx playwright test feed/comment/comment-crud.spec.ts --debug

# 댓글 UI 테스트
cd test && npx playwright test feed/comment/comment-ui.spec.ts
```

## 🔍 레거시 코드 분석 결과

### 관련 컴포넌트

- `CommentList.tsx`: 댓글 목록 렌더링
- `CommentForm.tsx`: 댓글 작성 폼
- `CommentItem.tsx`: 개별 댓글 컴포넌트
- `PostDetailModal.tsx`: 댓글이 표시되는 모달

### API 엔드포인트 (예상)

- `GET /posts/:id/comments`: 댓글 목록 조회
- `POST /posts/:id/comments`: 댓글 작성
- `PUT /comments/:id`: 댓글 수정
- `DELETE /comments/:id`: 댓글 삭제

### 주요 기능

- **페이지네이션**: 20개씩 로드
- **실시간 업데이트**: 새 댓글 즉시 표시
- **권한 관리**: 본인 댓글만 수정/삭제
- **유효성 검사**: 빈 댓글 방지

## 🧪 특별 고려사항

### 모달 내 댓글 테스트

```typescript
// 게시글 상세 모달이 열린 상태에서 댓글 테스트
test('모달 내 댓글 작성', async ({ page }) => {
  // 1. 게시글 클릭으로 모달 열기
  await page.click('.feed-post');

  // 2. 모달이 열렸는지 확인
  await expect(page.locator('.modal')).toBeVisible();

  // 3. 댓글 작성
  await page.fill('textarea[placeholder*="댓글"]', '테스트 댓글');
  await page.press('textarea[placeholder*="댓글"]', 'Enter');

  // 4. 댓글이 목록에 표시되는지 확인
  await expect(page.locator('text=테스트 댓글')).toBeVisible();
});
```

### 댓글 포커스 처리

```typescript
// focusComment prop을 통한 자동 포커스
test('댓글 버튼 클릭 시 입력창 포커스', async ({ page }) => {
  // 댓글 버튼 클릭
  await page.click('button:has-text("댓글")');

  // 댓글 입력창이 자동으로 포커스되는지 확인
  await expect(page.locator('textarea[placeholder*="댓글"]')).toBeFocused();
});
```

## 🔍 현재 이슈 및 개선 계획

### 알려진 이슈

- [ ] 댓글 작성 후 스크롤 위치 관리
- [ ] 댓글 수정 시 UI 상태 관리
- [ ] 긴 댓글 텍스트 표시 방식

### 개선 로드맵

1. **1주차**: 기본 댓글 CRUD 테스트 구현
2. **2주차**: 모달 내 댓글 상호작용 테스트
3. **3주차**: 댓글 페이지네이션 및 성능 테스트
4. **4주차**: 댓글 관련 에러 처리 및 엣지 케이스

---

**목표**: 댓글 기능이 사용자 기대에 맞게 직관적이고 안정적으로 동작함을 보장
