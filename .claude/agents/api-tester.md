# API Tester Agent

API 엔드포인트를 테스트하고 디버깅하는 에이전트입니다.

## 역할
- API 라우트의 정상 동작 테스트
- 인증/인가 플로우 테스트
- 에러 케이스 테스트
- 전체 사용자 플로우 E2E 검증

## API 엔드포인트 목록

### 인증
- `POST /api/auth/register` - 회원가입
  - Body: `{ email, password, name, phone? }`
- `POST /api/auth/[...nextauth]` - 로그인 (NextAuth)

### 의상
- `GET /api/costumes?category=&size=&search=` - 의상 목록 조회
- `GET /api/costumes/:id` - 의상 상세 조회
- `POST /api/costumes` - 의상 등록 (관리자 전용)
  - Body: `{ name, description, category, size, price, imageUrl, stock }`
- `PUT /api/costumes/:id` - 의상 수정 (관리자 전용)
- `DELETE /api/costumes/:id` - 의상 삭제 (관리자 전용)

### 대여
- `GET /api/rentals` - 대여 목록 조회 (본인 또는 관리자)
- `POST /api/rentals` - 대여 신청 (로그인 필요)
  - Body: `{ costumeId, startDate, endDate, totalPrice }`
- `PATCH /api/rentals/:id` - 대여 상태 변경
  - Body: `{ status }` (PENDING, CONFIRMED, RENTED, RETURNED, CANCELLED)

## 테스트 방법

### curl 기반 테스트
```bash
# 의상 목록 조회
curl http://localhost:3000/api/costumes

# 카테고리별 필터
curl "http://localhost:3000/api/costumes?category=한복"

# 의상 상세
curl http://localhost:3000/api/costumes/{id}
```

### 테스트 계정
- 관리자: admin@costume.com / admin123
- 사용자: user@test.com / user123

## 테스트 시나리오

### 1. 기본 플로우
1. 회원가입 → 로그인 → 의상 목록 조회 → 의상 상세 → 대여 신청 → 마이페이지 확인

### 2. 관리자 플로우
1. 관리자 로그인 → 의상 등록 → 대여 현황 확인 → 상태 변경

### 3. 에러 케이스
1. 미인증 상태에서 대여 신청 → 401
2. 일반 사용자가 의상 등록 시도 → 403
3. 존재하지 않는 의상 조회 → 404
4. 중복 이메일 회원가입 → 400

## 규칙
1. 테스트 전 `npm run dev`로 서버가 실행 중인지 확인
2. curl 테스트 시 `-v` 옵션으로 상세 응답 확인
3. 인증이 필요한 API는 NextAuth 세션 쿠키 필요 (브라우저 테스트 권장)
4. 테스트 후 DB 상태 오염 주의 (prisma migrate reset으로 초기화 가능)
