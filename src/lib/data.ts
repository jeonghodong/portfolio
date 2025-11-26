import { Capsule, Experience, PersonalInfo, Planet, Project, Skill } from "@/src/types";

export const personalInfo: PersonalInfo = {
  name: "Jeonghо Dong",
  role: "Frontend Developer",
  tagline: "Crafting immersive web experiences with code and creativity",
  bio: `I'm a passionate frontend developer specializing in creating interactive and visually stunning web applications. With expertise in React, Next.js, and 3D web graphics, I transform ideas into engaging digital experiences.`,
  location: "Seoul, South Korea",
  email: "contact@example.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  audioUrl: "/audio/intro.mp3",
};

export const projects: Project[] = [
  {
    id: "1",
    title: "루돌프의 수족냉증을 부탁해",
    title_ko: "루돌프의 수족냉증을 부탁해",
    title_en: "Save Rudolph's Cold Hooves",
    description: "5-day Christmas letter exchange viral service",
    description_ko: "5일 만에 완성한 크리스마스 편지 교환 바이럴 서비스",
    description_en: "Christmas letter exchange viral service completed in just 5 days",
    longDescription: "A Christmas-limited service where friends exchange warm letters through a unique sock collection mechanism. Built by a team of 1 designer and 2 developers in just 5 days, from planning to deployment.",
    longDescription_ko: `## 프로젝트 개요

크리스마스 시즌을 맞아 단 5일이라는 짧은 기간 동안, 디자이너 1명과 개발자 2명이 모여 특별한 단기 이벤트 서비스를 만들었습니다. **루돌프의 수족냉증을 부탁해**는 친구들에게 따뜻한 편지를 주고받는 크리스마스 한정 서비스입니다.

제약된 시간과 리소스 속에서도 기획부터 UX/UI 설계, 화면 구성, 문제 대응까지 전 과정을 주도하며 프로젝트를 완성했습니다. 특히 크리스마스라는 시즌성과 한정된 기간을 활용해 사용자의 기대감과 몰입도를 극대화하는 것이 핵심 목표였습니다.


## 핵심 기능 및 UX 설계

### 양말 수집 메커니즘

서비스의 핵심은 **양말 4개를 모아야 편지를 열람할 수 있다**는 독특한 구조입니다. 사용자는 친구들로부터 양말(편지)을 선물받고, 4개가 모이면 루돌프가 따뜻해지면서 편지를 읽을 수 있게 됩니다. 이 메커니즘은 단순히 편지를 주고받는 것이 아니라, 친구들의 참여를 유도하고 기대감을 높이는 장치로 작동합니다.

### 크리스마스 한정 인터랙션

특별한 양말은 **12월 25일에만 열리는 한정 인터랙션**으로 설계했습니다. 이를 통해 크리스마스 당일까지 서비스에 재방문하도록 유도하고, 특별한 날의 의미를 강조했습니다.

### 사용자 플로우

서비스 흐름을 최소 단계로 설계하여 직관성을 높였습니다:

- **로그인** - 카카오톡 소셜 로그인으로 간편하게 시작
- **루돌프 생성** - 나만의 루돌프 캐릭터 만들기
- **링크 공유** - 친구들에게 내 루돌프 링크 전달
- **양말 수집** - 친구들로부터 편지(양말) 받기
- **편지 열람** - 4개가 모이면 편지 읽기

## 서비스 시연

### 1. 카카오톡 소셜 로그인

초반 나의 루돌프를 생성하기 위해 카카오톡 소셜 로그인을 진행합니다.

![카카오톡 소셜 로그인](/images/rusumack/login.gif)

### 2. 루돌프 생성

로그인 후 나만의 루돌프를 생성하게 됩니다.

![루돌프 생성](/images/rusumack/create.gif)

### 3. 링크 공유

나의 루돌프가 생성되면 링크 복사 기능이 생깁니다. 해당 링크를 친구들에게 공유하여 나의 루돌프에게 양말(편지)을 선물할 수 있습니다.

![링크 공유](/images/rusumack/check-link.gif)

### 4. 양말 보내기 & 편지 읽기

친구들이 양말을 보내고, 4개가 모이면 편지를 열람할 수 있습니다.

![양말 보내기](/images/rusumack/post.gif)

![편지 읽기](/images/rusumack/read.gif)

## UI/UX 설계 과정

### 빠른 실행력

와이어프레임 설계부터 일러스트와 시각적 요소를 포함한 화면 구성까지 **단 3일 만에 완료**했습니다. 짧은 기간이었지만 사용자 경험의 핵심 흐름에 집중하여 불필요한 요소는 과감히 제거하고, 크리스마스 분위기를 살릴 수 있는 비주얼에 집중했습니다.

### 사용자 테스트 및 검증

배포 전, 초기 10명 내외의 사용자 테스트를 통해 서비스 흐름과 직관성을 점검했습니다. 이후 **구글 애널리틱스**를 활용해 실제 사용 데이터를 확인하며 UX 설계가 의도대로 작동하는지 지속적으로 검증했습니다.

## 프로모션 및 성과

MZ세대가 많이 모이는 커뮤니티와 SNS, 그리고 토스 광고를 활용해 직접 프로모션을 진행했습니다. 크리스마스 시즌의 특성과 독특한 서비스 컨셉이 입소문을 타면서 빠르게 확산되었습니다.

초기 기획 목표는 조회수 1,000회와 로그인 생성자 50명으로 보수적으로 설정했습니다. 하지만 12월 17일 기준, 예상을 훨씬 뛰어넘는 성과를 거두었습니다:

**🎯 목표를 10배 이상 초과 달성**하며 짧은 기간에도 의미 있는 임팩트를 만들어낼 수 있음을 증명했습니다.

## 문제 해결 사례

### 크리스마스 편지 노출 오류

배포 직후, 크리스마스 당일(12월 25일)에만 열려야 하는 특별한 편지가 사전에 노출되는 오류를 발견했습니다. 이는 서비스의 핵심 경험을 해치는 심각한 문제였습니다.

즉시 개발팀과 협업하여 문제의 원인을 파악하고, **1시간 내에 수정 배포를 완료**했습니다. 이 과정에서 UX는 단순한 화면 설계가 아니라, 사용자 경험 전체 흐름을 책임지고 문제를 신속히 개선하는 과정임을 체감했습니다.

## 회고 및 배운 점

### 제약 속에서의 빠른 실행력

5일이라는 짧은 기간과 제한된 리소스 속에서도, 명확한 목표와 우선순위 설정으로 프로젝트를 성공적으로 완료할 수 있었습니다. 모든 기능을 구현하려 하기보다는, 핵심 경험에 집중하고 불필요한 요소를 과감히 제거하는 것이 중요했습니다.

### 데이터 기반 UX 검증의 중요성

초기 사용자 테스트와 구글 애널리틱스를 통한 데이터 분석은, UX 설계가 실제로 의도대로 작동하는지 확인할 수 있는 중요한 지표였습니다. 직관에만 의존하지 않고 데이터로 검증하는 습관이 중요함을 배웠습니다.

### 팀 협업의 힘

짧은 기간에 높은 퀄리티의 결과물을 만들어낼 수 있었던 것은 디자이너와 개발자 간의 긴밀한 협업 덕분이었습니다. 서로의 영역을 존중하면서도 적극적으로 소통하고, 문제가 발생했을 때 빠르게 대응할 수 있는 팀워크가 프로젝트 성공의 핵심이었습니다.`,
    longDescription_en: `## Project Overview

During the Christmas season, a team of 1 designer and 2 developers came together for just 5 days to create a special short-term event service. **'Save Rudolph's Cold Hooves'** is a Christmas-limited service where friends exchange warm letters.

Despite time and resource constraints, I led the entire process from planning to UX/UI design, screen composition, and problem resolution. The core goal was to maximize user anticipation and engagement by leveraging the seasonal nature and limited timeframe of Christmas.

## Core Features & UX Design

### Sock Collection Mechanism

The core of the service is a unique structure where **"you need to collect 4 socks to read the letters."** Users receive socks (letters) as gifts from friends, and when 4 are collected, Rudolph warms up and the letters become readable. This mechanism doesn't just facilitate letter exchange—it encourages friend participation and builds anticipation.

### Christmas-Limited Interaction

Special socks were designed as **limited interactions that only open on December 25th**. This encouraged revisits to the service until Christmas day and emphasized the significance of the special day.

### User Flow

The service flow was designed with minimal steps for maximum intuitiveness:

- **Login** - Easy start with KakaoTalk social login
- **Create Rudolph** - Create your own Rudolph character
- **Share Link** - Send your Rudolph link to friends
- **Collect Socks** - Receive letters (socks) from friends
- **Read Letters** - Read letters when 4 are collected

## Service Demo

### 1. KakaoTalk Social Login

Start by logging in with KakaoTalk to create your Rudolph.

![KakaoTalk Social Login](/images/rusumack/login.gif)

### 2. Create Rudolph

After logging in, create your own Rudolph.

![Create Rudolph](/images/rusumack/create.gif)

### 3. Share Link

Once your Rudolph is created, a link copy function appears. Share this link with friends so they can gift socks (letters) to your Rudolph.

![Share Link](/images/rusumack/check-link.gif)

### 4. Send Socks & Read Letters

Friends send socks, and when 4 are collected, you can read the letters.

![Send Socks](/images/rusumack/post.gif)

![Read Letters](/images/rusumack/read.gif)

## UI/UX Design Process

### Fast Execution

From wireframe design to screen composition including illustrations and visual elements, **completed in just 3 days**. Despite the short timeframe, we focused on the core user experience flow, boldly removing unnecessary elements while focusing on visuals that captured the Christmas atmosphere.

### User Testing & Validation

Before deployment, we tested with about 10 initial users to verify the service flow and intuitiveness. We then used **Google Analytics** to continuously validate whether the UX design was working as intended.

## Promotion & Results

We conducted direct promotion through communities and SNS where MZ generation gathers, as well as Toss advertising. The Christmas season characteristics and unique service concept spread rapidly through word of mouth.

Initial planning goals were conservatively set at 1,000 views and 50 login users. However, as of December 17th, we achieved results far exceeding expectations:

**🎯 Exceeded goals by more than 10x**, proving that meaningful impact can be achieved even in a short period.

## Problem Solving Case

### Christmas Letter Exposure Bug

Right after deployment, we discovered a bug where special letters that should only open on Christmas day (December 25th) were being exposed prematurely. This was a serious issue that compromised the core service experience.

We immediately collaborated with the development team to identify the cause and **completed the fix deployment within 1 hour**. Through this process, I realized that UX is not just about screen design, but about taking responsibility for the entire user experience flow and quickly resolving issues.

## Retrospective & Lessons Learned

### Fast Execution Under Constraints

Despite the 5-day timeframe and limited resources, we successfully completed the project through clear goals and priority setting. Rather than trying to implement all features, focusing on the core experience and boldly removing unnecessary elements was crucial.

### Importance of Data-Driven UX Validation

Initial user testing and data analysis through Google Analytics were important indicators to verify whether UX design was working as intended. I learned the importance of not relying solely on intuition but validating with data.

### Power of Team Collaboration

Being able to produce high-quality results in a short period was thanks to close collaboration between designer and developer. Teamwork that respects each other's domains while actively communicating and responding quickly to problems was key to project success.`,
    period: "2023.12 - 2024.01",
    teamSize: "Designer 1, Developer 2",
    technologies: ["Next.js", "Tailwind CSS", "Nest.js", "MySQL", "AWS (EC2, Route53, S3, CloudFront)"],
    imageUrl: "/images/rusumack/post.gif",
    featured: true,
  },
  {
    id: "2",
    title: "NewsZap",
    title_ko: "뉴스잽",
    title_en: "NewsZap",
    description: "AI-powered news bias detection service",
    description_ko: "AI 기반 뉴스 편파성 분석 플랫폼",
    description_en: "AI-powered news bias analysis platform",
    longDescription: "An innovative news platform that uses AI technology to quantify and visualize political bias in news articles, helping users make more informed judgments.",
    longDescription_ko: `## 프로젝트 배경

현대 사회에서 뉴스 소비는 일상이 되었지만, 동시에 **미디어 편파성**이라는 큰 문제에 직면하고 있습니다. 같은 사건을 다루더라도 언론사마다 다른 시각으로 보도하고, 독자들은 어떤 기사가 객관적인지 판단하기 어려워합니다.

News Zap은 이런 문제를 해결하기 위해 탄생했습니다. **AI 기술을 활용하여 각 기사의 정치적 편파성을 수치화하고 시각적으로 표현**함으로써, 사용자가 더 현명한 판단을 내릴 수 있도록 돕는 혁신적인 뉴스 플랫폼입니다.


## 핵심 기능

### 편파성 수치화 시스템

각 뉴스 기사의 정치적 성향을 **-100에서 +100 사이의 스케일**로 수치화합니다:

- **-100 ~ -50**: 진보 성향
- **-50 ~ +50**: 중도 성향
- **+50 ~ +100**: 보수 성향

이 수치는 기사의 제목, 본문 내용, 사용된 키워드 등을 종합적으로 분석하여 산출됩니다.

### AI 기반 분석

**Ollama AI 서버**를 활용하여 기사의 내용을 심층 분석합니다. 단순한 키워드 매칭이 아닌, 문맥을 이해하고 뉘앙스를 파악하여 보다 정확한 편파성 점수를 제공합니다.


## 서비스 시연

### 메인 화면

뉴스 기사들이 카드 형태로 나열되며, 각 카드에는 편파성 수치가 색상으로 시각화되어 표시됩니다.

![메인 화면](/images/news-zap/home.gif)

### 기사 카드

각 기사별로 정치적 성향을 직관적으로 보여주는 카드 UI입니다. 사용자는 한눈에 기사의 편향성을 파악할 수 있습니다.

![기사 카드](/images/news-zap/card.png)

### AI 분석 결과

기사 디테일 페이지에서는 제목과 내용을 기반으로 Ollama AI 서버에 요청하여 상세한 분석 결과를 제공합니다.

![AI 분석 결과](/images/news-zap/ai.png)

## 기술 스택

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: ky

### Backend
- **API Proxy**: Next.js API Routes
- **News Data**: DeepSearch News API
- **AI Analysis**: Ollama AI Server

### Infrastructure
- **Deployment**: AWS (S3, CloudFront, Route53, EC2)
- **Architecture**: Monorepo 구조

## 기술적 도전과 해결

### AI 응답 최적화

Ollama AI의 응답 시간이 길어 사용자 경험이 저하되는 문제가 있었습니다. 이를 해결하기 위해:

- **스트리밍 응답** 구현으로 사용자에게 실시간 피드백 제공
- **캐싱 전략** 도입으로 동일 기사 재분석 시 즉시 응답
- **로딩 상태 UX** 개선으로 대기 시간 체감 감소

### 편파성 알고리즘 설계

단순 키워드 기반 분석의 한계를 극복하기 위해:

- AI의 **문맥 이해 능력** 활용
- **다중 지표** (제목, 본문, 인용문 등) 종합 분석
- 지속적인 **피드백 루프**를 통한 정확도 개선

## 마치며

미디어 편파성 문제는 하루아침에 해결될 수 없는 복잡한 사회적 이슈입니다. 하지만 기술을 통해 조금이라도 더 나은 방향으로 나아갈 수 있다면, 그것만으로도 충분한 가치가 있다고 생각합니다.

> **"완벽한 객관성은 존재하지 않지만, 더 나은 균형을 위해 노력할 수는 있습니다."**

이 프로젝트를 통해 사용자들이 뉴스를 소비할 때 한 번 더 생각하고, 다양한 관점을 고려하는 계기가 되기를 바랍니다.`,
    longDescription_en: `## Project Background

In modern society, news consumption has become a daily routine, but at the same time, we face a significant problem called **media bias**. Even when covering the same events, different media outlets report from different perspectives, making it difficult for readers to judge which articles are objective.

News Zap was created to solve this problem. It's an innovative news platform that **quantifies and visually represents the political bias of each article using AI technology**, helping users make more informed judgments.

## Core Features

### Bias Quantification System

Each news article's political orientation is quantified on a **scale from -100 to +100**:

- **-100 to -50**: Progressive/Liberal leaning
- **-50 to +50**: Moderate/Centrist
- **+50 to +100**: Conservative leaning

This score is calculated by comprehensively analyzing the article's title, body content, and keywords used.

### AI-Based Analysis

Utilizing the **Ollama AI server** for in-depth analysis of article content. Rather than simple keyword matching, it understands context and captures nuances to provide more accurate bias scores.

## Service Demo

### Main Screen

News articles are displayed in card format, with bias scores visually represented through colors on each card.

![Main Screen](/images/news-zap/home.gif)

### Article Card

A card UI that intuitively shows the political orientation of each article. Users can grasp the bias at a glance.

![Article Card](/images/news-zap/card.png)

### AI Analysis Results

The article detail page requests the Ollama AI server based on the title and content to provide detailed analysis results.

![AI Analysis Results](/images/news-zap/ai.png)

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: ky

### Backend
- **API Proxy**: Next.js API Routes
- **News Data**: DeepSearch News API
- **AI Analysis**: Ollama AI Server

### Infrastructure
- **Deployment**: AWS (S3, CloudFront, Route53, EC2)
- **Architecture**: Monorepo structure

## Technical Challenges and Solutions

### AI Response Optimization

The long response time from Ollama AI was degrading user experience. To solve this:

- Implemented **streaming responses** for real-time feedback to users
- Introduced **caching strategy** for instant responses when re-analyzing the same article
- Improved **loading state UX** to reduce perceived wait time

### Bias Algorithm Design

To overcome the limitations of simple keyword-based analysis:

- Utilized AI's **contextual understanding** capabilities
- **Multi-indicator** comprehensive analysis (title, body, quotes, etc.)
- Continuous **feedback loops** for accuracy improvement

## Conclusion

Media bias is a complex social issue that cannot be solved overnight. However, if technology can help us move in a slightly better direction, I believe that alone has sufficient value.

> **"Perfect objectivity doesn't exist, but we can strive for better balance."**

Through this project, I hope users will think twice when consuming news and consider diverse perspectives.`,
    period: "2025.05 - 2025.06",
    technologies: ["TypeScript", "Next.js", "Emotion", "Python", "Ollama AI", "Monorepo", "AWS (S3, CloudFront, Route53, Certificate Manager, EC2)"],
    imageUrl: "/images/news-zap/card.png",
    featured: true,
  },
  {
    id: "3",
    title: "SCF",
    links: [
      {
        label: "Documentation",
        url: "https://docs.s3cf.net",
        icon: "docs",
      },
    ],
    title_ko: "CloudFront Auto Deploy CLI",
    title_en: "CloudFront Auto Deploy CLI",
    description: "Static website AWS deployment automation CLI",
    description_ko: "정적 웹사이트 AWS 배포 자동화 CLI 도구",
    description_en: "Static website AWS deployment automation CLI tool",
    longDescription:
      "A TypeScript-based CLI tool that automates the entire deployment process for static websites to AWS with a single command. Features incremental deployment through file hash comparison, reducing deployment time by 87% (from 15 minutes to 2 minutes). Published as an npm package for open-source availability.",
    longDescription_ko: `## 프로젝트 배경

많은 개발자들이 자신의 제품을 빠르게 출시하고 시장에서 테스트해보고 싶어합니다. 소프트웨어 웹 서비스의 경우 **배포**가 핵심적인 단계인데, 특히 정적 웹사이트 배포에서 반복적인 수동 작업이 큰 걸림돌이 되었습니다.

AWS에서 정적 웹사이트를 배포할 때마다:
- **S3 버킷**에 파일 업로드
- **CloudFront** 배포 설정
- **캐시 무효화** 처리
- **Route53** 도메인 연결
- **ACM** 인증서 설정

이 모든 작업을 AWS 콘솔에서 직접 수동으로 처리해야 했고, 매번 **15분 이상**이 소요되었습니다. 반복적인 작업은 **휴먼 에러**의 원인이 되기도 했습니다.


## 베스트 프랙티스 선택

정적 웹사이트 배포 방식은 다양하지만, 제가 선택한 베스트 프랙티스는 **S3 + CloudFront + Route53 + ACM** 조합이었습니다.

이 조합의 장점:
- **유지보수 편리** - 서버리스 아키텍처로 관리 포인트 최소화
- **확장성 우수** - CloudFront CDN을 통한 글로벌 배포
- **비용 효율** - 사용량 기반 과금으로 초기 비용 부담 없음
- **높은 가용성** - AWS 인프라의 안정성 활용

하지만 이 조합도 **배포할 때마다 AWS 콘솔에서 직접 리소스를 생성하고 설정**해야 하는 번거로움이 있었습니다.


## 해결 방안

**"라이브러리로 만들어서 개발자들이 쉽게 배포할 수 있게 하자!"**

이 아이디어에서 SCF 프로젝트가 시작되었습니다.

### 기술적 접근

- **AWS SDK v3** 를 사용하여 AWS 서비스 자동화
- **AWS CLI Credentials** 활용으로 보안성 확보 (사용자의 액세스 키를 코드에 노출하지 않음)
- **Commander.js**로 직관적인 CLI 인터페이스 구현
- **Zod**로 설정 파일 스키마 검증

![SCF CLI](/images/scf/scf.png)


## 핵심 기능

### 단일 명령어 배포
\`\`\`bash
npx scf-deploy deploy
\`\`\`
한 줄의 명령어로 S3 업로드부터 CloudFront 캐시 무효화까지 전체 배포 과정을 자동화했습니다.

### 증분 배포 (Incremental Deploy)
**파일 해시 비교**를 통해 변경된 파일만 선택적으로 업로드합니다.
- 전체 배포: 15분 → **증분 배포: 2분**
- **87% 배포 시간 단축**

### 자동 캐시 무효화
배포 완료 후 CloudFront 캐시를 자동으로 무효화하여 즉시 변경사항이 반영됩니다.


## 기술 스택

- **TypeScript** - 타입 안전성과 개발 생산성
- **Commander.js** - CLI 프레임워크
- **AWS SDK v3** - AWS 서비스 연동
- **Zod** - 런타임 스키마 검증
- **Husky** - Git hooks를 통한 코드 품질 관리
- **Github Actions** - CI/CD 파이프라인


## 향후 계획

현재 유닛, 통합, E2E 테스트 코드를 적용해놓았지만, AWS의 다양한 커맨드들이 모든 상황에서 안정적으로 동작할지에 대한 고민이 있습니다.

더 나은 방법으로 **CloudFormation** 템플릿 활용을 고려하고 있습니다:
- AWS 자원 내에서 S3-CF-Route53-ACM 생성 로직을 템플릿화
- **인프라 코드(IaC)** 로서의 안정성 확보
- AWS 네이티브 도구 활용으로 호환성 향상`,
    longDescription_en: `## Project Background

Many developers want to quickly launch their products and test them in the market. For software web services, **deployment** is a critical step, and repetitive manual tasks in static website deployment became a major obstacle.

When deploying a static website on AWS, every time you need to:
- Upload files to **S3 bucket**
- Configure **CloudFront** distribution
- Handle **cache invalidation**
- Connect **Route53** domain
- Set up **ACM** certificate

All these tasks had to be done manually through the AWS console, taking **over 15 minutes** each time. Repetitive tasks also became a source of **human errors**.


## Best Practice Selection

There are various approaches to static website deployment, but my chosen best practice was the **S3 + CloudFront + Route53 + ACM** combination.

Benefits of this combination:
- **Easy maintenance** - Serverless architecture minimizes management points
- **Excellent scalability** - Global distribution through CloudFront CDN
- **Cost efficient** - Usage-based billing with no upfront costs
- **High availability** - Leveraging AWS infrastructure reliability

However, this combination still required **manually creating and configuring resources in AWS console** for each deployment.


## Solution

**"Let's create a library so developers can deploy easily!"**

This idea sparked the SCF project.

### Technical Approach

- **AWS SDK v3** for AWS service automation
- **AWS CLI Credentials** for security (no access keys exposed in code)
- **Commander.js** for intuitive CLI interface
- **Zod** for configuration file schema validation

![SCF CLI](/images/scf/scf.png)


## Core Features

### Single Command Deployment
\`\`\`bash
npx scf-deploy deploy
\`\`\`
Automated the entire deployment process from S3 upload to CloudFront cache invalidation with a single command.

### Incremental Deploy
Selectively uploads only changed files through **file hash comparison**.
- Full deployment: 15 min → **Incremental: 2 min**
- **87% deployment time reduction**

### Automatic Cache Invalidation
Automatically invalidates CloudFront cache after deployment for immediate reflection of changes.


## Tech Stack

- **TypeScript** - Type safety and developer productivity
- **Commander.js** - CLI framework
- **AWS SDK v3** - AWS service integration
- **Zod** - Runtime schema validation
- **Husky** - Code quality management through Git hooks
- **Github Actions** - CI/CD pipeline


## Future Plans

While unit, integration, and E2E tests are implemented, there are concerns about whether all AWS commands will work reliably in every situation.

Considering **CloudFormation** templates as a better approach:
- Templatize S3-CF-Route53-ACM creation logic within AWS resources
- Secure stability as **Infrastructure as Code (IaC)**
- Improved compatibility using AWS native tools`,
    period: "2025.10 - 2025.11",
    technologies: ["TypeScript", "Commander.js", "AWS SDK v3", "Zod", "Husky", "Github Actions"],
    imageUrl: "/images/scf/scf.png",
    featured: false,
  },
  {
    id: "4",
    title: "Epoch Crew",
    title_ko: "찌돌프 코 터트리기",
    title_en: "Pop Rudolph's Nose",
    description: "Christmas real-time multiplayer mini-game",
    description_ko: "카카오톡 친구들과 즐기는 크리스마스 실시간 멀티플레이어 미니게임",
    description_en: "Christmas real-time multiplayer mini-game with KakaoTalk friends",
    longDescription:
      "A Christmas season real-time multiplayer mini-game where up to 4 players compete by clicking to pop Rudolph's nose. Solved race conditions with transaction-based concurrent access control and achieved 50 concurrent users during Christmas season through KakaoTalk viral sharing.",
    longDescription_ko:
      "카카오톡 친구들과 즐기는 크리스마스 시즌 한정 실시간 멀티플레이어 미니게임입니다. 최대 4명이 동시 접속하여 클릭으로 루돌프의 코를 터트리는 경쟁 게임으로, Firebase 무료 티어 내에서 실시간 동기화와 동시성 이슈를 해결하는 것이 핵심 과제였습니다. Transaction 기반 동시 접속 제어로 Race Condition을 해결하고, 카카오톡 공유를 통한 바이럴 확산으로 크리스마스 시즌 동시 접속 최대 50명을 달성했습니다.",
    longDescription_en:
      "A Christmas season real-time multiplayer mini-game to enjoy with KakaoTalk friends. Up to 4 players can connect simultaneously to compete by clicking to pop Rudolph's nose. The key challenge was solving real-time synchronization and concurrency issues within Firebase's free tier. Resolved race conditions with transaction-based concurrent access control and achieved maximum 50 concurrent users during Christmas season through KakaoTalk viral sharing.",
    period: "2025.10 - 2025.11",
    technologies: ["TypeScript", "Next.js", "TailwindCSS", "Framer Motion", "Zustand", "Firebase", "Kakao SDK", "AWS (S3, CloudFront)", "Husky", "Github Actions"],
    featured: true,
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", level: 5 },
  { name: "Next.js", category: "frontend", level: 5 },
  { name: "TypeScript", category: "frontend", level: 5 },
  { name: "JavaScript", category: "frontend", level: 5 },
  { name: "Three.js", category: "frontend", level: 4 },
  { name: "Framer Motion", category: "frontend", level: 4 },
  { name: "Tailwind CSS", category: "frontend", level: 5 },
  { name: "CSS/SCSS", category: "frontend", level: 5 },
  { name: "HTML5", category: "frontend", level: 5 },

  // Backend
  { name: "Node.js", category: "backend", level: 4 },
  { name: "Express", category: "backend", level: 4 },
  { name: "PostgreSQL", category: "backend", level: 3 },
  { name: "MongoDB", category: "backend", level: 3 },
  { name: "Prisma", category: "backend", level: 4 },
  { name: "GraphQL", category: "backend", level: 3 },

  // Tools
  { name: "Git", category: "tools", level: 5 },
  { name: "Docker", category: "tools", level: 3 },
  { name: "Webpack", category: "tools", level: 4 },
  { name: "Vite", category: "tools", level: 4 },
  { name: "Figma", category: "tools", level: 4 },
  { name: "Storybook", category: "tools", level: 4 },
];

export const experiences: Experience[] = [
  {
    company: "Tech Innovation Labs",
    position: "Senior Frontend Developer",
    period: "2022 - Present",
    description: "Leading frontend development for enterprise web applications. Implemented 3D visualization features and improved performance by 40%.",
    technologies: ["React", "Next.js", "Three.js", "TypeScript"],
  },
  {
    company: "Creative Digital Studio",
    position: "Frontend Developer",
    period: "2020 - 2022",
    description: "Developed interactive websites and web applications for various clients. Specialized in animation and user experience design.",
    technologies: ["React", "Vue.js", "Framer Motion", "GSAP"],
  },
  {
    company: "Startup Ventures",
    position: "Junior Frontend Developer",
    period: "2019 - 2020",
    description: "Built responsive web applications and maintained existing codebases. Collaborated with designers to implement pixel-perfect UIs.",
    technologies: ["JavaScript", "React", "Sass", "Bootstrap"],
  },
];

export const sectionAudios = {
  hero: "/audio/hero.mp3",
  about: "/audio/about.mp3",
  projects: "/audio/projects.mp3",
  skills: "/audio/skills.mp3",
  contact: "/audio/contact.mp3",
};

export const planets: Planet[] = [
  {
    id: "0",
    name: "Moon",
    name_ko: "달",
    name_en: "Moon",
    size: 2.2,
    textureUrl: "/textures/planets/moon.jpg",
    position: [0, 2, 6],
    rotationSpeed: 0.002,
    environment: {
      groundColor: "#9a9a9a",
      skyColor: "#000000",
      fogColor: "#1a1a1a",
      ambientColor: "#ffffff",
      particleColor: "#888888",
      features: ["craters", "dust", "regolith"],
    },
  },
  {
    id: "1",
    name: "Mercury",
    name_ko: "수성",
    name_en: "Mercury",
    size: 2.5,
    textureUrl: "/textures/planets/mercury.jpg",
    position: [-20, 6, -16],
    rotationSpeed: 0.004,
    projectId: "1",
    environment: {
      groundColor: "#8a8a8a",
      skyColor: "#1a1a1a",
      fogColor: "#2a2a2a",
      ambientColor: "#ffffff",
      particleColor: "#cccccc",
      features: ["craters", "dust", "rocks"],
    },
  },
  {
    id: "2",
    name: "Venus",
    name_ko: "금성",
    name_en: "Venus",
    size: 2.8,
    textureUrl: "/textures/planets/venus.jpg",
    position: [-9, -7, 12],
    rotationSpeed: 0.002,
    projectId: "2",
    environment: {
      groundColor: "#d4a574",
      skyColor: "#ff8c42",
      fogColor: "#ffa64d",
      ambientColor: "#ffcc99",
      particleColor: "#ffdd88",
      features: ["clouds", "volcanic", "haze"],
    },
  },
  {
    id: "3",
    name: "Earth",
    name_ko: "지구",
    name_en: "Earth",
    size: 3.0,
    textureUrl: "/textures/planets/earth.jpg",
    position: [6, 4, -9],
    rotationSpeed: 0.003,
    projectId: "3",
    environment: {
      groundColor: "#4a7c4e",
      skyColor: "#87ceeb",
      fogColor: "#b0d4e8",
      ambientColor: "#ffffff",
      particleColor: "#88ff88",
      features: ["grass", "trees", "water"],
    },
  },
  {
    id: "4",
    name: "Mars",
    name_ko: "화성",
    name_en: "Mars",
    size: 2.5,
    textureUrl: "/textures/planets/mars.jpg",
    position: [18, -5, 6],
    rotationSpeed: 0.003,
    projectId: "4",
    environment: {
      groundColor: "#c1440e",
      skyColor: "#e8a87c",
      fogColor: "#d4916a",
      ambientColor: "#ffccaa",
      particleColor: "#ff6644",
      features: ["rocks", "sand", "dust"],
    },
  },
  {
    id: "5",
    name: "Jupiter",
    name_ko: "목성",
    name_en: "Jupiter",
    size: 4.5,
    textureUrl: "/textures/planets/jupiter.jpg",
    position: [24, 9, -22],
    rotationSpeed: 0.005,
    environment: {
      groundColor: "#d4a06a",
      skyColor: "#c4956a",
      fogColor: "#e8c4a0",
      ambientColor: "#ffddbb",
      particleColor: "#ffaa66",
      features: ["clouds", "storms", "gas"],
    },
  },
  {
    id: "6",
    name: "Saturn",
    name_ko: "토성",
    name_en: "Saturn",
    size: 4.0,
    textureUrl: "/textures/planets/saturn.jpg",
    position: [-18, -11, -28],
    rotationSpeed: 0.004,
    hasRing: true,
    ringTextureUrl: "/textures/planets/saturn_ring.png",
    environment: {
      groundColor: "#e8d4a0",
      skyColor: "#f4e8c4",
      fogColor: "#fff0d4",
      ambientColor: "#ffffee",
      particleColor: "#ffee88",
      features: ["rings", "clouds", "wind"],
    },
  },
  {
    id: "7",
    name: "Uranus",
    name_ko: "천왕성",
    name_en: "Uranus",
    size: 2.8,
    textureUrl: "/textures/planets/uranus.jpg",
    position: [14, -9, 20],
    rotationSpeed: 0.002,
    environment: {
      groundColor: "#64b5c4",
      skyColor: "#88d4e4",
      fogColor: "#a4e4f0",
      ambientColor: "#ccffff",
      particleColor: "#88ffff",
      features: ["ice", "fog", "crystals"],
    },
  },
  {
    id: "8",
    name: "Neptune",
    name_ko: "해왕성",
    name_en: "Neptune",
    size: 3.0,
    textureUrl: "/textures/planets/neptune.jpg",
    position: [-6, 13, -32],
    rotationSpeed: 0.002,
    environment: {
      groundColor: "#3464a4",
      skyColor: "#4488cc",
      fogColor: "#5599dd",
      ambientColor: "#aaddff",
      particleColor: "#66aaff",
      features: ["storms", "wind", "ice"],
    },
  },
];

// Launch Bay style - front row for projects, back row for exploration
export const capsules: Capsule[] = [
  // Front row - Projects (closer to user, more prominent)
  {
    id: "1",
    projectId: "1",
    position: [-4.5, 0, -2],
    size: 1.1,
    color: "#8a8a8a",
    glowColor: "#aaaaaa",
    targetPlanetId: "1",
    label: "Mercury",
    label_ko: "수성",
    label_en: "Mercury",
  },
  {
    id: "2",
    projectId: "2",
    position: [-1.5, 0, -2],
    size: 1.1,
    color: "#ffa502",
    glowColor: "#ffcc44",
    targetPlanetId: "2",
    label: "Venus",
    label_ko: "금성",
    label_en: "Venus",
  },
  {
    id: "3",
    projectId: "3",
    position: [1.5, 0, -2],
    size: 1.1,
    color: "#2ed573",
    glowColor: "#7bed9f",
    targetPlanetId: "3",
    label: "Earth",
    label_ko: "지구",
    label_en: "Earth",
  },
  {
    id: "4",
    projectId: "4",
    position: [4.5, 0, -2],
    size: 1.1,
    color: "#ff4757",
    glowColor: "#ff6b81",
    targetPlanetId: "4",
    label: "Mars",
    label_ko: "화성",
    label_en: "Mars",
  },
  // Back row - Exploration planets (further back)
  {
    id: "0",
    projectId: "",
    position: [-6, 0, -5],
    size: 0.9,
    color: "#9a9a9a",
    glowColor: "#cccccc",
    targetPlanetId: "0",
    label: "Moon",
    label_ko: "달",
    label_en: "Moon",
  },
  {
    id: "5",
    projectId: "",
    position: [-3, 0, -5],
    size: 1.0,
    color: "#d4a06a",
    glowColor: "#ffaa66",
    targetPlanetId: "5",
    label: "Jupiter",
    label_ko: "목성",
    label_en: "Jupiter",
  },
  {
    id: "6",
    projectId: "",
    position: [0, 0, -5],
    size: 1.0,
    color: "#e8d4a0",
    glowColor: "#ffee88",
    targetPlanetId: "6",
    label: "Saturn",
    label_ko: "토성",
    label_en: "Saturn",
  },
  {
    id: "7",
    projectId: "",
    position: [3, 0, -5],
    size: 0.9,
    color: "#64b5c4",
    glowColor: "#88ffff",
    targetPlanetId: "7",
    label: "Uranus",
    label_ko: "천왕성",
    label_en: "Uranus",
  },
  {
    id: "8",
    projectId: "",
    position: [6, 0, -5],
    size: 0.9,
    color: "#3464a4",
    glowColor: "#66aaff",
    targetPlanetId: "8",
    label: "Neptune",
    label_ko: "해왕성",
    label_en: "Neptune",
  },
];
