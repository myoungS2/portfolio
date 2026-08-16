# 심미영 포트폴리오 사이트

Next.js 16 (App Router) + TypeScript + CSS Modules. 외부 UI/애니메이션 라이브러리 없이 프레임워크 기본 기능만 사용합니다.

디자인 원본: `../design_handoff_portfolio/` (라이트 & 미니멀 원페이지, 키링 최종본 포함). 색·타이포·간격·인터랙션은 그 README와 `심미영 포트폴리오.dc.html`의 인라인 값을 따릅니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 전체 페이지 정적 생성 검증
npx eslint .     # 린트
```

## 구조

원페이지(`/`) + 프로젝트 상세(`/works/[slug]`) 구성입니다.

| 섹션 | 앵커 | 담당 파일 |
|---|---|---|
| Nav (sticky) | — | `components/Header.tsx` |
| Hero + 키링 | `#top` | `app/page.tsx`, `components/HeroCharm.tsx` |
| 01 About | `#about` | `app/page.tsx`, `components/TypedText.tsx` |
| 02 Skills | `#skills` | `app/page.tsx` |
| 03 Works | `#works` | `app/page.tsx` |
| 04 Career | `#career` | `app/page.tsx` |
| 05 Contact + 푸터 | `#contact` | `components/Footer.tsx` |

**WORKS는 히어로 키링의 charm 4개와 1:1로 대응합니다.**

| charm | work | 슬러그 |
|---|---|---|
| 방패 | 비젠트로 | `/works/bizentro` |
| 트럭 | 경동택배 · 합동물류 | `/works/kdexp` |
| 국화 | 비앤비퓨너럴서비스 | `/works/bnb-funeral` |
| 플라밍고 | Plan&Go | `/works/plan-and-go` |

각 work는 여러 건을 담으므로(비젠트로 6건, 경동택배 2건) 상세 페이지에서 건별 `챕터`로 나누고, 챕터마다 `문제 / 설계 / 결과`로 서술합니다. 빌드 시 정적 생성됩니다.

## 콘텐츠 수정 — `data/` 만 고치면 됩니다

| 파일 | 내용 |
|---|---|
| `data/site.ts` | 이름·직무·연락처 / About 문구 / 기술 스택(`stacks`) / 할 줄 아는 일(`capabilities`) |
| `data/works.ts` | WORKS 4편. 홈 카드·상세 페이지·사이트맵이 모두 이 배열에서 생성됩니다 |
| `data/experience.ts` | Career(`career`)와 교육(`education`) |

### work 추가·수정

`works` 배열의 항목을 고치면 홈과 상세가 함께 바뀝니다.

- `slug` → 상세 페이지 주소(`/works/<slug>`), 빌드 시 정적 페이지 자동 생성
- `charm` → `shield | truck | daisy | flamingo`. 홈 카드의 시각 슬롯과 상세 헤더에 해당 charm 이미지가 들어갑니다
- `highlight` → 카드에 크게 박히는 핵심 성과 한 줄
- `chapters[]` → 건별 `문제 / 설계 / 결과`

charm을 늘리려면 `public/charms/`에 PNG를 추가하고, `CharmKey`·`HeroCharm`·`app/page.tsx`의 `charmImages` 맵에 키를 하나 더 넣으면 됩니다.

### Works 카드의 시각 슬롯

디자인 원안은 프로젝트 스크린샷 자리였습니다. 사내 시스템이라 공개 가능한 이미지가 없어, 해당 work의 charm 이미지와 핵심 성과 수치(`highlight`)를 넣어 히어로 키링과 시각적으로 연결했습니다.

### 연락처

`site.ts`의 `emailUser` / `emailDomain`이 분리돼 있고, `components/MailLink.tsx`가 브라우저에서 조립해 `mailto:`를 만듭니다. 생성된 HTML에 메일 주소가 남지 않습니다(스팸 크롤러 대응). 이 구조를 유지하려면 두 값을 합쳐 쓰지 마세요.

