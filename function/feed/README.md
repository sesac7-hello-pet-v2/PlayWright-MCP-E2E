# 피드 핵심 기능 테스트 (feed/)

## 📋 목적

피드 페이지의 핵심 CRUD 기능과 상호작용 기능을 테스트합니다.

## 🎯 테스트 범위

### 게시글 CRUD

- [ ] 게시글 작성 (텍스트 + 이미지 1-5개)
- [ ] 게시글 조회 (목록, 상세)
- [ ] 게시글 수정 (텍스트만, 이미지 수정 불가)
- [ ] 게시글 삭제 (본인 게시글만)

### 상호작용 기능

- [ ] 좋아요/좋아요 취소
- [ ] 댓글 작성/수정/삭제 (comment/ 폴더 참조)
- [ ] 게시글 상세 모달
- [ ] 무한 스크롤

### UI/UX 기능

- [ ] Optimistic UI (즉시 반영)
- [ ] 로딩 상태 (스켈레톤)
- [ ] 에러 상태 처리
- [ ] 캐시 무효화 (SSR+CSR)

## 📁 파일 구조 (예정)

```
feed/
├── README.md                    # 이 파일
├── comment/                     # 댓글 기능 세부 테스트
│   └── README.md               # 댓글 테스트 가이드
├── feed-crud.spec.ts           # 게시글 CRUD 기본 기능
├── feed-interactions.spec.ts   # 좋아요, 상호작용
├── feed-ui.spec.ts            # UI/UX 관련 테스트
├── feed-performance.spec.ts    # 성능 (SSR+CSR, 캐시)
├── image-upload.spec.ts        # 이미지 업로드 (1-5개)
├── infinite-scroll.spec.ts     # 무한 스크롤
└── helpers/
    ├── feed-helper.ts          # 피드 상호작용 헬퍼
    ├── post-helper.ts          # 게시글 관련 헬퍼
    └── image-helper.ts         # 이미지 업로드 헬퍼
```

## 🧪 핵심 테스트 시나리오

### 게시글 작성 플로우

1. 로그인 상태에서 `/feed` 접근
2. "새 게시물 작성" 버튼 클릭
3. 이미지 드래그앤드롭 (1-5개)
4. 텍스트 내용 입력 (1000자 제한)
5. "공유" 버튼 클릭
6. Optimistic UI로 즉시 피드에 표시
7. 서버 동기화 완료 확인

### 상호작용 플로우

1. 다른 사용자 게시글에 좋아요
2. 좋아요 수 실시간 업데이트 확인
3. 댓글 작성 및 댓글 수 업데이트
4. 게시글 클릭으로 상세 모달 열기
5. 모달에서 추가 댓글 작성

### 성능 및 캐시 테스트

1. 초기 페이지 로드 (SSR 데이터)
2. 무한 스크롤로 추가 데이터 로드 (CSR)
3. 새 게시글 작성 후 캐시 무효화
4. 5초 쿨다운 메커니즘 확인

## 🔧 헬퍼 함수 (예정)

### `feed-helper.ts`

```typescript
export class FeedHelper {
  async createPost(content: string, images?: string[]): Promise<void>
  async likePost(postId: string): Promise<void>
  async addComment(postId: string, comment: string): Promise<void>
  async deletePost(postId: string): Promise<void>
  async scrollToLoadMore(): Promise<void>
  async waitForPendingPost(): Promise<void>
}
```

### `image-helper.ts`

```typescript
export class ImageHelper {
  async selectRandomImages(count: number): Promise<string[]>
  async uploadImages(filePaths: string[]): Promise<void>
  async verifyImagePreview(count: number): Promise<void>
}
```

## 📊 우선순위

### P0 (최우선) - 1주차

- 게시글 작성/조회 기본 플로우
- 이미지 업로드 (1-5개)
- 좋아요 기능

### P1 (중요) - 2주차

- 게시글 수정/삭제
- 댓글 기능 (comment/ 폴더)
- 모달 상호작용

### P2 (보완) - 3주차

- 무한 스크롤
- 성능 테스트 (SSR+CSR)
- 에러 처리

## 🎨 레거시 코드 기반 셀렉터

### 게시글 작성 버튼

```typescript
// 다양한 구현에 대응하는 유연한 셀렉터
const createButton = page.locator([
  'button:has-text("새 게시물")',
  'button:has-text("게시글 작성")',
  '.create-post',
  '[title*="게시물"]',
  '[aria-label*="작성"]'
].join(', '));
```

### 좋아요 버튼

```typescript
// 하트 아이콘 및 좋아요 텍스트 포함
const likeButton = page.locator([
  'button:has(svg[stroke="currentColor"]):has(path[d*="M4.318 6.318"])',
  'button:has-text("좋아요")',
  '.like-button',
  '[aria-label*="좋아요"]'
].join(', '));
```

## 🚀 실행 방법

```bash
# 피드 테스트만 실행
cd test && npx playwright test feed/ --headed

# 특정 기능 테스트
cd test && npx playwright test feed/feed-crud.spec.ts --debug

# 이미지 업로드 테스트
cd test && npx playwright test feed/image-upload.spec.ts --headed

# 성능 테스트
cd test && npx playwright test feed/feed-performance.spec.ts
```

## 🔍 현재 이슈 및 개선 계획

### 레거시 코드 분석 결과

- **SSR 캐시**: 30초 revalidation + 태그 기반 무효화
- **Optimistic UI**: PendingPost 컴포넌트로 즉시 반영
- **이미지 처리**: ImageDragDrop 컴포넌트 사용
- **상태 관리**: Zustand PostStore + UserStore

### 알려진 이슈

- [ ] 이미지 업로드 시 간헐적 실패 (셀렉터 개선 필요)
- [ ] 모달 ESC 키 이벤트 처리
- [ ] 무한 스크롤 200px 임계값 정확성

### 개선 로드맵

1. **1주차**: 기본 CRUD 테스트 안정화
2. **2주차**: 상호작용 및 UI 테스트 강화
3. **3주차**: 성능 및 캐시 테스트 추가
4. **4주차**: 에러 처리 및 엣지 케이스

## 🧩 관련 컴포넌트

### 주요 레거시 컴포넌트

- `FeedClient.tsx`: CSR 메인 로직
- `CreatePostButton.tsx`: 플로팅 작성 버튼
- `PostActions.tsx`: 좋아요/댓글 상호작용
- `PostDetailModal.tsx`: 상세 모달
- `PendingPost.tsx`: Optimistic UI
- `ImageDragDrop.tsx`: 이미지 업로드

### API 엔드포인트

- `POST /posts`: 게시글 작성
- `GET /posts`: 게시글 목록 조회
- `PUT /posts/:id`: 게시글 수정
- `DELETE /posts/:id`: 게시글 삭제
- `POST /posts/:id/like`: 좋아요 토글

---

**목표**: Feed 페이지의 모든 핵심 기능이 실제 사용자 시나리오에서 안정적으로 동작함을 보장
