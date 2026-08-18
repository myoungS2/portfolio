export const site = {
  name: "심미영",
  nameEn: "MEEYOUNG SIM",
  /** 푸터 워드마크용 (공백 없음) */
  wordmark: "MEEYOUNGSIM",
  role: "백엔드 개발자",
  roleEn: "JAVA BACKEND DEVELOPER",
  url: "https://myoung.world",
  locationFull: "SEOUL, KOREA",
  year: "2026",

  /**
   * About 제목. typed 부분만 스크롤 진입 시 한 글자씩 타이핑됩니다.
   * H1(MEEYOUNG SIM)과 겹치지 않도록 이름은 넣지 않습니다.
   */
  aboutHeading: {
    before: "기능 구현을 넘어 구조를 설계하는",
    typed: "<backend>",
    // typed 바로 뒤에 붙습니다(공백 없음)
    after: "개발자 심미영입니다.",
  },

  /** About 본문 */
  about: [
    "물류 회사의 인하우스 개발자로 시작해 IT 솔루션 전문기업에서 다양한 대내외 프로젝트를 거쳐 팀 전체의 개발 프로세스 혁신에 이르기까지 스스로 역할의 범위를 꾸준히 넓혀왔습니다. 이 과정에서 엉성한 아키텍처는 장애와 비효율을 낳지만, 제대로 잡은 탄탄한 구조는 시장과 고객의 변화에 유연하게 대처하는 강력한 자산이 된다는 것을 몸소 경험했습니다.",
    "이 경험을 살려 현재는 HR사업부에서 팀 전체의 개발 환경을 개선하고 있습니다. 협업 포털을 구축하여 14개 거래처의 버전·패치 관리를 체계화하고, AI Agent 기반 개발 워크플로우를 설계하여 부서 전체로 확산시켰습니다. 안정적인 구조 위에 속도를 더하는 이 방식으로, 변화가 빠른 대규모 서비스 환경에서도 지속가능한 시스템을 만드는 개발자가 되고자 합니다.",
  ],

  // 메일 주소는 크롤러가 그대로 긁어가지 않도록 조각으로 나눠 클라이언트에서 조립합니다.
  emailUser: "mythe1004",
  emailDomain: "gmail.com",
  github: "https://github.com/myoungS2",

} as const;

/** SKILLS — 기술 스택. 실제로 실무에서 쓴 것만 둡니다. */
export const stacks = [
  {
    label: "BACKEND",
    items: ["Java", "Spring Boot", "Spring Framework", "JPA", "MyBatis", "JSP"],
  },
  {
    label: "DATABASE",
    items: ["MySQL", "PostgreSQL", "MSSQL"],
  },
  {
    label: "INFRA · DEVOPS",
    items: ["Jenkins", "Linux", "Google Cloud Run", "Git", "SVN"],
  },
  {
    label: "FRONTEND",
    items: ["JavaScript", "jQuery", "React", "Bootstrap"],
  },
  {
    label: "AI",
    items: ["Claude Code", "MCP", "LLM 워크플로우 설계"],
  },
] as const;

/** SKILLS — 무엇을 할 줄 아는가. 스택 나열로는 안 보이는 부분입니다. */
export const capabilities = [
  {
    title: "완결형 개발",
    body: "요구사항 분석과 스펙 정의부터 DB 설계, 백엔드 구현, 배포, 현업 교육, 유지보수까지 한 사이클을 혼자 돌립니다.",
  },
  {
    title: "레거시 구조 개선",
    body: "Stored Procedure에 몰린 로직을 서비스 레이어로 분리하고, 타이밍에 기대던 코드를 예측 가능한 구조로 바꿉니다.",
  },
  {
    title: "데이터 구조 설계",
    body: "ERD 설계와 DB 간 마이그레이션, 쿼리 리팩토링으로 흩어진 데이터를 하나의 모델로 통합합니다.",
  },
  {
    title: "배포 · 형상 관리",
    body: "Jenkins 기반 빌드·배포 자동화와 버전·패치 추적 체계를 만들어 릴리스에서 사람 손을 덜어냅니다.",
  },
  {
    title: "장애 · 보안 대응",
    body: "증상이 아니라 원인을 구조에서 찾습니다. 권한 우회 취약점과 무증상 배치 장애를 직접 재현·규명하고 재발 방지까지 설계합니다.",
  },
  {
    title: "AI 개발 워크플로우",
    body: "직군별 AI 에이전트 워크플로우를 설계하고 교육으로 정착시켜, 팀의 실행 속도를 데이터로 추적합니다.",
  },
] as const;
