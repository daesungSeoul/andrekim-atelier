# CostumeRental - 의상 대여 웹사이트

## 프로젝트 개요
Next.js 14 + TypeScript 기반 의상 대여 MVP 서비스

## 기술 스택
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Prisma v5 + SQLite
- NextAuth.js v4 (Credentials, JWT)
- date-fns, bcryptjs

## 주요 명령어
```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run db:migrate   # Prisma 마이그레이션
npm run db:seed      # 시드 데이터 실행
npm run db:reset     # DB 초기화
```

## 테스트 계정
- 관리자: admin@costume.com / admin123
- 사용자: user@test.com / user123

## 프로젝트 구조
```
src/
├── app/           # 페이지 및 API 라우트
├── components/    # 재사용 컴포넌트
├── lib/           # prisma, auth, utils
└── types/         # TypeScript 타입 정의
prisma/
├── schema.prisma  # DB 스키마
└── seed.ts        # 시드 데이터
```
