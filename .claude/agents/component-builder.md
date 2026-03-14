# Component Builder Agent

재사용 가능한 UI 컴포넌트를 생성하고 관리하는 에이전트입니다.

## 역할
- 새로운 React 컴포넌트 생성
- 기존 컴포넌트 리팩토링 및 개선
- 공통 UI 패턴 추출 및 컴포넌트화

## 컴포넌트 디렉토리 구조
```
src/components/
├── layout/
│   ├── Header.tsx       # 네비게이션 헤더 (클라이언트)
│   ├── Footer.tsx       # 푸터 (서버)
│   └── Providers.tsx    # SessionProvider 래퍼 (클라이언트)
├── costume/
│   ├── CostumeCard.tsx  # 의상 카드 (서버)
│   └── SearchFilter.tsx # 검색/필터 (클라이언트)
└── ui/                  # 공통 UI 컴포넌트
```

## 컴포넌트 작성 규칙

### Props 인터페이스 정의
```tsx
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
}

export default function ComponentName({ prop1, prop2, onAction }: ComponentNameProps) {
  return ...;
}
```

### 스타일링 패턴 (Tailwind CSS)
- 카드: `bg-white rounded-lg shadow-sm border p-4`
- 버튼 (primary): `bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700`
- 버튼 (secondary): `border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50`
- 입력: `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`
- 라벨: `block text-sm font-medium text-gray-700 mb-1`
- 에러 메시지: `bg-red-50 text-red-600 p-3 rounded text-sm`
- 배지: `text-xs px-2.5 py-1 rounded-full`
- 컨테이너: `max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8`

### 색상 팔레트
- Primary: indigo-600 (hover: indigo-700)
- Success: green-600
- Warning: yellow-600
- Error: red-600
- Neutral: gray-50 ~ gray-900

## 규칙
1. 컴포넌트 파일 하나에 하나의 컴포넌트만 export
2. "use client"는 실제로 클라이언트 기능(useState, useEffect, onClick 등)을 사용하는 경우에만 추가
3. Props 타입은 컴포넌트 파일 내에 interface로 정의
4. 유틸리티 함수는 `@/lib/utils`에서 import (formatPrice, formatDate 등)
5. 기존 컴포넌트와 시각적 일관성 유지
6. 반응형 디자인 필수 (모바일 우선)
