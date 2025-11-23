# 3D 인터랙티브 포트폴리오

Three.js와 React Three Fiber를 활용한 몰입감 있는 3D 포트폴리오 웹사이트입니다.

## 주요 기능

- **3D 우주선 씬** - 인터랙티브한 우주선과 행성 탐험
- **워프 애니메이션** - 행성 선택 시 워프 효과
- **행성 표면 탐험** - 각 행성의 고유한 지형과 우주비행사 컨트롤
- **프로젝트 상세 정보** - 각 행성에 연결된 포트폴리오 프로젝트
- **다국어 지원** - 한국어/영어 전환
- **반응형 디자인** - 모바일/데스크톱 최적화
- **오디오 시스템** - 배경 음악 및 효과음

## 기술 스택

### Core
- **Next.js 15.5.4** - App Router, Turbopack
- **React 19** - 최신 React 기능 활용
- **TypeScript 5** - 타입 안전성

### 3D & 애니메이션
- **Three.js** - 3D 렌더링 엔진
- **@react-three/fiber** - React Three.js 렌더러
- **@react-three/drei** - 유용한 헬퍼 컴포넌트
- **Framer Motion** - UI 애니메이션

### 스타일링
- **Tailwind CSS v4** - 유틸리티 기반 스타일링

### 기타
- **Howler.js** - 오디오 처리
- **Playwright** - E2E 테스트

## 프로젝트 구조

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈 페이지
│   └── globals.css               # 글로벌 스타일
├── components/
│   ├── 3d/                       # 3D 컴포넌트
│   │   ├── planet-surface/       # 행성 표면 관련 컴포넌트
│   │   │   ├── Astronaut.tsx         # 우주비행사 로직 및 애니메이션
│   │   │   ├── TerrainMesh.tsx       # 지형, 언덕, 바위 렌더링
│   │   │   ├── ParticleSystem.tsx    # 파티클 시스템
│   │   │   └── PlanetEasterEggs.tsx  # Mars 이스터에그
│   │   ├── Scene.tsx                 # 메인 3D 씬
│   │   ├── PlanetSurface.tsx         # 행성 표면 오케스트레이터
│   │   ├── CameraAnimator.tsx        # 카메라 애니메이션
│   │   ├── HologramDisplaySystem.tsx # 홀로그램 디스플레이
│   │   ├── HologramScreen.tsx        # 홀로그램 스크린
│   │   ├── MouseCameraController.tsx # 마우스 카메라 컨트롤
│   │   ├── SpaceBackground.tsx       # 우주 배경
│   │   ├── WarpJump.tsx              # 워프 점프 효과
│   │   └── Flag3D.tsx                # 3D 깃발
│   └── ui/                       # UI 컴포넌트
│       ├── AudioPlayer.tsx
│       ├── LanguageToggle.tsx
│       ├── ProjectDetail.tsx
│       ├── CardDetailContent.tsx
│       ├── TVTurnonOverlay.tsx
│       └── TVShutoffOverlay.tsx
├── constants/                    # 설정 상수
│   ├── 3d-config.ts             # 3D 관련 설정
│   ├── particle-config.ts       # 파티클 시스템 상수
│   ├── animation-config.ts      # 애니메이션 타이밍 상수
│   └── ui-config.ts             # UI 레이아웃 상수
├── contexts/
│   └── LanguageContext.tsx      # 다국어 컨텍스트
├── hooks/                        # 커스텀 훅
│   ├── useSceneState.ts         # 씬 상태 관리
│   ├── useSceneTransitions.ts   # 씬 전환 로직
│   └── useMobileOptimization.ts # 모바일 최적화
├── lib/
│   ├── data.ts                  # 포트폴리오 데이터
│   └── audio.ts                 # 오디오 유틸리티
├── types/                        # TypeScript 타입 정의
│   ├── index.ts                 # 메인 타입 export
│   ├── 3d.ts                    # 3D 관련 타입
│   ├── i18n.ts                  # 다국어 관련 타입
│   └── scene.ts                 # 씬 상태 및 전환 타입
├── utils/                        # 유틸리티 함수
│   ├── 3d-helpers.ts            # 3D 헬퍼 함수
│   ├── color-helpers.ts         # 색상 처리 함수
│   ├── timing-helpers.ts        # 타이밍 및 애니메이션 함수
│   └── index.ts                 # 중앙 export
└── styles/                       # 추가 스타일 파일
```

## 설치 및 실행

### 요구사항
- Node.js 18.17 이상
- npm 또는 yarn

### 설치
```bash
npm install
# 또는
yarn install
```

### 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
npm run start
```

### 린트
```bash
npm run lint
```

## 코드 품질 개선

이 프로젝트는 다음 4가지 원칙을 기반으로 리팩토링되었습니다:

1. **가독성 (Readability)** - 코드를 읽고 이해하기 쉽게
2. **예측 가능성 (Predictability)** - 일관된 패턴과 타입 사용
3. **응집도 (Cohesion)** - 관련 기능을 하나로 모으기
4. **결합도 (Coupling)** - 컴포넌트 간 의존성 최소화

### 주요 개선사항

#### 1. 상수 관리 체계
- 모든 매직 넘버를 의미있는 상수로 변경
- `constants/` 디렉토리에 설정값 중앙 집중화
- 타입 안전성을 위한 `as const` 사용

