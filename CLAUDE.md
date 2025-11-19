# CLAUDE.md - Portfolio Project

## 프로젝트 개요

3D 인터랙티브 포트폴리오 웹사이트. Three.js와 React Three Fiber를 활용한 몰입감 있는 3D 경험을 제공합니다.

## 기술 스택

### Core
- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**

### 3D & 애니메이션
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **Framer Motion**

### 스타일링
- **Tailwind CSS v4**

### 기타
- **Howler.js** - 오디오 처리
- **Playwright** - E2E 테스트

## 프로젝트 구조

```
app/
├── components/
│   ├── 3d/          # 3D 컴포넌트
│   │   ├── Scene.tsx           # 메인 3D 씬
│   │   ├── Card3D.tsx          # 3D 카드
│   │   ├── CardStack.tsx       # 카드 스택
│   │   ├── ParticleBackground.tsx
│   │   ├── FloatingElements.tsx
│   │   ├── InteractiveSphere.tsx
│   │   └── ScrollReactiveGeometry.tsx
│   └── ui/          # UI 컴포넌트
│       ├── AudioPlayer.tsx
│       ├── LanguageToggle.tsx
│       ├── ProjectDetail.tsx
│       └── CardDetailContent.tsx
├── contexts/
│   └── LanguageContext.tsx   # 다국어 지원
├── lib/
│   ├── data.ts      # 포트폴리오 데이터
│   └── audio.ts     # 오디오 유틸리티
├── types/
│   └── index.ts     # TypeScript 타입 정의
├── globals.css
├── layout.tsx
└── page.tsx
```

## 주요 명령어

```bash
# 개발 서버 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start

# 린트
npm run lint
```

## 핵심 타입

```typescript
// 프로젝트 정보 (다국어 지원)
interface Project {
  id: string;
  title: string;
  title_ko: string;
  title_en: string;
  description: string;
  description_ko: string;
  description_en: string;
  longDescription_ko: string;
  longDescription_en: string;
  period: string;
  teamSize?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

// 스킬 정보
interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  level: number; // 1-5
}
```

## 개발 가이드라인

### 3D 컴포넌트 작업 시

1. **성능 최적화 필수**
   - `useMemo`, `useCallback` 적극 활용
   - geometry와 material 재사용
   - 모바일 디바이스 감지 후 품질 조절

2. **React Three Fiber 패턴**
   ```tsx
   import { useFrame, useThree } from '@react-three/fiber';
   import { useRef } from 'react';

   function Component() {
     const meshRef = useRef<THREE.Mesh>(null);

     useFrame((state, delta) => {
       // 애니메이션 로직
     });

     return <mesh ref={meshRef}>...</mesh>;
   }
   ```

3. **반응형 처리**
   - `useThree()` 훅으로 viewport 정보 활용
   - 터치 이벤트와 마우스 이벤트 분리 처리

### 다국어 지원

- `LanguageContext` 사용
- 모든 텍스트는 `_ko`, `_en` 접미사로 구분
- 새 콘텐츠 추가 시 양쪽 언어 모두 작성

```tsx
import { useLanguage } from '@/app/contexts/LanguageContext';

function Component() {
  const { language } = useLanguage();

  return (
    <p>{project[`description_${language}`]}</p>
  );
}
```

### 데이터 수정

- 포트폴리오 데이터: `app/lib/data.ts`
- 새 프로젝트 추가 시 모든 필수 필드와 다국어 텍스트 포함

### 스타일링

- Tailwind CSS 클래스 우선 사용
- 복잡한 스타일은 `globals.css`에 정의
- 3D 요소는 inline style 또는 Three.js material 사용

## 주의사항

1. **Three.js 관련**
   - dispose() 호출로 메모리 누수 방지
   - 큰 텍스처는 압축 포맷 사용
   - 모바일에서 파티클 수 제한

2. **Next.js App Router**
   - 클라이언트 컴포넌트는 `'use client'` 필수
   - 3D 컴포넌트는 모두 클라이언트 컴포넌트

3. **빌드**
   - `npm run build` 전 타입 에러 확인
   - 사용하지 않는 import 정리

## 자주 발생하는 이슈

### Hydration Mismatch
- 3D 컴포넌트는 동적 import 또는 조건부 렌더링 사용
```tsx
import dynamic from 'next/dynamic';
const Scene = dynamic(() => import('./Scene'), { ssr: false });
```

### 성능 저하
- Chrome DevTools Performance 탭으로 프로파일링
- `Stats` 컴포넌트로 FPS 모니터링
```tsx
import { Stats } from '@react-three/drei';
<Canvas>
  <Stats />
</Canvas>
```

## 배포

- Vercel 권장 (Next.js 최적화)
- 환경변수 설정 불필요 (정적 데이터 사용)

## 연락처

- 이메일: contact@example.com
- GitHub: https://github.com/yourusername
