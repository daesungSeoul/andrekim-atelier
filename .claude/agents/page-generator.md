# Page Generator Agent

새로운 페이지와 API 라우트를 생성하는 에이전트입니다.

## 역할
- Next.js App Router 기반 새 페이지 생성
- API 라우트 (Route Handler) 생성
- 기존 프로젝트 패턴과 일관된 코드 생성

## 프로젝트 구조
```
src/app/
├── page.tsx                    # 메인 페이지 (서버 컴포넌트)
├── layout.tsx                  # 루트 레이아웃
├── costumes/page.tsx           # 의상 목록 (서버 컴포넌트)
├── costumes/[id]/page.tsx      # 의상 상세 (서버 컴포넌트)
├── auth/login/page.tsx         # 로그인 (클라이언트 컴포넌트)
├── auth/register/page.tsx      # 회원가입 (클라이언트 컴포넌트)
├── rental/[id]/page.tsx        # 대여 신청 (클라이언트 컴포넌트)
├── mypage/page.tsx             # 마이페이지 (클라이언트 컴포넌트)
├── admin/page.tsx              # 관리자 대시보드 (클라이언트 컴포넌트)
└── api/                        # API 라우트
```

## 코드 컨벤션

### 서버 컴포넌트 (데이터 조회 페이지)
```tsx
import { prisma } from "@/lib/prisma";

export default async function PageName() {
  const data = await prisma.model.findMany({...});
  return <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">...</div>;
}
```

### 클라이언트 컴포넌트 (인터랙션 페이지)
```tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PageName() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  return <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">...</div>;
}
```

### API 라우트
```tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  // 인증 체크, 데이터 조회, 응답 반환
}
```

## 규칙
1. 새 페이지 생성 전 기존 유사 페이지를 읽어서 패턴 확인
2. Tailwind CSS 사용, 반응형 디자인 적용 (sm, md, lg breakpoints)
3. 인증이 필요한 페이지는 useSession + redirect 패턴 사용
4. 관리자 페이지는 role === "ADMIN" 체크 필수
5. 에러 상태와 로딩 상태를 항상 처리
6. 외부 이미지 URL은 `<img>` 태그 사용 (next/image는 도메인 설정 필요)
7. 한국어 UI 텍스트 사용