#### 2. 컴포넌트 분리
- **PlanetSurface.tsx**: 569줄 → 105줄 (81% 감소)
- 단일 책임 원칙에 따른 컴포넌트 분할
- 재사용 가능한 독립적인 컴포넌트
- 테스트 및 유지보수 용이성 향상

#### 3. 타입 시스템 개선
- 40+ 개의 새로운 타입 정의
- 엄격한 타입 검사
- IDE 자동완성 및 IntelliSense 향상

#### 4. 유틸리티 함수
- 30+ 개의 재사용 가능한 헬퍼 함수
- 3D 수학, 색상 처리, 타이밍 유틸리티
- 순수 함수로 테스트 용이

상세한 리팩토링 내용은 [REFACTORING.md](./REFACTORING.md)를 참고하세요.

## 개발 가이드라인

### 3D 컴포넌트 작성

#### 성능 최적화
```tsx
import { useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

function Component() {
  // geometry와 material 재사용
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial(), []);

  // 애니메이션 최적화
  useFrame((state, delta) => {
    // 60fps 유지
  });

  return <mesh geometry={geometry} material={material} />;
}
```

#### 반응형 처리
```tsx
import { useThree } from '@react-three/fiber';

function Component() {
  const { viewport } = useThree();
  const isMobile = viewport.width < BREAKPOINTS.MOBILE;

  return (
    <mesh scale={isMobile ? 0.5 : 1}>
      {/* ... */}
    </mesh>
  );
}
```

### 다국어 지원

```tsx
import { useLanguage } from '@/src/contexts/LanguageContext';

function Component() {
  const { language, t } = useLanguage();

  return (
    <div>
      <h1>{t('안녕하세요', 'Hello')}</h1>
      <p>{project[`description_${language}`]}</p>
    </div>
  );
}
```

### 상수 사용

```tsx
import { CAMERA_CONFIG, PLANET_SURFACE_CONFIG } from '@/src/constants/3d-config';

function Component() {
  const cameraPosition = CAMERA_CONFIG.INITIAL_POSITION;
  const terrainSize = PLANET_SURFACE_CONFIG.TERRAIN_SIZE;

  // 상수 사용으로 유지보수 용이
}
```

### 유틸리티 함수 활용

```tsx
import { lerp, easeOutCubic, generateCircularPosition } from '@/src/utils';

function Component() {
  // 3D 헬퍼
  const position = generateCircularPosition(5, 10, 2);

  // 애니메이션 헬퍼
  const value = lerp(0, 100, easeOutCubic(progress));

  // 색상 헬퍼
  const color = lerpColor('#ff0000', '#0000ff', 0.5);
}
```

## Import 경로 패턴

프로젝트에서 사용하는 import 경로 규칙:

```tsx
// ✅ 절대 경로 사용 (권장)
import { useLanguage } from '@/src/contexts/LanguageContext';
import { CAMERA_CONFIG } from '@/src/constants/3d-config';
import { lerp } from '@/src/utils';
import { Planet, Project } from '@/src/types';

// ❌ 상대 경로 (가급적 피하기)
import { useLanguage } from '../../../contexts/LanguageContext';
```

**참고**: `@/src/`는 프로젝트 루트의 `src/` 폴더를 가리킵니다.

## 성능 최적화

### 모바일 최적화
- 디바이스 감지 후 품질 자동 조절
- 파티클 수 동적 조정
- geometry detail level 조절 (low/medium/high)
- 그림자 렌더링 선택적 비활성화

### 메모리 관리
- geometry와 material dispose() 호출
- useEffect cleanup 함수 활용
- 큰 텍스처 압축 및 최적화

### 렌더링 최적화
- React.memo로 불필요한 리렌더링 방지
- useMemo/useCallback 적극 활용
- Three.js 객체 재사용

## 주요 타입

```typescript
// 3D 타입
type Vector3Tuple = [number, number, number];
type GeometryDetail = "low" | "medium" | "high";

// 다국어 타입
type Language = "ko" | "en";
interface LocalizedString {
  ko: string;
  en: string;
}

// 씬 타입
type SceneMode = "spaceship" | "surface";
type TransitionEvent =
  | "planet_select"
  | "warp_start"
  | "warp_complete";

// 프로젝트 타입
interface Project {
  id: string;
  title: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  technologies: string[];
  featured: boolean;
  // ...
}
```

## 자주 발생하는 이슈

### Hydration Mismatch
3D 컴포넌트는 동적 import 사용:
```tsx
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/src/components/3d/Scene'), {
  ssr: false
});
```

### 성능 저하
Chrome DevTools Performance 탭으로 프로파일링:
```tsx
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* 3D 컴포넌트 */}
</Canvas>
```

### 타입 에러
- 빌드 전 `tsc --noEmit`으로 타입 검사
- IDE의 TypeScript 서버 재시작

## 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 기타 플랫폼
```bash
npm run build
# .next 폴더를 호스팅에 업로드
```

## 브라우저 지원

- Chrome/Edge (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- WebGL 지원 필수

## 라이선스

MIT License

## 연락처

- 이메일: contact@example.com
- GitHub: https://github.com/yourusername

---

## 참고 문서

- [REFACTORING.md](./REFACTORING.md) - 리팩토링 상세 문서
- [CLAUDE.md](./CLAUDE.md) - Claude Code 개발 가이드
- [Three.js 공식 문서](https://threejs.org/docs/)
- [React Three Fiber 문서](https://docs.pmnd.rs/react-three-fiber/)