디자인의 `RESUME ↓` 링크는 배포할 PDF가 아직 없어 넣지 않았습니다. 추가하려면 `public/`에 PDF를 두고 `components/Footer.tsx`의 링크 행에 한 줄 추가하면 됩니다.

### 배포 주소

`site.ts`의 `url`이 OG 태그·사이트맵·robots.txt의 기준입니다. 실제 도메인이 정해지면 이 값을 먼저 바꾸세요.

## 디자인 토큰

`app/globals.css`의 `:root`에 모여 있습니다.

- 배경 `--bg` `#F7F8FA` / 카드·스트립 `--surface` `#FFFFFF` / 다크 푸터 `--dark` `#16181D`
- 텍스트 `--fg` → `--fg-sub` → `--fg-muted` → `--fg-faint`
- 보더 `--line` `#E4E7EC` (다크 위 `--line-dark` `#2D3138`)
- 액센트 `--accent` `oklch(0.58 0.14 250)`, 밝은 변형 `--accent-light`
- 폰트: 본문 Pretendard Variable(CDN), 디스플레이·숫자 Space Grotesk(`next/font/google`)

공용 클래스 `.section`(패딩 120/40 + max-width 1200 중앙), `.split`(180px 라벨 + 본문 2컬럼), `.label`(섹션 라벨)도 같은 파일에 있습니다.

## 모션

| 효과 | 구현 |
|---|---|
| 키링 스윙 ×4 | `HeroCharm.module.css` — 5 / 6 / 5.5 / 6.5s, 체인 시작점 기준 ±4° |
| 스크롤 화살표 | `page.module.css` `bounceDown` 1.6s |
| 푸터 워드마크 마퀴 | `Marquee.tsx` — 콘텐츠 2회 복제 후 `translateX(-50%)`, 화면 밖에서는 정지 |
| `<backend>` 타이핑 | `TypedText.tsx` — IntersectionObserver, 90ms/글자, 1회 |
| 섹션 리빌 | `Reveal.tsx` + `globals.css` `[data-reveal]` — opacity + translateY 32px, 0.8s |

`prefers-reduced-motion: reduce`에서 모든 애니메이션이 꺼지고 타이핑은 즉시 완성됩니다.

### 키링 교체

히어로 키링은 `components/HeroCharm.tsx` 하나로 격리돼 있습니다. 주변 레이아웃(타이틀·좌우 캡션·SCROLL DOWN)은 이 컴포넌트의 크기에 의존하지 않으므로, 파일만 교체하면 됩니다. 340×490 좌표계를 쓰고 화면이 좁거나 낮으면 `--scale-w` / `--scale-h` 중 작은 값으로 축소합니다.

에셋은 `public/charms/`의 투명 PNG 6종(clasp·ring·daisy·truck·flamingo·shield)이며 `design_handoff_portfolio` 번들을 그대로 씁니다. 배치·스윙 각도도 그 번들 `dc.html`의 인라인 값입니다.

- 링은 정면 원형 PNG를 `scaleY(0.62) rotate(-4deg)`로 눕혀 비스듬히 걸린 것처럼 보이게 합니다(`z-index: 0`으로 참 뒤).
- 참을 잇는 고리는 이미지가 아니라 **CSS 타원**(`.link` — border + inset 하이라이트)입니다.
- 그룹마다 `margin-left`가 달라 회전축이 링 위에 퍼지고, 그게 부챗살이 됩니다.

참을 바꾸려면 그룹 하나(`.link` + 참 `<Image>`)를 복제하고 `HeroCharm.module.css`에서 폭·고리 높이·`--tilt`(스윙 기준각)·counter-rotate만 조정하면 됩니다.

## 배포 (Vercel)

1. 이 폴더를 GitHub 저장소로 push
2. [vercel.com/new](https://vercel.com/new)에서 저장소 import
3. 저장소 루트가 아니라 `site/` 안에 프로젝트가 있으면 **Root Directory**를 `site`로 지정
4. 나머지는 기본값(Framework: Next.js) 그대로 Deploy
