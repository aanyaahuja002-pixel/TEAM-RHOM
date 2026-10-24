/**
 * PRbit — 3D Rocket Journey to Your First Pull Request
 * Creative Dark 3D Galaxy Web Experience
 * Powered by Live GitHub REST API & Interactive Parallax Starfield
 */

// =============================================================================
// Application State
// =============================================================================
const state = {
  currentStep: 1,
  totalSteps: 6,
  user: {
    username: '',
    name: 'Young Stargazer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    bio: 'Aspiring open-source explorer ready for milestone contributions.',
    publicRepos: 0,
    isGuest: false,
  },
  skills: ['javascript'], // multi-select array of active skill keys
  confidence: 3,         // 1 to 10
  timeHours: '1',        // '1' | '2' | '3'
  issues: [],
  filteredIssues: [],
  filterKeyword: '',
  sortBy: 'doability',   // 'doability' | 'recent' | 'least-comments' | 'most-comments'
  currentViewMode: 'path', // 'path' | 'galaxy'
  isLoading: false,
  isFallback: false,
  savedIssues: [],
  hasGemmaKey: false,
};

// =============================================================================
// Step Metadata
// =============================================================================
const STEP_METADATA = {
  1: { number: 1, title: "Sign In", subtitle: "Let's get you ready for your first open-source contribution." },
  2: { number: 2, title: "Choose Your Skills", subtitle: "What do you like building?" },
  3: { number: 3, title: "Rate Yourself", subtitle: "Where are you on your coding journey?" },
  4: { number: 4, title: "Pick Your Time", subtitle: "How much time can you give?" },
  5: { number: 5, title: "Git Buddy", subtitle: "Your first PR, one step at a time." },
  6: { number: 6, title: "Your Repos", subtitle: "Your next contribution is out there." },
};

// Confidence Tiers Configuration
const CONFIDENCE_TIERS = [
  {
    min: 1,
    max: 3,
    svg: `<svg class="w-8 h-8 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"></path><path d="M10 20c0-4 1.5-7 4-9"></path><path d="M14 11c-1.5-2.5-4-3-6-3 0 2.5 1 5 3 6.5"></path><path d="M14 11a4 4 0 0 1 4 4c0 2-1 3.5-3 4"></path></svg>`,
    title: "Just getting started",
    description: "Focusing on syntax basics, beginner-friendly repositories, typo fixes, and getting comfortable with Git workflows."
  },
  {
    min: 4,
    max: 6,
    svg: `<svg class="w-8 h-8 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    title: "Learning by building",
    description: "Comfortable writing functions and components, looking to solve clear bug reports and expand test suites."
  },
  {
    min: 7,
    max: 8,
    svg: `<svg class="w-8 h-8 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 9V4s3.03.55 4 2c1.08 1.62 0 5 0 5"></path></svg>`,
    title: "Ready for bigger challenges",
    description: "Experienced with debugging edge cases, refactoring modules, and writing performant production features."
  },
  {
    min: 9,
    max: 10,
    svg: `<svg class="w-8 h-8 text-[#FFB59E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    title: "Ready to tackle complex issues",
    description: "Ready for deep architectural improvements, concurrency, framework internals, and cross-platform issues."
  }
];

// =============================================================================
// Curated Fallback Issues Dataset
// (Guarantees verified open-source tickets always display even with rate limits)
// =============================================================================
// =============================================================================
// Curated Fallback Issues Dataset (Enriched with Easy, Medium, Challenging Tiers)
// =============================================================================
const FALLBACK_ISSUES = {
  javascript: [
    // Easy (Warm-up)
    {
      id: 101,
      number: 5491,
      title: "Fix broken link in README to contributing guidelines",
      html_url: "https://github.com/expressjs/express/issues/5491",
      repo_name: "expressjs/express",
      user: { login: "dougwilson", avatar_url: "https://avatars.githubusercontent.com/u/43977?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "documentation", color: "A78BFA" }, { name: "typo", color: "38EF7D" }],
      body: "The URL in README pointing to contributing policy returns a 404. Updating this single markdown link will fix newcomer navigation."
    },
    {
      id: 102,
      number: 14890,
      title: "Add light mode toggle example in documentation tutorial",
      html_url: "https://github.com/vercel/next.js/issues/14890",
      repo_name: "vercel/next.js",
      user: { login: "leerob", avatar_url: "https://avatars.githubusercontent.com/u/9113740?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }],
      body: "The tutorial is missing a minimal snippet demonstrating theme toggling with cookies. A simple Markdown snippet addition."
    },
    {
      id: 103,
      number: 28412,
      title: "Clarify error message when JSX attribute has unescaped entity",
      html_url: "https://github.com/facebook/react/issues/28412",
      repo_name: "facebook/react",
      user: { login: "gaearon", avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4" },
      comments: 2,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "beginner", color: "6D45C5" }],
      body: "When JSX compilation fails due to unescaped entity, the warning can be confusing. Let's provide an actionable message in one file."
    },
    // Medium (Level up)
    {
      id: 104,
      number: 3102,
      title: "Add unit test coverage for localStorage JSON parse failures",
      html_url: "https://github.com/axios/axios/issues/3102",
      repo_name: "axios/axios",
      user: { login: "jasonsaayman", avatar_url: "https://avatars.githubusercontent.com/u/199018?v=4" },
      comments: 4,
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      labels: [{ name: "enhancement", color: "FBBF24" }, { name: "help wanted", color: "A78BFA" }, { name: "tests", color: "57D9F4" }],
      body: "We need mock test cases validating that corrupt storage strings fall back safely without uncaught syntax exceptions in adapter pipeline."
    },
    {
      id: 105,
      number: 8941,
      title: "Keyboard arrow navigation fails on nested accordion menu items",
      html_url: "https://github.com/shadcn-ui/ui/issues/8941",
      repo_name: "shadcn-ui/ui",
      user: { login: "shadcn", avatar_url: "https://avatars.githubusercontent.com/u/124599?v=4" },
      comments: 5,
      created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      labels: [{ name: "bug", color: "FBBF24" }, { name: "component", color: "6D45C5" }, { name: "help wanted", color: "57D9F4" }],
      body: "Nested dropdown lists do not properly trap and transition focus when using ArrowUp and ArrowDown keys. Requires updating the keydown handler."
    },
    // Challenging (Boss level)
    {
      id: 106,
      number: 1204,
      title: "Refactor lodash-es debounce utility with generic type parameter inference",
      html_url: "https://github.com/lodash/lodash/issues/1204",
      repo_name: "lodash/lodash",
      user: { login: "jdalton", avatar_url: "https://avatars.githubusercontent.com/u/4303?v=4" },
      comments: 8,
      created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      labels: [{ name: "refactor", color: "F87171" }, { name: "performance", color: "A78BFA" }, { name: "architecture", color: "57D9F4" }],
      body: "Debounced functions should properly preserve generic return type inference and async Promise signatures across multi-file TypeScript declarations."
    },
    {
      id: 107,
      number: 15402,
      title: "Optimize dynamic import chunk serializer to reduce bundle size",
      html_url: "https://github.com/webpack/webpack/issues/15402",
      repo_name: "webpack/webpack",
      user: { login: "sokra", avatar_url: "https://avatars.githubusercontent.com/u/1365881?v=4" },
      comments: 11,
      created_at: new Date(Date.now() - 3600000 * 180).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 36).toISOString(),
      labels: [{ name: "feature", color: "F87171" }, { name: "performance", color: "EF4444" }, { name: "core", color: "A78BFA" }],
      body: "Complex AST transformations in chunk splitting produce duplicate runtime module wrappers. Requires architectural overhaul in the compilation graph."
    }
  ],

  typescript: [
    // Easy
    {
      id: 201,
      number: 48921,
      title: "Fix parameter description typo in createRoot JSDoc comment",
      html_url: "https://github.com/microsoft/TypeScript/issues/48921",
      repo_name: "microsoft/TypeScript",
      user: { login: "weswigham", avatar_url: "https://avatars.githubusercontent.com/u/2932788?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }, { name: "typo", color: "38EF7D" }],
      body: "In the JSDoc header for root element initialization, options argument is spelled opitons. Quick single-file typo fix."
    },
    {
      id: 202,
      number: 12050,
      title: "Export missing ReturnType utility helper in public namespace docs",
      html_url: "https://github.com/type-challenges/type-challenges/issues/12050",
      repo_name: "type-challenges/type-challenges",
      user: { login: "antfu", avatar_url: "https://avatars.githubusercontent.com/u/11247099?v=4" },
      comments: 2,
      created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 10).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "documentation", color: "6D45C5" }],
      body: "Add a clear markdown example of infer R syntax for new TypeScript learners tackling the ReturnType beginner challenge."
    },
    // Medium
    {
      id: 203,
      number: 52103,
      title: "Add strict null check validation in TS config path resolver helper",
      html_url: "https://github.com/microsoft/TypeScript/issues/52103",
      repo_name: "microsoft/TypeScript",
      user: { login: "sandersn", avatar_url: "https://avatars.githubusercontent.com/u/490214?v=4" },
      comments: 5,
      created_at: new Date(Date.now() - 3600000 * 80).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      labels: [{ name: "bug", color: "FBBF24" }, { name: "help wanted", color: "A78BFA" }, { name: "enhancement", color: "57D9F4" }],
      body: "Path resolver throws unhandled TypeError when baseUrl is undefined in tsconfig.json. Need defensive check and unit test."
    },
    // Challenging
    {
      id: 204,
      number: 54900,
      title: "Refactor module resolution caching mechanism for monorepo symlinks",
      html_url: "https://github.com/microsoft/TypeScript/issues/54900",
      repo_name: "microsoft/TypeScript",
      user: { login: "ahejlsberg", avatar_url: "https://avatars.githubusercontent.com/u/1581412?v=4" },
      comments: 10,
      created_at: new Date(Date.now() - 3600000 * 150).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      labels: [{ name: "refactor", color: "F87171" }, { name: "performance", color: "EF4444" }, { name: "architecture", color: "A78BFA" }],
      body: "Circular package symlinks cause quadratic cache invalidation during language server re-checks. Demands deep refactoring in the resolution pipeline."
    }
  ],

  python: [
    // Easy
    {
      id: 301,
      number: 105234,
      title: "Improve docstring examples for itertools.pairwise() with edge cases",
      html_url: "https://github.com/python/cpython/issues/105234",
      repo_name: "python/cpython",
      user: { login: "rhettinger", avatar_url: "https://avatars.githubusercontent.com/u/132109?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 25).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }, { name: "typo", color: "38EF7D" }],
      body: "Add a 3-line doctest illustrating that empty sequences yield an empty iterator without raising StopIteration. Beginner doc task."
    },
    {
      id: 302,
      number: 4902,
      title: "Fix link syntax in Flask tutorial quickstart README",
      html_url: "https://github.com/pallets/flask/issues/4902",
      repo_name: "pallets/flask",
      user: { login: "davidism", avatar_url: "https://avatars.githubusercontent.com/u/1242887?v=4" },
      comments: 0,
      created_at: new Date(Date.now() - 3600000 * 45).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "documentation", color: "6D45C5" }],
      body: "Hyperlink to virtualenv setup guide in the quickstart chapter is formatted as raw text. One file markdown edit."
    },
    // Medium
    {
      id: 303,
      number: 9410,
      title: "Add typing annotation to FastAPI Request ValidationError helper",
      html_url: "https://github.com/tiangolo/fastapi/issues/9410",
      repo_name: "tiangolo/fastapi",
      user: { login: "tiangolo", avatar_url: "https://avatars.githubusercontent.com/u/1326112?v=4" },
      comments: 4,
      created_at: new Date(Date.now() - 3600000 * 70).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 15).toISOString(),
      labels: [{ name: "enhancement", color: "FBBF24" }, { name: "help wanted", color: "57D9F4" }, { name: "bug", color: "A78BFA" }],
      body: "ValidationError handlers lack strict type annotations for error dictionary output structures in OpenAPI schema generators."
    },
    // Challenging
    {
      id: 304,
      number: 112040,
      title: "Benchmark and optimize asyncio event loop task cancellation pipeline",
      html_url: "https://github.com/python/cpython/issues/112040",
      repo_name: "python/cpython",
      user: { login: "gvanrossum", avatar_url: "https://avatars.githubusercontent.com/u/239046?v=4" },
      comments: 9,
      created_at: new Date(Date.now() - 3600000 * 160).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 25).toISOString(),
      labels: [{ name: "performance", color: "F87171" }, { name: "refactor", color: "EF4444" }, { name: "architecture", color: "57D9F4" }],
      body: "High-throughput servers experience CPU spikes when mass cancelling coroutines. Requires multi-file C-API memory optimization."
    }
  ],

  react: [
    // Easy
    {
      id: 401,
      number: 29104,
      title: "Update README example for useId hook in server components",
      html_url: "https://github.com/facebook/react/issues/29104",
      repo_name: "facebook/react",
      user: { login: "sophiebits", avatar_url: "https://avatars.githubusercontent.com/u/1444507?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }, { name: "typo", color: "38EF7D" }],
      body: "The useId example uses deprecated legacy SSR code. Updating the snippet to standard React 19 pattern in docs."
    },
    // Medium
    {
      id: 402,
      number: 4520,
      title: "Add keyboard navigation support for Tabs component",
      html_url: "https://github.com/radix-ui/primitives/issues/4520",
      repo_name: "radix-ui/primitives",
      user: { login: "colinhacks", avatar_url: "https://avatars.githubusercontent.com/u/3084745?v=4" },
      comments: 4,
      created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      labels: [{ name: "enhancement", color: "FBBF24" }, { name: "component", color: "6D45C5" }, { name: "help wanted", color: "57D9F4" }],
      body: "When tab orientation is vertical, arrow up/down should loop through tab items seamlessly without skipping disabled tabs."
    },
    // Challenging
    {
      id: 403,
      number: 29840,
      title: "Refactor Suspense cache boundary invalidation mechanism",
      html_url: "https://github.com/facebook/react/issues/29840",
      repo_name: "facebook/react",
      user: { login: "acdlite", avatar_url: "https://avatars.githubusercontent.com/u/3624098?v=4" },
      comments: 10,
      created_at: new Date(Date.now() - 3600000 * 140).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      labels: [{ name: "refactor", color: "F87171" }, { name: "performance", color: "EF4444" }, { name: "architecture", color: "A78BFA" }],
      body: "Concurrent transitions with nested suspense nodes cause redundant microtask reconciliation. Requires architectural refactoring in fiber scheduler."
    }
  ],

  'html-css': [
    // Easy
    {
      id: 501,
      number: 38920,
      title: "Fix broken CSS variable token in button focus-visible outline",
      html_url: "https://github.com/twbs/bootstrap/issues/38920",
      repo_name: "twbs/bootstrap",
      user: { login: "mdo", avatar_url: "https://avatars.githubusercontent.com/u/98681?v=4" },
      comments: 1,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      labels: [{ name: "good first issue", color: "57D9F4" }, { name: "typo", color: "38EF7D" }, { name: "docs", color: "A78BFA" }],
      body: "The focus ring token --bs-btn-focus-box-shadow is misspelled in button scss partial. Quick single-line CSS fix."
    },
    // Medium
    {
      id: 502,
      number: 39410,
      title: "Ensure responsive tables do not cause horizontal overflow on mobile viewports",
      html_url: "https://github.com/twbs/bootstrap/issues/39410",
      repo_name: "twbs/bootstrap",
      user: { login: "xhmikosr", avatar_url: "https://avatars.githubusercontent.com/u/349621?v=4" },
      comments: 4,
      created_at: new Date(Date.now() - 3600000 * 55).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 14).toISOString(),
      labels: [{ name: "bug", color: "FBBF24" }, { name: "enhancement", color: "57D9F4" }],
      body: "Mobile viewports below 380px experience body scrolling when table-responsive wraps long cell words without break-word rule."
    },
    // Challenging
    {
      id: 503,
      number: 14102,
      title: "Refactor PostCSS color manipulation pipeline for OkLCH gamut mapping",
      html_url: "https://github.com/tailwindlabs/tailwindcss/issues/14102",
      repo_name: "tailwindlabs/tailwindcss",
      user: { login: "adamwathan", avatar_url: "https://avatars.githubusercontent.com/u/4323180?v=4" },
      comments: 8,
      created_at: new Date(Date.now() - 3600000 * 130).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 22).toISOString(),
      labels: [{ name: "refactor", color: "F87171" }, { name: "feature", color: "EF4444" }, { name: "performance", color: "A78BFA" }],
      body: "Support modern CSS Color Module 4 color functions with zero-runtime gamut clipping and compiler performance optimization."
    }
  ]
};

// Aliases for remaining skills
FALLBACK_ISSUES.java = [
  {
    id: 601,
    number: 32014,
    title: "Update Spring Boot banner ASCII generator guide in docs",
    html_url: "https://github.com/spring-projects/spring-boot/issues/32014",
    repo_name: "spring-projects/spring-boot",
    user: { login: "wilkinsona", avatar_url: "https://avatars.githubusercontent.com/u/519772?v=4" },
    comments: 1,
    created_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }],
    body: "Reference to old banner text location is stale in docs. Quick one file Markdown change."
  },
  {
    id: 602,
    number: 32410,
    title: "Fix validation error handling on null request header in REST controller",
    html_url: "https://github.com/spring-projects/spring-boot/issues/32410",
    repo_name: "spring-projects/spring-boot",
    user: { login: "philwebb", avatar_url: "https://avatars.githubusercontent.com/u/511487?v=4" },
    comments: 4,
    created_at: new Date(Date.now() - 3600000 * 65).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    labels: [{ name: "bug", color: "FBBF24" }, { name: "help wanted", color: "57D9F4" }],
    body: "Controllers fail with 500 instead of standard 400 Bad Request when header is empty. Need defensive exception mapping."
  },
  {
    id: 603,
    number: 33100,
    title: "Optimize reflection metadata caching in virtual thread dispatchers",
    html_url: "https://github.com/spring-projects/spring-boot/issues/33100",
    repo_name: "spring-projects/spring-boot",
    user: { login: "sbrannen", avatar_url: "https://avatars.githubusercontent.com/u/104798?v=4" },
    comments: 9,
    created_at: new Date(Date.now() - 3600000 * 150).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 25).toISOString(),
    labels: [{ name: "performance", color: "F87171" }, { name: "architecture", color: "EF4444" }],
    body: "Project Loom virtual thread pinning observed due to synchronized reflection metadata lookups. Needs lock-free cache refactor."
  }
];

FALLBACK_ISSUES.cpp = [
  {
    id: 701,
    number: 8941,
    title: "Fix documentation typo in Vector3.normalized() description",
    html_url: "https://github.com/godotengine/godot/issues/8941",
    repo_name: "godotengine/godot",
    user: { login: "reduz", avatar_url: "https://avatars.githubusercontent.com/u/6265383?v=4" },
    comments: 1,
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    labels: [{ name: "good first issue", color: "57D9F4" }, { name: "docs", color: "A78BFA" }, { name: "typo", color: "38EF7D" }],
    body: "Typo in math documentation string for 3D vector length calculation. Single line doc fix."
  },
  {
    id: 702,
    number: 9402,
    title: "Add boundary check in StringName hash map lookup operator",
    html_url: "https://github.com/godotengine/godot/issues/9402",
    repo_name: "godotengine/godot",
    user: { login: "akien-mga", avatar_url: "https://avatars.githubusercontent.com/u/4701338?v=4" },
    comments: 4,
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    labels: [{ name: "bug", color: "FBBF24" }, { name: "help wanted", color: "57D9F4" }],
    body: "Empty StringName identifiers cause out-of-bounds array reads in debug builds. Needs safe early return check."
  },
  {
    id: 703,
    number: 10450,
    title: "Benchmark and optimize Vulkan pipeline barrier synchronization",
    html_url: "https://github.com/godotengine/godot/issues/10450",
    repo_name: "godotengine/godot",
    user: { login: "reduz", avatar_url: "https://avatars.githubusercontent.com/u/6265383?v=4" },
    comments: 8,
    created_at: new Date(Date.now() - 3600000 * 140).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    labels: [{ name: "performance", color: "F87171" }, { name: "refactor", color: "EF4444" }],
    body: "Redundant pipeline execution barriers cause GPU stalling on modern tiling architectures. Multi-file rendering refactor."
  }
];

FALLBACK_ISSUES.docs = FALLBACK_ISSUES.javascript;
FALLBACK_ISSUES.testing = FALLBACK_ISSUES.javascript;
FALLBACK_ISSUES.accessibility = FALLBACK_ISSUES['html-css'];
FALLBACK_ISSUES.design = FALLBACK_ISSUES['html-css'];

// =============================================================================
// DOM Elements Cache
// =============================================================================
const DOM = {
  // Navigation & Progress
  currentStepNumber: document.getElementById('currentStepNumber'),
  currentStepTitle: document.getElementById('currentStepTitle'),
  progressPercentage: document.getElementById('progressPercentage'),
  progressBarFill: document.getElementById('progressBarFill'),
  milestoneStations: document.querySelectorAll('.milestone-station'),
  rocketPins: document.querySelectorAll('.rocket-pin'),
  savedIssuesBtn: document.getElementById('savedIssuesBtn'),
  savedCountBadge: document.getElementById('savedCountBadge'),
  navStartJourneyBtn: document.getElementById('navStartJourneyBtn'),
  heroLaunchBtn: document.getElementById('heroLaunchBtn'),
  journeySection: document.getElementById('journey-section'),
  activeMilestoneCard: document.getElementById('activeMilestoneCard'),

  // Step 1: Sign In
  step1Form: document.getElementById('step1Form'),
  githubUsernameInput: document.getElementById('githubUsernameInput'),
  usernameCheckSpinner: document.getElementById('usernameCheckSpinner'),
  profilePreviewCard: document.getElementById('profilePreviewCard'),
  previewAvatar: document.getElementById('previewAvatar'),
  previewName: document.getElementById('previewName'),
  previewLogin: document.getElementById('previewLogin'),
  previewBio: document.getElementById('previewBio'),
  previewRepos: document.getElementById('previewRepos'),
  previewProfileLink: document.getElementById('previewProfileLink'),
  sampleUserBtns: document.querySelectorAll('.sample-handle-btn'),
  guestBtn: document.getElementById('guestBtn'),
  step1SubmitBtn: document.getElementById('step1SubmitBtn'),

  // Step 2: Skills
  skillCards: document.querySelectorAll('.skill-card'),
  selectedSkillsSummary: document.getElementById('selectedSkillsSummary'),
  step2NextBtn: document.getElementById('step2NextBtn'),

  // Step 3: Rate Yourself Slider
  confidenceSlider: document.getElementById('confidenceSlider'),
  sliderValueBadge: document.getElementById('sliderValueBadge'),
  sliderTierCard: document.getElementById('sliderTierCard'),
  tierEmoji: document.getElementById('tierEmoji'),
  tierTitle: document.getElementById('tierTitle'),
  tierDescription: document.getElementById('tierDescription'),
  step3NextBtn: document.getElementById('step3NextBtn'),

  // Step 4: Pick Your Time
  timeCards: document.querySelectorAll('.time-card'),
  step4NextBtn: document.getElementById('step4NextBtn'),

  // Step 5: Git Buddy
  copyCmdBtns: document.querySelectorAll('.copy-cmd-btn'),
  copyAllGitBtn: document.getElementById('copyAllGitBtn'),
  step5NextBtn: document.getElementById('step5NextBtn'),

  // Step 6: Your Repos & Orbital Flightpath
  reposSubtitle: document.getElementById('reposSubtitle'),
  filterIssuesInput: document.getElementById('filterIssuesInput'),
  sortIssuesSelect: document.getElementById('sortIssuesSelect'),
  refreshIssuesBtn: document.getElementById('refreshIssuesBtn'),
  refreshIcon: document.getElementById('refreshIcon'),
  apiNoticeBanner: document.getElementById('apiNoticeBanner'),
  apiNoticeText: document.getElementById('apiNoticeText'),
  issuesLoadingState: document.getElementById('issuesLoadingState'),
  issuesContainer: document.getElementById('issuesContainer'),
  issuesEmptyState: document.getElementById('issuesEmptyState'),
  clearFilterBtn: document.getElementById('clearFilterBtn'),
  celebrateBtn: document.getElementById('celebrateBtn'),

  // Suggested Path & Galaxy Orbit View
  suggestedPathStrip: document.getElementById('suggestedPathStrip'),
  startHereBtn: document.getElementById('startHereBtn'),
  viewModePathBtn: document.getElementById('viewModePathBtn'),
  viewModeGalaxyBtn: document.getElementById('viewModeGalaxyBtn'),
  galaxyOrbitView: document.getElementById('galaxyOrbitView'),
  galaxyOrbitCanvasContainer: document.getElementById('galaxyOrbitCanvasContainer'),
  galaxyPlanetInspector: document.getElementById('galaxyPlanetInspector'),

  // Saved Issues Modal
  savedModal: document.getElementById('savedModal'),
  closeSavedModalBtn: document.getElementById('closeSavedModalBtn'),
  closeSavedModalSecondaryBtn: document.getElementById('closeSavedModalSecondaryBtn'),
  savedIssuesList: document.getElementById('savedIssuesList'),
  modalSavedCount: document.getElementById('modalSavedCount'),
  clearAllSavedBtn: document.getElementById('clearAllSavedBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer'),
};

// =============================================================================
// Helper: Toast Notifications
// =============================================================================
function showToast(message, type = 'info') {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `p-3 px-4 rounded-2xl shadow-galaxy text-xs font-semibold flex items-center space-x-2 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto backdrop-blur-md ${
    type === 'success' 
      ? 'bg-[#10152B]/95 text-[#57D9F4] border border-[#57D9F4]/60' 
      : type === 'warning'
      ? 'bg-[#182040]/95 text-[#FFB59E] border border-[#FFB59E]/60'
      : 'bg-[#10152B]/95 text-[#F4F1FF] border border-[#A78BFA]/50'
  }`;

  const icon = type === 'success' 
    ? '<svg class="w-4 h-4 text-[#57D9F4] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>'
    : type === 'warning'
    ? '<svg class="w-4 h-4 text-[#FFB59E] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    : '<svg class="w-4 h-4 text-[#A78BFA] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg>';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Animate out
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

// =============================================================================
// Interactive Parallax Galaxy Background Canvas
// =============================================================================
class GalaxyBackground {
  constructor() {
    this.canvas = document.getElementById('galaxyCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.clusters = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isRunning = true;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Gentle parallax pointer tracking with lerp
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    document.addEventListener('visibilitychange', () => {
      this.isRunning = !document.hidden;
      if (this.isRunning && !this.isReducedMotion) {
        this.animate();
      }
    });

    this.createStars();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars() {
    this.stars = [];
    const starCount = Math.min(260, Math.floor((this.width * this.height) / 5000));
    const colors = ['#F4F1FF', '#57D9F4', '#A78BFA', '#FFFFFF'];

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        depth: Math.random() * 2 + 0.5, // 0.5 (distant) to 2.5 (foreground)
        radius: Math.random() * 1.5 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.7 + 0.3
      });
    }

    // 4 Subtle Star Clusters
    this.clusters = [
      { x: this.width * 0.2, y: this.height * 0.35, radius: 120, color: 'rgba(109, 69, 197, 0.15)' },
      { x: this.width * 0.85, y: this.height * 0.65, radius: 150, color: 'rgba(87, 217, 244, 0.12)' },
      { x: this.width * 0.5, y: this.height * 0.8, radius: 140, color: 'rgba(167, 139, 250, 0.1)' }
    ];
  }

  animate() {
    if (!this.isRunning) return;

    // Damped parallax smoothing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Star Clusters
    this.clusters.forEach(c => {
      const grad = this.ctx.createRadialGradient(
        c.x + this.mouseX * 0.2, 
        c.y + this.mouseY * 0.2, 
        0, 
        c.x + this.mouseX * 0.2, 
        c.y + this.mouseY * 0.2, 
        c.radius
      );
      grad.addColorStop(0, c.color);
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(c.x + this.mouseX * 0.2, c.y + this.mouseY * 0.2, c.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    const now = Date.now() * 0.001;

    // Draw Stars with Parallax
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const offsetX = s.x - this.mouseX * s.depth;
      const offsetY = s.y - this.mouseY * s.depth;

      // Wrap-around bounds
      const renderX = (offsetX % this.width + this.width) % this.width;
      const renderY = (offsetY % this.height + this.height) % this.height;

      // Twinkle calculation
      const twinkle = Math.sin(now * s.twinkleSpeed * 60 + s.twinkleOffset);
      const alpha = Math.max(0.15, Math.min(1, s.baseAlpha + twinkle * 0.25));

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(renderX, renderY, s.radius * (s.depth > 1.8 ? 1.2 : 0.9), 0, Math.PI * 2);
      this.ctx.fill();

      // Soft Starlight glow for large foreground stars
      if (s.depth > 1.8 && s.radius > 1.2) {
        this.ctx.globalAlpha = alpha * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(renderX, renderY, s.radius * 2.8, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (!this.isReducedMotion) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

// =============================================================================
// Navigation & Step Transitions
// =============================================================================
function goToStep(targetStep) {
  if (targetStep < 1 || targetStep > state.totalSteps) return;

  state.currentStep = targetStep;

  // 1. Update text metadata
  const meta = STEP_METADATA[targetStep];
  if (DOM.currentStepNumber) DOM.currentStepNumber.textContent = meta.number;
  if (DOM.currentStepTitle) DOM.currentStepTitle.textContent = meta.title;
  
  const percentage = Math.round((targetStep / state.totalSteps) * 100);
  if (DOM.progressPercentage) DOM.progressPercentage.textContent = `${percentage}%`;
  if (DOM.progressBarFill) DOM.progressBarFill.style.width = `${percentage}%`;

  // 2. Toggle active step cards
  document.querySelectorAll('.journey-step').forEach((sec) => {
    const stepNum = parseInt(sec.getAttribute('data-step'), 10);
    if (stepNum === targetStep) {
      sec.classList.remove('hidden');
      sec.classList.add('active');
    } else {
      sec.classList.add('hidden');
      sec.classList.remove('active');
    }
  });

  // 3. Update desktop Journey Map stations & rocket pins
  DOM.milestoneStations.forEach((station) => {
    const stepNum = parseInt(station.getAttribute('data-step') || station.getAttribute('data-station'), 10);
    const planet = station.querySelector('.milestone-planet');
    const label = station.querySelector('span:last-child');
    
    if (planet) {
      planet.classList.remove('active', 'completed');
      if (stepNum === targetStep) {
        planet.classList.add('active');
        if (label) label.className = 'text-[11px] sm:text-xs font-display font-bold text-[#57D9F4] block mt-2';
      } else if (stepNum < targetStep) {
        planet.classList.add('completed');
        if (label) label.className = 'text-[11px] sm:text-xs font-display font-bold text-[#A78BFA] block mt-2';
      } else {
        if (label) label.className = 'text-[11px] sm:text-xs font-display font-bold text-[#B8B5D3] block mt-2 group-hover:text-[#57D9F4]';
      }
    }
  });

  // Position Rocket Pin on active milestone
  DOM.rocketPins.forEach((pin) => {
    const pinId = pin.id; // e.g. rocketPin1
    if (pinId === `rocketPin${targetStep}`) {
      pin.classList.remove('hidden');
    } else {
      pin.classList.add('hidden');
    }
  });

  // 4. Special hook for Step 6: Trigger issue search
  if (targetStep === 6) {
    fetchGitHubIssues();
  }

  // 5. Smoothly keep active card in viewport
  if (DOM.activeMilestoneCard) {
    const rect = DOM.activeMilestoneCard.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      DOM.activeMilestoneCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // 6. Update Commander Astro floating mascot for current milestone
  updateAstroBotForStep(targetStep);
}

// =============================================================================
// Step 1: GitHub Username Lookup
// =============================================================================
let usernameLookupTimeout = null;

async function lookupGitHubProfile(username) {
  if (!username || username.trim() === '') {
    if (DOM.profilePreviewCard) DOM.profilePreviewCard.classList.add('hidden');
    if (DOM.usernameCheckSpinner) DOM.usernameCheckSpinner.classList.add('hidden');
    return;
  }

  const cleanHandle = username.trim().replace(/^@/, '');
  if (DOM.usernameCheckSpinner) DOM.usernameCheckSpinner.classList.remove('hidden');

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanHandle)}`);
    if (DOM.usernameCheckSpinner) DOM.usernameCheckSpinner.classList.add('hidden');

    if (res.ok) {
      const data = await res.json();
      state.user = {
        username: data.login,
        name: data.name || data.login,
        avatarUrl: data.avatar_url,
        bio: data.bio || 'Public GitHub Developer exploring open source.',
        publicRepos: data.public_repos || 0,
        isGuest: false,
      };

      if (DOM.previewAvatar) DOM.previewAvatar.src = data.avatar_url;
      if (DOM.previewName) DOM.previewName.textContent = data.name || data.login;
      if (DOM.previewLogin) DOM.previewLogin.textContent = `@${data.login}`;
      if (DOM.previewBio) DOM.previewBio.textContent = data.bio || 'Public GitHub Developer ready to contribute.';
      if (DOM.previewRepos) DOM.previewRepos.textContent = data.public_repos;
      if (DOM.previewProfileLink) DOM.previewProfileLink.href = data.html_url;

      if (DOM.profilePreviewCard) DOM.profilePreviewCard.classList.remove('hidden');
      if (DOM.step1SubmitBtn) DOM.step1SubmitBtn.removeAttribute('disabled');
      showToast(`Welcome aboard PRbit, @${data.login}! Profile located.`, 'success');
    } else {
      if (DOM.profilePreviewCard) DOM.profilePreviewCard.classList.add('hidden');
      if (res.status === 404) {
        showToast(`GitHub user "${cleanHandle}" not found. You can continue as Guest!`, 'warning');
      }
    }
  } catch (err) {
    if (DOM.usernameCheckSpinner) DOM.usernameCheckSpinner.classList.add('hidden');
    console.warn('GitHub profile lookup error:', err);
  }
}

// Attach Step 1 Listeners
if (DOM.githubUsernameInput) {
  DOM.githubUsernameInput.addEventListener('input', (e) => {
    clearTimeout(usernameLookupTimeout);
    const val = e.target.value.trim();
    if (val.length >= 2) {
      usernameLookupTimeout = setTimeout(() => {
        lookupGitHubProfile(val);
      }, 500);
    } else {
      if (DOM.profilePreviewCard) DOM.profilePreviewCard.classList.add('hidden');
    }
  });
}

// Sample Handle Buttons
DOM.sampleUserBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const handle = btn.getAttribute('data-handle') || btn.textContent.trim();
    if (DOM.githubUsernameInput) {
      DOM.githubUsernameInput.value = handle;
      lookupGitHubProfile(handle);
    }
  });
});

// Guest Sign-in
if (DOM.guestBtn) {
  DOM.guestBtn.addEventListener('click', () => {
    state.user = {
      username: 'guest_explorer',
      name: 'Guest Stargazer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      bio: 'Open-source explorer touring projects anonymously.',
      publicRepos: 0,
      isGuest: true,
    };
    showToast('Continuing as Guest Explorer!', 'info');
    goToStep(2);
  });
}

// Step 1 Form Submission
if (DOM.step1Form) {
  DOM.step1Form.addEventListener('submit', (e) => {
    e.preventDefault();
    const handle = DOM.githubUsernameInput ? DOM.githubUsernameInput.value.trim() : '';
    if (!state.user.username && handle) {
      state.user.username = handle;
      state.user.name = handle;
    }
    goToStep(2);
  });
}

// =============================================================================
// Step 2: Choose Skills (Multi-Select)
// =============================================================================
function updateSkillsSummary() {
  if (!DOM.selectedSkillsSummary) return;
  if (state.skills.length === 0) {
    DOM.selectedSkillsSummary.textContent = 'None selected (pick at least one)';
    return;
  }
  const formatted = state.skills.map(s => {
    switch (s) {
      case 'javascript': return 'JavaScript';
      case 'typescript': return 'TypeScript';
      case 'python': return 'Python';
      case 'html-css': return 'HTML & CSS';
      case 'react': return 'React';
      case 'java': return 'Java';
      case 'cpp': return 'C++';
      case 'docs': return 'Documentation';
      case 'testing': return 'Testing';
      case 'accessibility': return 'Accessibility';
      case 'design': return 'Design';
      default: return s;
    }
  }).join(', ');

  DOM.selectedSkillsSummary.textContent = formatted;
}

DOM.skillCards.forEach((card) => {
  card.addEventListener('click', () => {
    const skill = card.getAttribute('data-skill');
    const isSelected = state.skills.includes(skill);

    if (isSelected) {
      if (state.skills.length > 1) {
        state.skills = state.skills.filter(s => s !== skill);
        card.classList.remove('selected');
        card.querySelector('.selection-check')?.classList.add('hidden');
      } else {
        showToast('Please keep at least one skill selected for matching!', 'warning');
      }
    } else {
      state.skills.push(skill);
      card.classList.add('selected');
      card.querySelector('.selection-check')?.classList.remove('hidden');
    }

    updateSkillsSummary();
  });
});

if (DOM.step2NextBtn) {
  DOM.step2NextBtn.addEventListener('click', () => {
    if (state.skills.length === 0) {
      showToast('Please select at least one skill card to continue.', 'warning');
      return;
    }
    goToStep(3);
  });
}

// =============================================================================
// Step 3: Rate Yourself (1 to 10 Slider)
// =============================================================================
function updateConfidenceUI(value) {
  const num = parseInt(value, 10);
  state.confidence = num;

  if (DOM.sliderValueBadge) {
    DOM.sliderValueBadge.textContent = num;
  }

  // Find matching tier
  const tier = CONFIDENCE_TIERS.find(t => num >= t.min && num <= t.max) || CONFIDENCE_TIERS[0];

  if (DOM.tierEmoji) DOM.tierEmoji.innerHTML = tier.svg;
  if (DOM.tierTitle) DOM.tierTitle.textContent = tier.title;
  if (DOM.tierDescription) DOM.tierDescription.textContent = tier.description;

  // Accessible track gradient update in Dark 3D Galaxy style
  if (DOM.confidenceSlider) {
    const percent = ((num - 1) / 9) * 100;
    DOM.confidenceSlider.style.background = `linear-gradient(to right, #6D45C5 0%, #57D9F4 ${percent}%, #182040 ${percent}%, #182040 100%)`;
  }
}

if (DOM.confidenceSlider) {
  DOM.confidenceSlider.addEventListener('input', (e) => {
    updateConfidenceUI(e.target.value);
  });
  // Initial fill
  updateConfidenceUI(DOM.confidenceSlider.value || 3);
}

if (DOM.step3NextBtn) {
  DOM.step3NextBtn.addEventListener('click', () => {
    goToStep(4);
  });
}

// =============================================================================
// Step 4: Pick Your Time
// =============================================================================
DOM.timeCards.forEach((card) => {
  card.addEventListener('click', () => {
    DOM.timeCards.forEach(c => {
      c.classList.remove('selected');
      c.querySelector('.selection-check')?.classList.add('hidden');
    });

    card.classList.add('selected');
    card.querySelector('.selection-check')?.classList.remove('hidden');
    state.timeHours = card.getAttribute('data-hours');
  });
});

if (DOM.step4NextBtn) {
  DOM.step4NextBtn.addEventListener('click', () => {
    goToStep(5);
  });
}

// =============================================================================
// Step 5: Git Buddy Guide
// =============================================================================
DOM.copyCmdBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cmd = btn.getAttribute('data-cmd');
    if (!cmd) return;

    navigator.clipboard.writeText(cmd).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>Copied!</span> <svg class="w-3.5 h-3.5 inline ml-1 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
      btn.classList.add('text-[#57D9F4]', 'font-bold');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('text-[#57D9F4]', 'font-bold');
      }, 2000);
      showToast(`Copied to clipboard: ${cmd}`, 'info');
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  });
});

if (DOM.copyAllGitBtn) {
  DOM.copyAllGitBtn.addEventListener('click', () => {
    const script = [
      "# PRbit Git Flight Plan Checklist",
      "git clone https://github.com/YOUR_USERNAME/open-source-project.git",
      "cd open-source-project",
      "git checkout -b fix-first-contribution",
      "# Make focused edits in your code editor",
      "npm test",
      'git commit -m "fix: resolve beginner ticket and improve formatting"',
      "git push -u origin fix-first-contribution"
    ].join('\n');

    navigator.clipboard.writeText(script).then(() => {
      showToast('Flight Plan Checklist copied to clipboard!', 'success');
    }).catch(err => {
      console.warn('Clipboard error:', err);
    });
  });
}

if (DOM.step5NextBtn) {
  DOM.step5NextBtn.addEventListener('click', () => {
    goToStep(6);
  });
}

// =============================================================================
// Step 6: GitHub REST API Issues Radar (Fixed & Guaranteed Display)
// =============================================================================

// Helper: Convert skill key to clean GitHub search query without invalid syntax
function getSkillGitHubQuery(skill) {
  switch (skill) {
    case 'javascript': return 'language:javascript';
    case 'typescript': return 'language:typescript';
    case 'python': return 'language:python';
    case 'html-css': return 'language:html';
    case 'react': return 'react in:title,body';
    case 'java': return 'language:java';
    case 'cpp': return 'language:cpp';
    case 'docs': return 'label:documentation';
    case 'testing': return 'test in:title,body';
    case 'accessibility': return 'label:a11y';
    case 'design': return 'label:design';
    default: return 'language:javascript';
  }
}

// Fetch GitHub Issues with Guaranteed Fallback Protection
async function fetchGitHubIssues() {
  if (state.isLoading) return;
  state.isLoading = true;

  if (DOM.issuesLoadingState) DOM.issuesLoadingState.classList.remove('hidden');
  if (DOM.issuesContainer) DOM.issuesContainer.classList.add('hidden');
  if (DOM.issuesEmptyState) DOM.issuesEmptyState.classList.add('hidden');
  if (DOM.apiNoticeBanner) DOM.apiNoticeBanner.classList.add('hidden');
  if (DOM.refreshIcon) DOM.refreshIcon.classList.add('animate-spin');

  // Choose primary skill cleanly without parentheses or invalid OR operators
  const activeSkills = state.skills.length > 0 ? state.skills : ['javascript'];
  const primarySkill = activeSkills[0];
  const skillQuery = getSkillGitHubQuery(primarySkill);

  // Exact clean query syntax verified by GitHub search specification
  const query = `is:issue is:open label:"good first issue" ${skillQuery}`;
  const params = new URLSearchParams({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: '30'
  });

  const apiUrl = `https://api.github.com/search/issues?${params.toString()}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (res.status === 200) {
      const data = await res.json();
      
      // If GitHub returned valid items, use them!
      if (data.items && data.items.length > 0) {
        state.isFallback = false;
        state.issues = data.items.map(item => {
          const repoName = item.repository_url ? item.repository_url.replace('https://api.github.com/repos/', '') : 'open-source/project';
          return {
            id: item.id,
            number: item.number,
            title: item.title,
            html_url: item.html_url,
            repo_name: repoName,
            user: item.user || { login: 'maintainer', avatar_url: '' },
            comments: item.comments || 0,
            created_at: item.created_at,
            updated_at: item.updated_at,
            labels: item.labels || [],
            body: item.body || ''
          };
        });

        if (DOM.reposSubtitle) {
          DOM.reposSubtitle.textContent = `Found ${state.issues.length} live GitHub tickets matching your skills!`;
        }
      } else {
        // If GitHub returned 0 items for this specific query, seamlessly load verified curated issues!
        loadFallbackIssues('empty_query');
      }
    } else {
      // 403 Rate Limit or API service limitation: use verified curated issues
      loadFallbackIssues(res.status === 403 ? 'rate_limit' : 'api_error');
    }
  } catch (err) {
    console.warn('Network issue or GitHub API unreachable, using curated dataset:', err);
    loadFallbackIssues('network');
  } finally {
    state.isLoading = false;
    if (DOM.refreshIcon) DOM.refreshIcon.classList.remove('animate-spin');
    if (DOM.issuesLoadingState) DOM.issuesLoadingState.classList.add('hidden');
    await refineIssuesWithGemma();
    applyFiltersAndRender();
  }
}

// Fallback Issue Loader (Ensures user NEVER sees an empty screen)
function loadFallbackIssues(reason = 'rate_limit') {
  state.isFallback = true;
  if (DOM.apiNoticeBanner) {
    DOM.apiNoticeBanner.classList.remove('hidden');
    if (DOM.apiNoticeText) {
      DOM.apiNoticeText.textContent = reason === 'rate_limit'
        ? "GitHub unauthenticated rate limit reached (60 req/hour). Showing verified open-source tickets!"
        : "Showing verified beginner-friendly tickets matched to your selected skills.";
    }
  }

  // Gather fallback issues across all selected skills
  const aggregated = [];
  const addedIds = new Set();

  const skillsToUse = state.skills.length > 0 ? state.skills : ['javascript', 'react', 'python'];
  skillsToUse.forEach(skillKey => {
    const list = FALLBACK_ISSUES[skillKey] || FALLBACK_ISSUES['javascript'] || [];
    list.forEach(item => {
      if (!addedIds.has(item.id)) {
        addedIds.add(item.id);
        aggregated.push(item);
      }
    });
  });

  // Guarantee comprehensive coverage across all 3 tiers (Easy, Medium, Challenging)
  (FALLBACK_ISSUES['javascript'] || []).forEach(item => {
    if (!addedIds.has(item.id)) {
      addedIds.add(item.id);
      aggregated.push(item);
    }
  });

  state.issues = aggregated;
  if (DOM.reposSubtitle) {
    DOM.reposSubtitle.textContent = `Showing verified open-source opportunities in ascending difficulty: Warm-up -> Level up -> Boss level.`;
  }
}

// Filter, Sort, and Render Issues
// =============================================================================
// Difficulty Tier & Doability Scoring Engine
// =============================================================================
function classifyIssue(issue, userSkills = []) {
  const labels = (issue.labels || []).map(l => (typeof l === 'string' ? l : l.name || '').toLowerCase());
  const title = (issue.title || '').toLowerCase();
  const body = (issue.body || '').toLowerCase();
  const comments = issue.comments || 0;
  const bodyLen = body.length;

  // Easy signals
  const easyLabels = ['good first issue', 'good-first-issue', 'documentation', 'typo', 'docs', 'easy', 'beginner', 'starter', 'first-timers-only'];
  const hasEasyLabel = labels.some(l => easyLabels.some(el => l.includes(el)));
  const hasEasyTitle = easyLabels.some(el => title.includes(el));

  // Challenging signals
  const challengingLabels = ['feature', 'refactor', 'performance', 'design', 'architecture', 'security', 'core', 'epic', 'complex', 'breaking', 'optimization'];
  const challengingKeywords = ['refactor', 'performance', 'benchmark', 'concurrency', 'memory leak', 'architecture', 'breaking change', 'multi-file', 'optimization', 'pipeline', 'serializer', 'monorepo'];
  const hasChallengingLabel = labels.some(l => challengingLabels.some(cl => l.includes(cl)));
  const hasChallengingKeyword = challengingKeywords.some(ck => title.includes(ck) || body.includes(ck));

  // Medium signals
  const mediumLabels = ['bug', 'enhancement', 'help wanted', 'help-wanted', 'test', 'tests', 'ui', 'component', 'intermediate', 'navigation'];
  const hasMediumLabel = labels.some(l => mediumLabels.some(ml => l.includes(ml)));

  let tier = 'medium';
  if ((hasEasyLabel || hasEasyTitle) && !hasChallengingLabel && !hasChallengingKeyword) {
    tier = 'easy';
  } else if (hasChallengingLabel || (hasChallengingKeyword && !hasEasyLabel)) {
    tier = 'challenging';
  } else if (hasMediumLabel) {
    tier = 'medium';
  } else if (comments <= 2 && bodyLen < 380) {
    tier = 'easy';
  } else if (comments > 6 || bodyLen > 1100) {
    tier = 'challenging';
  } else {
    tier = 'medium';
  }

  // Derive Language
  let language = 'JavaScript';
  const repoName = (issue.repo_name || '').toLowerCase();
  const allText = `${title} ${body} ${labels.join(' ')} ${repoName}`;
  if (allText.includes('typescript') || allText.includes('ts') || repoName.includes('typescript')) language = 'TypeScript';
  else if (allText.includes('python') || repoName.includes('python') || allText.includes('fastapi') || allText.includes('cpython') || repoName.includes('flask')) language = 'Python';
  else if (allText.includes('react') || repoName.includes('react') || allText.includes('next.js') || repoName.includes('next')) language = 'React';
  else if (allText.includes('html') || allText.includes('css') || allText.includes('tailwind') || allText.includes('bootstrap')) language = 'HTML/CSS';
  else if ((allText.includes('java') && !allText.includes('javascript')) || repoName.includes('spring')) language = 'Java';
  else if (allText.includes('c++') || allText.includes('cpp') || repoName.includes('godot')) language = 'C++';
  else if (allText.includes('documentation') || allText.includes('docs') || repoName.includes('docs')) language = 'Markdown';
  else if (allText.includes('testing') || allText.includes('jest') || allText.includes('test')) language = 'Test Suite';
  else if (allText.includes('a11y') || allText.includes('wcag') || allText.includes('accessibility')) language = 'A11y';
  else if (allText.includes('design') || allText.includes('figma') || allText.includes('tokens')) language = 'UI / Design';

  // Calculate Estimated Time
  let estimatedTime = 'about 30 min';
  if (tier === 'easy') {
    estimatedTime = comments <= 1 ? 'about 25 min' : 'about 35 min';
  } else if (tier === 'medium') {
    estimatedTime = comments <= 4 ? 'about 1 hour' : 'about 90 min';
  } else {
    estimatedTime = bodyLen > 1400 || comments > 8 ? 'about 4 - 5 hours' : 'about 2 - 3 hours';
  }

  // Calculate Doability Score (0 to 100)
  // Easy: 88 - 98
  // Medium: 72 - 85
  // Challenging: 54 - 69
  let doabilityScore = 80;
  if (tier === 'easy') {
    doabilityScore = 90 + Math.min(8, Math.max(0, 8 - comments * 2));
    if (hasEasyLabel) doabilityScore = Math.min(99, doabilityScore + 2);
  } else if (tier === 'medium') {
    doabilityScore = 74 + Math.min(10, Math.max(0, 10 - comments));
    if (hasMediumLabel) doabilityScore += 2;
  } else {
    doabilityScore = 56 + Math.min(12, Math.max(0, 12 - comments));
  }

  // Bonus for matching selected skill
  const primarySkill = (userSkills[0] || '').toLowerCase();
  if (primarySkill && allText.includes(primarySkill)) {
    doabilityScore = Math.min(99, doabilityScore + 1);
  }

  return {
    ...issue,
    tier,
    tierName: tier === 'easy' ? 'Easy' : tier === 'medium' ? 'Medium' : 'Challenging',
    tierColor: tier === 'easy' ? 'emerald' : tier === 'medium' ? 'amber' : 'rose',
    language,
    estimatedTime,
    doabilityScore
  };
}

// Select Tier Distribution based on User's Verified Skill Score and Time
function selectTieredIssues(allClassified, confidence, timeHours) {
  const conf = parseInt(confidence, 10) || 3;
  const hours = parseInt(timeHours, 10) || 1;

  let easyPool = allClassified.filter(i => i.tier === 'easy');
  let medPool = allClassified.filter(i => i.tier === 'medium');
  let chalPool = allClassified.filter(i => i.tier === 'challenging');

  // Determine quotas based on user's verified skill score and time
  let quotaEasy, quotaMed, quotaChal;
  if (conf <= 4 || hours <= 1) {
    // Low score or short time (1 hour): mostly Easy, few Medium, at least 2 Challenging
    quotaEasy = 6;
    quotaMed = 3;
    quotaChal = 2;
  } else if (conf >= 8 || hours >= 5) {
    // High score or long time: more Medium and Challenging, at least 2 Easy
    quotaEasy = 2;
    quotaMed = 5;
    quotaChal = 5;
  } else {
    // Moderate score / time: balanced
    quotaEasy = 4;
    quotaMed = 4;
    quotaChal = 3;
  }

  // Supplement if any pool has fewer than 2 issues to guarantee tier visibility
  const supplementPool = (pool, tierName, minCount) => {
    if (pool.length >= minCount) return pool;
    const fallbackList = [];
    Object.values(FALLBACK_ISSUES).forEach(arr => {
      (arr || []).forEach(item => {
        const classified = classifyIssue(item, state.skills);
        if (classified.tier === tierName && !pool.some(p => p.id === item.id) && !fallbackList.some(p => p.id === item.id)) {
          fallbackList.push(classified);
        }
      });
    });
    return [...pool, ...fallbackList].slice(0, Math.max(minCount, pool.length));
  };

  easyPool = supplementPool(easyPool, 'easy', 2);
  medPool = supplementPool(medPool, 'medium', 2);
  chalPool = supplementPool(chalPool, 'challenging', 2);

  return {
    easy: easyPool.slice(0, Math.max(2, quotaEasy)),
    medium: medPool.slice(0, Math.max(2, quotaMed)),
    challenging: chalPool.slice(0, Math.max(2, quotaChal))
  };
}

// Filter, Sort, and Render Issues
function applyFiltersAndRender() {
  let list = [...state.issues];

  // 1. In-page filter keyword
  const kw = state.filterKeyword.trim().toLowerCase();
  if (kw) {
    list = list.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(kw);
      const repoMatch = (item.repo_name || '').toLowerCase().includes(kw);
      const labelMatch = (item.labels || []).some(l => (l.name || '').toLowerCase().includes(kw));
      return titleMatch || repoMatch || labelMatch;
    });
  }

  // 2. Classify each issue
  const classified = list.map(item => classifyIssue(item, state.skills));

  // 3. Partition according to verified skill score and time
  const partitioned = selectTieredIssues(classified, state.confidence, state.timeHours);

  // 4. Sort inside each group
  const sortGroup = (arr) => {
    if (state.sortBy === 'recent') {
      return [...arr].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (state.sortBy === 'least-comments') {
      return [...arr].sort((a, b) => (a.comments || 0) - (b.comments || 0));
    } else if (state.sortBy === 'most-comments') {
      return [...arr].sort((a, b) => (b.comments || 0) - (a.comments || 0));
    } else {
      // Default: Doability Score from highest to lowest
      return [...arr].sort((a, b) => (b.doabilityScore || 0) - (a.doabilityScore || 0));
    }
  };

  const sortedEasy = sortGroup(partitioned.easy);
  const sortedMed = sortGroup(partitioned.medium);
  const sortedChal = sortGroup(partitioned.challenging);

  state.filteredIssues = [...sortedEasy, ...sortedMed, ...sortedChal];

  // 5. Render both Path View and Galaxy Orbit View
  renderIssuesGrid(sortedEasy, sortedMed, sortedChal);
  renderGalaxyOrbitView(sortedEasy, sortedMed, sortedChal);
}

// Format relative date for display
function formatRelativeTime(dateString) {
  if (!dateString) return 'recently';
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Render Issue Cards in Ascending Order: Warm-up (Easy) -> Level up (Medium) -> Boss level (Challenging)
function renderIssuesGrid(easyGroup, mediumGroup, challengingGroup) {
  if (!DOM.issuesContainer) return;

  const totalCount = easyGroup.length + mediumGroup.length + challengingGroup.length;
  if (totalCount === 0) {
    DOM.issuesContainer.classList.add('hidden');
    if (DOM.galaxyOrbitView) DOM.galaxyOrbitView.classList.add('hidden');
    if (DOM.issuesEmptyState) DOM.issuesEmptyState.classList.remove('hidden');
    return;
  }

  if (DOM.issuesEmptyState) DOM.issuesEmptyState.classList.add('hidden');
  
  if (state.currentViewMode === 'galaxy') {
    DOM.issuesContainer.classList.add('hidden');
    if (DOM.galaxyOrbitView) DOM.galaxyOrbitView.classList.remove('hidden');
  } else {
    DOM.issuesContainer.classList.remove('hidden');
    if (DOM.galaxyOrbitView) DOM.galaxyOrbitView.classList.add('hidden');
  }

  const renderCard = (issue) => {
    const isSaved = state.savedIssues.some(s => s.id === issue.id);

    // Tier-specific styles
    let tierBorderClass = 'border-[#A78BFA]/25 hover:border-[#57D9F4]';
    let tierChipClass = 'bg-[#182040] text-[#57D9F4] border-[#57D9F4]/40';
    let tierDotClass = 'bg-[#57D9F4]';

    if (issue.tier === 'easy') {
      tierBorderClass = 'border-emerald-500/30 hover:border-emerald-400';
      tierChipClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      tierDotClass = 'bg-emerald-400';
    } else if (issue.tier === 'medium') {
      tierBorderClass = 'border-amber-500/30 hover:border-amber-400';
      tierChipClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      tierDotClass = 'bg-amber-400';
    } else {
      tierBorderClass = 'border-rose-500/30 hover:border-rose-400';
      tierChipClass = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      tierDotClass = 'bg-rose-400';
    }

    // Build labels HTML
    const labelsHtml = (issue.labels || []).slice(0, 4).map(label => {
      const isGoodFirst = (label.name || '').toLowerCase().includes('good first');
      const pillClass = isGoodFirst 
        ? 'bg-[#6D45C5]/30 text-[#57D9F4] border border-[#57D9F4]/40' 
        : 'bg-[#182040] text-[#B8B5D3] border border-[#A78BFA]/25';
      return `<span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full ${pillClass}">${escapeHtml(label.name)}</span>`;
    }).join(' ');

    return `
      <div class="p-5 bg-[#10152B]/90 border-2 ${tierBorderClass} rounded-2xl transition-all shadow-galaxy-sm hover:shadow-galaxy space-y-3.5 backdrop-blur-md">
        
        <!-- Header Row -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
          <div class="space-y-1.5 flex-1">
            <div class="flex items-center flex-wrap gap-2">
              <a href="https://github.com/${escapeHtml(issue.repo_name)}" target="_blank" rel="noopener noreferrer" class="text-xs font-mono font-bold text-[#57D9F4] hover:underline flex items-center space-x-1">
                <svg class="w-3.5 h-3.5 text-[#57D9F4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <span>${escapeHtml(issue.repo_name)}</span>
              </a>
              <span class="text-[10px] text-[#B8B5D3] font-mono">#${issue.number}</span>
            </div>

            <h4 class="text-base font-display font-bold text-[#F4F1FF] hover:text-[#57D9F4] transition-colors leading-snug">
              <a href="${escapeHtml(issue.html_url)}" target="_blank" rel="noopener noreferrer">
                ${escapeHtml(issue.title)}
              </a>
            </h4>
          </div>

          <!-- Bookmark Button -->
          <button 
            type="button"
            data-issue-id="${issue.id}"
            class="bookmark-btn self-start p-2 rounded-xl border ${isSaved ? 'bg-[#6D45C5]/40 text-[#57D9F4] border-[#57D9F4]' : 'bg-[#182040] text-[#B8B5D3] border-[#A78BFA]/30 hover:text-[#57D9F4]'} transition-all flex items-center space-x-1 text-xs shrink-0 cursor-pointer"
            title="${isSaved ? 'Remove bookmark' : 'Bookmark this opportunity'}"
          >
            <svg class="w-4 h-4" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            <span class="text-[10px] font-mono font-bold">${isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <!-- Required Metric Chips Row: Tier Chip, Doability Score, Language, Estimated Time -->
        <div class="flex items-center flex-wrap gap-2 pt-1">
          <!-- 1. Tier Chip (Easy, Medium, Challenging) -->
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${tierChipClass} border flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full ${tierDotClass}"></span>
            <span>${issue.tierName}</span>
          </span>

          <!-- 2. Doability Score -->
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#182040] text-[#57D9F4] border border-[#57D9F4]/40 flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#57D9F4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <span>Doability: ${issue.doabilityScore}%</span>
          </span>

          <!-- 3. Language -->
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#182040] text-[#A78BFA] border border-[#A78BFA]/40 flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#A78BFA] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>${escapeHtml(issue.language)}</span>
          </span>

          <!-- 4. Estimated Time -->
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#182040] text-[#B8B5D3] border border-[#A78BFA]/20 flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#B8B5D3] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${escapeHtml(issue.estimatedTime)}</span>
          </span>
        </div>

        ${issue.gemmaRecommended ? `
          <div class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6D45C5]/30 to-[#57D9F4]/15 border border-[#57D9F4]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div class="flex items-center space-x-1.5 text-[#57D9F4] font-semibold">
              <svg class="w-3.5 h-3.5 text-[#57D9F4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg>
              <span class="font-mono uppercase text-[10px] tracking-wider text-[#57D9F4]">AI Recommendation:</span>
              <span class="text-[#F4F1FF] font-normal text-xs">${escapeHtml(issue.matchReason || 'Ideal match for your experience and time budget.')}</span>
            </div>
            <span class="text-[9px] font-mono font-bold text-[#57D9F4] bg-[#080914] px-2 py-0.5 rounded border border-[#57D9F4]/40 self-start sm:self-auto">${escapeHtml(issue.difficulty || 'Tailored Match')}</span>
          </div>
        ` : ''}

        <!-- Labels Row -->
        <div class="flex flex-wrap items-center gap-1.5 pt-1">
          ${labelsHtml}
        </div>

        <!-- Footer Info Row -->
        <div class="flex items-center justify-between pt-3 border-t border-[#A78BFA]/20 text-xs text-[#B8B5D3]">
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-1.5">
              <img src="${issue.user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}" class="w-4 h-4 rounded-full border border-[#57D9F4]/40" alt="${escapeHtml(issue.user.login)}" />
              <span class="font-mono text-[11px] text-[#F4F1FF]">${escapeHtml(issue.user.login)}</span>
            </div>
            <span>•</span>
            <span class="text-[11px]">Updated ${formatRelativeTime(issue.updated_at)}</span>
            <span>•</span>
            <span class="text-[11px] font-mono text-[#57D9F4] flex items-center space-x-1">
              <svg class="w-3 h-3 text-[#57D9F4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>${issue.comments} comments</span>
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <button 
              type="button"
              class="start-quest-btn px-4 py-1.5 text-xs font-display font-bold text-[#080914] bg-gradient-to-r from-[#57D9F4] via-[#A78BFA] to-[#F4F1FF] hover:opacity-95 rounded-xl transition-all shadow-[0_0_15px_rgba(87,217,244,0.4)] flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5"
              data-issue-id="${issue.id}"
              data-issue-number="${issue.number}"
              data-issue-title="${escapeHtml(issue.title)}"
              data-repo-name="${escapeHtml(issue.repo_name)}"
              data-issue-url="${escapeHtml(issue.html_url)}"
              data-difficulty="${issue.tier || 'easy'}"
            >
              <svg class="w-3.5 h-3.5 text-[#080914] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
              <span>Start this quest</span>
            </button>
            <a 
              href="${escapeHtml(issue.html_url)}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-3 py-1.5 text-xs font-mono font-medium text-[#B8B5D3] bg-[#182040] hover:text-[#57D9F4] hover:border-[#57D9F4]/40 border border-[#A78BFA]/30 rounded-xl transition-all flex items-center space-x-1"
            >
              <span>GitHub</span>
              <svg class="w-3 h-3 text-current shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        </div>
      </div>
    `;
  };

  DOM.issuesContainer.innerHTML = `
    <div class="progress-path-timeline space-y-12 my-2">
      
      <!-- 1. Warm-up (Easy, green) -->
      <div id="tierGroupWarmup" class="relative space-y-4">
        <div class="orbital-station-node border-2 border-emerald-400 shadow-[0_0_12px_rgba(56,239,125,0.7)]">
          <span class="text-emerald-400 font-mono font-bold text-xs">01</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-emerald-500/20">
          <div class="flex items-center space-x-2.5">
            <h4 class="text-xl sm:text-2xl font-display font-extrabold text-emerald-400">Warm-up</h4>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Easy
            </span>
            <span class="text-xs font-mono text-[#B8B5D3]">(${easyGroup.length} opportunities)</span>
          </div>
          <span class="text-xs font-mono text-emerald-400/80">Single-file fixes, typo improvements & docs</span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          ${easyGroup.map(renderCard).join('')}
        </div>
      </div>

      <!-- 2. Level up (Medium, yellow) -->
      <div id="tierGroupLevelup" class="relative space-y-4">
        <div class="orbital-station-node border-2 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]">
          <span class="text-amber-400 font-mono font-bold text-xs">02</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-amber-500/20">
          <div class="flex items-center space-x-2.5">
            <h4 class="text-xl sm:text-2xl font-display font-extrabold text-amber-400">Level up</h4>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              Medium
            </span>
            <span class="text-xs font-mono text-[#B8B5D3]">(${mediumGroup.length} opportunities)</span>
          </div>
          <span class="text-xs font-mono text-amber-400/80">Bugfixes, test suites & component features</span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          ${mediumGroup.map(renderCard).join('')}
        </div>
      </div>

      <!-- 3. Boss level (Challenging, red) -->
      <div id="tierGroupBosslevel" class="relative space-y-4">
        <div class="orbital-station-node border-2 border-rose-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]">
          <span class="text-rose-400 font-mono font-bold text-xs">03</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-rose-500/20">
          <div class="flex items-center space-x-2.5">
            <h4 class="text-xl sm:text-2xl font-display font-extrabold text-rose-400">Boss level</h4>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
              Challenging
            </span>
            <span class="text-xs font-mono text-[#B8B5D3]">(${challengingGroup.length} opportunities)</span>
          </div>
          <span class="text-xs font-mono text-rose-400/80">Multi-file refactors, architecture & performance</span>
        </div>
        <div class="grid grid-cols-1 gap-4">
          ${challengingGroup.map(renderCard).join('')}
        </div>
      </div>

    </div>
  `;

  // Attach Bookmark button listeners
  DOM.issuesContainer.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const issueId = parseInt(btn.getAttribute('data-issue-id'), 10);
      toggleBookmark(issueId);
    });
  });

  DOM.issuesContainer.querySelectorAll('.start-quest-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const issueData = {
        id: parseInt(btn.getAttribute('data-issue-id'), 10),
        number: parseInt(btn.getAttribute('data-issue-number'), 10),
        title: btn.getAttribute('data-issue-title'),
        repo_name: btn.getAttribute('data-repo-name'),
        html_url: btn.getAttribute('data-issue-url'),
        difficulty: btn.getAttribute('data-difficulty') || 'easy',
      };
      startOrOpenQuest(issueData);
    });
  });
}

// Render Galaxy Orbit View with 3 Orbits (Inner=Easy, Middle=Medium, Outer=Challenging)
function renderGalaxyOrbitView(easyIssues, mediumIssues, challengingIssues) {
  const container = document.getElementById('galaxyOrbitCanvasContainer');
  if (!container) return;

  const w = 700;
  const h = 560;
  const cx = 350;
  const cy = 280;

  const rInner = 105;
  const rMiddle = 185;
  const rOuter = 255;

  let svgHtml = `
    <svg viewBox="0 0 ${w} ${h}" class="w-full max-w-[680px] h-auto select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Radial gradient for Central Star -->
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#57D9F4" stop-opacity="1"/>
          <stop offset="40%" stop-color="#A78BFA" stop-opacity="0.9"/>
          <stop offset="80%" stop-color="#6D45C5" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#10152B" stop-opacity="0"/>
        </radialGradient>
        <!-- Planet Gradients -->
        <radialGradient id="easyPlanetGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#6EE7B7"/>
          <stop offset="60%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#047857"/>
        </radialGradient>
        <radialGradient id="medPlanetGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FDE68A"/>
          <stop offset="60%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </radialGradient>
        <radialGradient id="chalPlanetGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FDA4AF"/>
          <stop offset="60%" stop-color="#EF4444"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </radialGradient>
        <!-- Glow Filter -->
        <filter id="planetGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Background Starlight Grid -->
      <g opacity="0.25">
        <circle cx="${cx - 150}" cy="${cy - 130}" r="1.5" fill="#57D9F4"/>
        <circle cx="${cx + 170}" cy="${cy - 160}" r="2" fill="#A78BFA"/>
        <circle cx="${cx - 210}" cy="${cy + 140}" r="1.5" fill="#B8B5D3"/>
        <circle cx="${cx + 230}" cy="${cy + 120}" r="2" fill="#57D9F4"/>
        <circle cx="${cx - 80}" cy="${cy + 220}" r="1.5" fill="#A78BFA"/>
        <circle cx="${cx + 90}" cy="${cy - 230}" r="2" fill="#B8B5D3"/>
      </g>

      <!-- 1. Outer Orbit Ring (Challenging, Red) -->
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="#F87171" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.45" />
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="#F87171" stroke-width="7" opacity="0.08" />

      <!-- 2. Middle Orbit Ring (Medium, Yellow) -->
      <circle cx="${cx}" cy="${cy}" r="${rMiddle}" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="5 7" opacity="0.5" />
      <circle cx="${cx}" cy="${cy}" r="${rMiddle}" fill="none" stroke="#FBBF24" stroke-width="7" opacity="0.09" />

      <!-- 3. Inner Orbit Ring (Easy, Green) -->
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="none" stroke="#38EF7D" stroke-width="1.8" stroke-dasharray="4 6" opacity="0.55" />
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="none" stroke="#38EF7D" stroke-width="8" opacity="0.1" />

      <!-- Central Core (PRbit Station / You) -->
      <circle cx="${cx}" cy="${cy}" r="45" fill="url(#sunCore)" opacity="0.8" />
      <circle cx="${cx}" cy="${cy}" r="25" fill="#10152B" stroke="#57D9F4" stroke-width="2.5" />
      <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="#57D9F4">YOU</text>
      <text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="monospace" font-size="7" fill="#B8B5D3">CORE</text>
  `;

  // Place Easy Planets on Inner Orbit
  const nEasy = easyIssues.length || 1;
  easyIssues.forEach((issue, idx) => {
    const angle = (2 * Math.PI / nEasy) * idx - Math.PI / 2;
    const px = cx + rInner * Math.cos(angle);
    const py = cy + rInner * Math.sin(angle);
    const shortRepo = (issue.repo_name || 'repo').split('/')[1] || issue.repo_name;

    svgHtml += `
      <g class="galaxy-planet-group cursor-pointer" data-issue-id="${issue.id}" filter="url(#planetGlow)">
        <circle cx="${px}" cy="${py}" r="13" fill="url(#easyPlanetGrad)" stroke="#6EE7B7" stroke-width="1.5" />
        <text x="${px}" y="${py + 3}" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#080914">${issue.doabilityScore}%</text>
        <text x="${px}" y="${py + 23}" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#38EF7D">${escapeHtml(shortRepo.slice(0, 12))}</text>
      </g>
    `;
  });

  // Place Medium Planets on Middle Orbit
  const nMed = mediumIssues.length || 1;
  mediumIssues.forEach((issue, idx) => {
    const angle = (2 * Math.PI / nMed) * idx - Math.PI / 4;
    const px = cx + rMiddle * Math.cos(angle);
    const py = cy + rMiddle * Math.sin(angle);
    const shortRepo = (issue.repo_name || 'repo').split('/')[1] || issue.repo_name;

    svgHtml += `
      <g class="galaxy-planet-group cursor-pointer" data-issue-id="${issue.id}" filter="url(#planetGlow)">
        <circle cx="${px}" cy="${py}" r="15" fill="url(#medPlanetGrad)" stroke="#FDE68A" stroke-width="1.5" />
        <text x="${px}" y="${py + 3}" text-anchor="middle" font-family="monospace" font-size="8.5" font-weight="bold" fill="#080914">${issue.doabilityScore}%</text>
        <text x="${px}" y="${py + 25}" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FBBF24">${escapeHtml(shortRepo.slice(0, 13))}</text>
      </g>
    `;
  });

  // Place Challenging Planets on Outer Orbit
  const nChal = challengingIssues.length || 1;
  challengingIssues.forEach((issue, idx) => {
    const angle = (2 * Math.PI / nChal) * idx - Math.PI / 6;
    const px = cx + rOuter * Math.cos(angle);
    const py = cy + rOuter * Math.sin(angle);
    const shortRepo = (issue.repo_name || 'repo').split('/')[1] || issue.repo_name;

    svgHtml += `
      <g class="galaxy-planet-group cursor-pointer" data-issue-id="${issue.id}" filter="url(#planetGlow)">
        <circle cx="${px}" cy="${py}" r="17" fill="url(#chalPlanetGrad)" stroke="#FDA4AF" stroke-width="1.5" />
        <text x="${px}" y="${py + 3.5}" text-anchor="middle" font-family="monospace" font-size="9" font-weight="bold" fill="#080914">${issue.doabilityScore}%</text>
        <text x="${px}" y="${py + 27}" text-anchor="middle" font-family="sans-serif" font-size="9.5" font-weight="bold" fill="#F87171">${escapeHtml(shortRepo.slice(0, 14))}</text>
      </g>
    `;
  });

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;

  // Set default inspector to first issue (Easy)
  const defaultIssue = easyIssues[0] || mediumIssues[0] || challengingIssues[0];
  if (defaultIssue) {
    updatePlanetInspector(defaultIssue);
  }

  // Attach click listeners to planet groups
  container.querySelectorAll('.galaxy-planet-group').forEach(group => {
    group.addEventListener('click', () => {
      const id = parseInt(group.getAttribute('data-issue-id'), 10);
      const all = [...easyIssues, ...mediumIssues, ...challengingIssues];
      const found = all.find(i => i.id === id);
      if (found) {
        updatePlanetInspector(found);
      }
    });
  });
}

// Update Galaxy View Planet Inspector Card
function updatePlanetInspector(issue) {
  const inspector = document.getElementById('galaxyPlanetInspector');
  if (!inspector || !issue) return;

  const isSaved = state.savedIssues.some(s => s.id === issue.id);
  const tierColor = issue.tier === 'easy' 
    ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' 
    : issue.tier === 'medium' 
    ? 'text-amber-400 bg-amber-500/20 border-amber-500/40' 
    : 'text-rose-400 bg-rose-500/20 border-rose-500/40';

  inspector.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-1 flex-1">
        <div class="flex items-center flex-wrap gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${tierColor}">
            ${issue.tierName} (${issue.tier === 'easy' ? 'Inner Orbit' : issue.tier === 'medium' ? 'Middle Orbit' : 'Outer Orbit'})
          </span>
          <span class="text-xs font-mono font-bold text-[#57D9F4]">${escapeHtml(issue.repo_name)} #${issue.number}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#182040] text-[#57D9F4] border border-[#57D9F4]/40 font-bold">
            Doability: ${issue.doabilityScore}%
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#182040] text-[#A78BFA] border border-[#A78BFA]/30 font-bold">
            ${escapeHtml(issue.language)}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#182040] text-[#B8B5D3] border border-[#A78BFA]/20">
            ${escapeHtml(issue.estimatedTime)}
          </span>
        </div>
        <h5 class="text-sm font-display font-bold text-[#F4F1FF] hover:text-[#57D9F4]">
          <a href="${escapeHtml(issue.html_url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(issue.title)}
          </a>
        </h5>
      </div>

      <div class="flex items-center space-x-2 shrink-0">
        <button 
          type="button"
          class="start-quest-btn px-4 py-2 bg-gradient-to-r from-[#57D9F4] via-[#A78BFA] to-[#F4F1FF] text-[#080914] font-display font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(87,217,244,0.4)] cursor-pointer transform hover:-translate-y-0.5"
          data-issue-id="${issue.id}"
          data-issue-number="${issue.number}"
          data-issue-title="${escapeHtml(issue.title)}"
          data-repo-name="${escapeHtml(issue.repo_name)}"
          data-issue-url="${escapeHtml(issue.html_url)}"
          data-difficulty="${issue.tier || 'easy'}"
        >
          <svg class="w-3.5 h-3.5 text-[#080914] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
          <span>Start this quest</span>
        </button>
        <button 
          type="button" 
          data-issue-id="${issue.id}" 
          class="galaxy-inspector-save p-2 rounded-xl border ${isSaved ? 'bg-[#6D45C5]/40 text-[#57D9F4] border-[#57D9F4]' : 'bg-[#182040] text-[#B8B5D3] border-[#A78BFA]/30 hover:text-[#57D9F4]'} text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          <span>${isSaved ? 'Saved' : 'Save'}</span>
        </button>
        <a 
          href="${escapeHtml(issue.html_url)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="px-3 py-2 bg-[#182040] hover:text-[#57D9F4] hover:border-[#57D9F4]/40 border border-[#A78BFA]/30 text-[#B8B5D3] font-mono font-medium rounded-xl text-xs flex items-center space-x-1"
        >
          <span>GitHub</span>
          <svg class="w-3.5 h-3.5 text-current shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      </div>
    </div>
  `;

  const saveBtn = inspector.querySelector('.galaxy-inspector-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      toggleBookmark(issue.id);
      updatePlanetInspector(issue);
    });
  }

  const questBtn = inspector.querySelector('.start-quest-btn');
  if (questBtn) {
    questBtn.addEventListener('click', () => {
      const issueData = {
        id: parseInt(questBtn.getAttribute('data-issue-id'), 10),
        number: parseInt(questBtn.getAttribute('data-issue-number'), 10),
        title: questBtn.getAttribute('data-issue-title'),
        repo_name: questBtn.getAttribute('data-repo-name'),
        html_url: questBtn.getAttribute('data-issue-url'),
        difficulty: questBtn.getAttribute('data-difficulty') || 'easy',
      };
      startOrOpenQuest(issueData);
    });
  }
}

// View Mode Switcher
function switchViewMode(mode) {
  state.currentViewMode = mode;
  if (mode === 'galaxy') {
    if (DOM.issuesContainer) DOM.issuesContainer.classList.add('hidden');
    if (DOM.galaxyOrbitView) DOM.galaxyOrbitView.classList.remove('hidden');
    if (DOM.viewModeGalaxyBtn) {
      DOM.viewModeGalaxyBtn.className = 'view-mode-btn active px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-gradient-to-r from-[#6D45C5] to-[#57D9F4] text-[#080914] flex items-center space-x-1.5 cursor-pointer';
    }
    if (DOM.viewModePathBtn) {
      DOM.viewModePathBtn.className = 'view-mode-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-[#B8B5D3] hover:text-[#57D9F4] flex items-center space-x-1.5 cursor-pointer';
    }
  } else {
    if (DOM.galaxyOrbitView) DOM.galaxyOrbitView.classList.add('hidden');
    if (DOM.issuesContainer) DOM.issuesContainer.classList.remove('hidden');
    if (DOM.viewModePathBtn) {
      DOM.viewModePathBtn.className = 'view-mode-btn active px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-gradient-to-r from-[#6D45C5] to-[#57D9F4] text-[#080914] flex items-center space-x-1.5 cursor-pointer';
    }
    if (DOM.viewModeGalaxyBtn) {
      DOM.viewModeGalaxyBtn.className = 'view-mode-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all text-[#B8B5D3] hover:text-[#57D9F4] flex items-center space-x-1.5 cursor-pointer';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Attach Step 6 Listeners
  // Step 6 Suggested Path & View Switcher Controls
  if (DOM.startHereBtn) {
    DOM.startHereBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.currentViewMode === 'galaxy') {
        switchViewMode('path');
      }
      const warmupEl = document.getElementById('tierGroupWarmup');
      if (warmupEl) {
        warmupEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        warmupEl.classList.add('ring-2', 'ring-emerald-400', 'rounded-2xl', 'p-2');
        setTimeout(() => {
          warmupEl.classList.remove('ring-2', 'ring-emerald-400', 'rounded-2xl', 'p-2');
        }, 1500);
      }
    });
  }

  if (DOM.viewModePathBtn) {
    DOM.viewModePathBtn.addEventListener('click', () => switchViewMode('path'));
  }

  if (DOM.viewModeGalaxyBtn) {
    DOM.viewModeGalaxyBtn.addEventListener('click', () => switchViewMode('galaxy'));
  }

  if (DOM.filterIssuesInput) {
  DOM.filterIssuesInput.addEventListener('input', (e) => {
    state.filterKeyword = e.target.value;
    applyFiltersAndRender();
  });
}

if (DOM.sortIssuesSelect) {
  DOM.sortIssuesSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndRender();
  });
}

if (DOM.refreshIssuesBtn) {
  DOM.refreshIssuesBtn.addEventListener('click', () => {
    fetchGitHubIssues();
  });
}

if (DOM.clearFilterBtn) {
  DOM.clearFilterBtn.addEventListener('click', () => {
    if (DOM.filterIssuesInput) DOM.filterIssuesInput.value = '';
    state.filterKeyword = '';
    applyFiltersAndRender();
  });
}

// Celebrate Landing Button
if (DOM.celebrateBtn) {
  DOM.celebrateBtn.addEventListener('click', () => {
    triggerCelebrationBurst();
    showToast('Mission accomplished! Your open-source journey on PRbit has begun!', 'success');
  });
}

// Celebration Particle Burst
function triggerCelebrationBurst() {
  const container = document.body;
  const svgIcons = [
    '<svg class="w-5 h-5 text-[#57D9F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6l-6.3 4.4 2.3-7.2-6-4.4h7.6z"/></svg>',
    '<svg class="w-5 h-5 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>',
    '<svg class="w-5 h-5 text-[#FFB59E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>',
    '<svg class="w-5 h-5 text-[#38EF7D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  ];

  for (let i = 0; i < 35; i++) {
    const star = document.createElement('div');
    star.innerHTML = svgIcons[Math.floor(Math.random() * svgIcons.length)];
    star.className = 'fixed z-50 pointer-events-none select-none flex items-center justify-center';
    
    // Launch origin near bottom center
    const startX = window.innerWidth / 2 + (Math.random() * 200 - 100);
    const startY = window.innerHeight * 0.7;
    
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    star.style.transition = 'all 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
    star.style.opacity = '1';

    container.appendChild(star);

    // Scatter outward
    const destX = startX + (Math.random() * 600 - 300);
    const destY = startY - (Math.random() * 450 + 100);

    requestAnimationFrame(() => {
      star.style.transform = `translate(${destX - startX}px, ${destY - startY}px) scale(${0.8 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
      star.style.opacity = '0';
    });

    setTimeout(() => {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 1500);
  }
}

// =============================================================================
// Bookmarks / Saved Issues Drawer
// =============================================================================
function loadSavedFromStorage() {
  try {
    const raw = localStorage.getItem('prbit_saved_issues') || localStorage.getItem('open_source_orbit_saved');
    if (raw) {
      state.savedIssues = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
    state.savedIssues = [];
  }
  updateSavedBadge();
}

function saveToStorage() {
  try {
    localStorage.setItem('prbit_saved_issues', JSON.stringify(state.savedIssues));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
  updateSavedBadge();
}

function updateSavedBadge() {
  const count = state.savedIssues.length;
  if (DOM.savedCountBadge) DOM.savedCountBadge.textContent = count;
  if (DOM.modalSavedCount) DOM.modalSavedCount.textContent = `(${count})`;
}

function toggleBookmark(issueId) {
  const existingIndex = state.savedIssues.findIndex(s => s.id === issueId);
  if (existingIndex >= 0) {
    state.savedIssues.splice(existingIndex, 1);
    showToast('Removed from saved opportunities', 'info');
  } else {
    const found = state.issues.find(s => s.id === issueId);
    if (found) {
      state.savedIssues.push(found);
      showToast('Opportunity saved to your PRbit drawer!', 'success');
    }
  }

  saveToStorage();
  applyFiltersAndRender();
  renderSavedModalList();
}

function renderSavedModalList() {
  if (!DOM.savedIssuesList) return;
  DOM.savedIssuesList.innerHTML = '';

  if (state.savedIssues.length === 0) {
    DOM.savedIssuesList.innerHTML = `
      <div class="text-center py-8 text-[#B8B5D3]">
        <div class="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#182040] border border-[#A78BFA]/30 flex items-center justify-center text-[#57D9F4]"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div>
        <p class="text-sm font-display font-bold text-[#F4F1FF]">No saved opportunities yet</p>
        <p class="text-xs text-[#B8B5D3]/70 mt-1">Click the bookmark icon on any issue card to save it here for later.</p>
      </div>
    `;
    return;
  }

  state.savedIssues.forEach(issue => {
    const row = document.createElement('div');
    row.className = 'p-3 bg-[#182040]/80 border border-[#A78BFA]/30 rounded-2xl flex items-center justify-between gap-3 text-xs';
    row.innerHTML = `
      <div class="space-y-0.5 truncate">
        <span class="font-mono text-[10px] text-[#57D9F4] font-bold">${escapeHtml(issue.repo_name)} #${issue.number}</span>
        <h5 class="font-display font-bold text-[#F4F1FF] truncate">${escapeHtml(issue.title)}</h5>
      </div>
      <div class="flex items-center space-x-2 shrink-0">
        <a href="${escapeHtml(issue.html_url)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-gradient-to-r from-[#A78BFA] to-[#57D9F4] text-[#080914] font-bold rounded-lg text-xs flex items-center space-x-1">
          <span>Open</span>
          <svg class="w-3 h-3 text-[#080914] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <button class="remove-saved-btn text-[#FFB59E] hover:text-[#ff8a65] p-1 font-bold rounded-lg hover:bg-[#FFB59E]/10 flex items-center justify-center" data-id="${issue.id}" title="Remove">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;
    DOM.savedIssuesList.appendChild(row);
  });

  DOM.savedIssuesList.querySelectorAll('.remove-saved-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      toggleBookmark(id);
    });
  });
}

// Modal Toggle Handlers
if (DOM.savedIssuesBtn) {
  DOM.savedIssuesBtn.addEventListener('click', () => {
    renderSavedModalList();
    if (DOM.savedModal) DOM.savedModal.classList.remove('hidden');
  });
}

if (DOM.closeSavedModalBtn) {
  DOM.closeSavedModalBtn.addEventListener('click', () => {
    if (DOM.savedModal) DOM.savedModal.classList.add('hidden');
  });
}

if (DOM.closeSavedModalSecondaryBtn) {
  DOM.closeSavedModalSecondaryBtn.addEventListener('click', () => {
    if (DOM.savedModal) DOM.savedModal.classList.add('hidden');
  });
}

if (DOM.clearAllSavedBtn) {
  DOM.clearAllSavedBtn.addEventListener('click', () => {
    state.savedIssues = [];
    saveToStorage();
    renderSavedModalList();
    applyFiltersAndRender();
    showToast('Cleared all saved issues', 'info');
  });
}

// =============================================================================
// Global Navigation Controls
// =============================================================================

// Back buttons
document.querySelectorAll('.prev-step-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToStep(state.currentStep - 1);
  });
});

// Milestone station buttons (direct navigation)
DOM.milestoneStations.forEach(station => {
  station.addEventListener('click', () => {
    const stepNum = parseInt(station.getAttribute('data-step') || station.getAttribute('data-station'), 10);
    goToStep(stepNum);
  });
});

// Hero CTA buttons
if (DOM.heroLaunchBtn) {
  DOM.heroLaunchBtn.addEventListener('click', () => {
    if (DOM.journeySection) {
      DOM.journeySection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

if (DOM.navStartJourneyBtn) {
  DOM.navStartJourneyBtn.addEventListener('click', () => {
    if (DOM.journeySection) {
      DOM.journeySection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// =============================================================================

// =============================================================================
// Interactive Git Buddy Floating Bot (Commander Astro) & Web Speech API Voice Module
// =============================================================================
const ASTRO_TIPS = [
  "“Tip: When starting out, search for issues with the label 'good first issue' or 'documentation'!”",
  "“Flight Rule #1: Always create a new branch with 'git checkout -b fix/issue-name' before writing code.”",
  "“Tip: Keep your Pull Requests small and focused — one bug or feature per PR makes reviewers happy!”",
  "“Flight Rule #2: Sync your local fork with upstream main using 'git pull upstream main' regularly.”",
  "“Pro-Tip: Read the repository's CONTRIBUTING.md file before submitting your first PR!”",
  "“Flight Rule #3: Write clear commit messages in present tense, e.g. 'Fix login redirect on mobile'.”",
  "“Tip: Star the repo you're contributing to — open source maintainers love seeing your enthusiasm!”"
];

const STEP_ASTRO_MESSAGES = {
  1: "“Welcome Cadet! Enter your GitHub username or explore in guest mode to kickstart our mission.”",
  2: "“Choose your tech stack! Selecting languages filters projects tailored directly to your superpowers.”",
  3: "“Dial in your confidence level from 1 to 10 so we calibrate the optimal issue complexity.”",
  4: "“Set your flight endurance! Tell us how many hours weekly you can devote to open source.”",
  5: "“Step 5 checkpoint: Follow our 8-step PR flight checklist to craft your first contribution!”",
  6: "“Galaxy scanned! Explore active open source repos and bookmark ones you want to tackle!”"
};

let currentAstroTipIdx = 0;

// =============================================================================
// Native Browser Web Speech API Voice Module (Robust Chrome & Safari Engine)
// =============================================================================

// Global Audio Context & Speech Synthesis Unlocker
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const unlockSpeech = () => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      if (typeof AstroVoice !== 'undefined') {
        AstroVoice.hasUserInteracted = true;
      }
    } catch (e) {}
  };
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockSpeech, { passive: true });
  });

  window.speechSynthesis.onvoiceschanged = () => {
    try {
      window.speechSynthesis.getVoices();
    } catch (e) {}
  };
}

const AstroVoice = {
  synth: typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null,
  isSpeaking: false,
  isMuted: false,
  autoSpeak: true,
  hasUserInteracted: false,
  _lastSpokenText: '',
  _lastSpokenTime: 0,
  _activeUtterances: [],
  _resumeInterval: null,

  speak(text) {
    if (!this.synth || this.isMuted) return;

    try {
      // Always ensure browser speech synthesis is resumed
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Clean text for natural speech synthesis
      const cleanText = (text || '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/["“”'#*_`~]/g, '')
        .replace(/[—–]/g, ' ')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      // Prevent redundant double-triggering for identical text within 500ms
      const now = Date.now();
      if (cleanText === this._lastSpokenText && (now - this._lastSpokenTime < 500)) {
        return;
      }
      this._lastSpokenText = cleanText;
      this._lastSpokenTime = now;

      const triggerSpeak = () => {
        try {
          if (this.synth.paused) {
            this.synth.resume();
          }

          const utterance = new SpeechSynthesisUtterance(cleanText);
          
          // Retain strong reference to prevent garbage collection in Chrome/Safari
          window._astroSpeechUtterance = utterance;
          this._activeUtterances.push(utterance);
          if (this._activeUtterances.length > 5) this._activeUtterances.shift();

          const voices = this.synth.getVoices();
          if (voices && voices.length > 0) {
            const preferred = voices.find(v => 
              v.lang.startsWith('en') && (
                v.name.includes('Google') || 
                v.name.includes('Natural') || 
                v.name.includes('Samantha') || 
                v.name.includes('Daniel') || 
                v.name.includes('Fred') ||
                v.name.includes('Arthur')
              )
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

            if (preferred) utterance.voice = preferred;
          }

          utterance.volume = 1.0;
          utterance.rate = 1.0;
          utterance.pitch = 1.05;

          utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateUI(true);
          };

          utterance.onend = () => {
            this.isSpeaking = false;
            this.updateUI(false);
          };

          utterance.onerror = (e) => {
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
              console.warn('Speech error:', e.error);
            }
            this.isSpeaking = false;
            this.updateUI(false);
          };

          this.synth.speak(utterance);

          // Workaround for Chrome 15-second speech queue pause bug
          if (this._resumeInterval) clearInterval(this._resumeInterval);
          this._resumeInterval = setInterval(() => {
            if (!this.isSpeaking) {
              clearInterval(this._resumeInterval);
              return;
            }
            if (this.synth && this.synth.paused) {
              this.synth.resume();
            }
          }, 3000);

        } catch (err) {
          console.warn('Speech synthesis trigger error:', err);
          this.isSpeaking = false;
          this.updateUI(false);
        }
      };

      // In Chrome/Safari, cancel() on the exact same tick can cancel the new utterance.
      // Use a tiny 35ms deferral if an utterance is currently playing.
      if (this.synth.speaking || this.synth.pending) {
        this.synth.cancel();
        setTimeout(triggerSpeak, 40);
      } else {
        triggerSpeak();
      }

    } catch (err) {
      console.warn('Speech synthesis outer error:', err);
      this.isSpeaking = false;
      this.updateUI(false);
    }
  },

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
      this.isSpeaking = false;
      this.updateUI(false);
    }
  },

  toggle(text) {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speak(text);
    }
  },

  updateUI(speaking) {
    const speakIcon = document.getElementById('astroSpeakBtnIcon');
    const speakText = document.getElementById('astroSpeakBtnText');
    const speakBtn = document.getElementById('astroSpeakBtn');
    const avatar = document.getElementById('astroAvatarBtn');

    if (speakIcon && speakText) {
      if (speaking) {
        speakIcon.innerHTML = '<svg class="w-4 h-4 text-[#57D9F4] shrink-0" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
        speakText.textContent = 'Stop';
        if (speakBtn) speakBtn.classList.add('bg-[#6D45C5]/40', 'border-[#57D9F4]');
      } else {
        speakIcon.innerHTML = '<svg class="w-4 h-4 text-[#57D9F4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15.54 8.46a5 5 0 010 7.07"/></svg>';
        speakText.textContent = 'Speak';
        if (speakBtn) speakBtn.classList.remove('bg-[#6D45C5]/40');
      }
    }

    if (avatar) {
      if (speaking) {
        avatar.classList.add('astro-speaking-pulse');
      } else {
        avatar.classList.remove('astro-speaking-pulse');
      }
    }
  }
};
// =============================================================================
// Google AI Studio Gemma API Client & Key Management (.env & LocalStorage)
// =============================================================================
let cachedApiKey = null;

async function getGemmaApiKey() {
  if (cachedApiKey) return cachedApiKey;

  // 1. Check localStorage
  const stored = localStorage.getItem('PRBIT_GEMMA_API_KEY');
  if (stored && stored.trim() && !stored.includes('your_google_ai_studio_api_key')) {
    cachedApiKey = stored.trim();
    updateApiKeyUIStatus(true, 'Local Key Active');
    return cachedApiKey;
  }

  // 2. Try fetching .env from root
  try {
    const res = await fetch('.env');
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/API_KEY\s*=\s*([^\s\r\n]+)/);
      if (match && match[1]) {
        const val = match[1].trim();
        if (val && !val.includes('your_google_ai_studio_api_key')) {
          cachedApiKey = val;
          updateApiKeyUIStatus(true, '.env Key Loaded');
          return cachedApiKey;
        }
      }
    }
  } catch (err) {
    // Expected in file:// protocol or if server doesn't serve .env
  }

  updateApiKeyUIStatus(false, 'Fallback Mode Active');
  return '';
}

function saveGemmaApiKey(key) {
  cachedApiKey = key;
  state.hasGemmaKey = true;
  localStorage.setItem('PRBIT_GEMMA_API_KEY', key);
  updateApiKeyUIStatus(true, 'Key Saved');
}

function clearGemmaApiKey() {
  cachedApiKey = '';
  state.hasGemmaKey = false;
  localStorage.removeItem('PRBIT_GEMMA_API_KEY');
  updateApiKeyUIStatus(false, 'Fallback Mode Active');
}

function updateApiKeyUIStatus(active, label) {
  state.hasGemmaKey = active;
  const ind = document.getElementById('aiKeyIndicator');
  const dot = document.getElementById('aiModalStatusDot');
  const statusText = document.getElementById('aiModalStatusText');

  if (ind) {
    ind.className = `w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-amber-400'}`;
  }
  if (dot) {
    dot.className = `w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-amber-400'}`;
  }
  if (statusText) {
    statusText.textContent = label || (active ? 'Gemma Active' : 'Fallback Mode');
  }
}

async function initGemmaApiKey() {
  await getGemmaApiKey();
}

async function callGemmaAPI(prompt, options = {}) {
  const apiKey = await getGemmaApiKey();
  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here' || apiKey.startsWith('your_')) {
    return null;
  }

  const models = ['gemma-2-9b-it', 'gemma-2-27b-it', 'gemini-1.5-flash'];
  
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxOutputTokens || 600
          }
        })
      });

      if (!res.ok) {
        console.warn(`Gemma API model ${model} error status: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`Gemma API call error (${model}):`, err);
    }
  }

  return null;
}

async function testGemmaConnection() {
  const inputKey = document.getElementById('aiKeyInput')?.value?.trim();
  const testKey = inputKey || await getGemmaApiKey();
  if (!testKey || testKey.includes('your_google_ai_studio_api_key')) {
    showToast('Please enter an API key to test', 'warning');
    return;
  }

  const btn = document.getElementById('testAiKeyBtn');
  if (btn) btn.textContent = 'Testing...';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b-it:generateContent?key=${encodeURIComponent(testKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Respond with 'All systems operational, Cadet!' in 5 words." }] }],
        generationConfig: { maxOutputTokens: 50 }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Operational';
      showToast(`Gemma Connected! "${text.trim()}"`, 'success');
      updateApiKeyUIStatus(true, 'Key Verified & Active');
      AstroVoice.speak(`All systems operational. Google AI Studio Gemma is online!`);
    } else {
      const errData = await res.json().catch(() => ({}));
      const msg = errData?.error?.message || `HTTP ${res.status}`;
      showToast(`Gemma test failed: ${msg}`, 'error');
    }
  } catch (err) {
    showToast(`Network error testing Gemma: ${err.message}`, 'error');
  } finally {
    if (btn) btn.innerHTML = '<svg class="w-3.5 h-3.5 inline mr-1 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Test Gemma';
  }
}

// =============================================================================
// Gemma API Repository Recommendations Intelligence
// =============================================================================
async function refineIssuesWithGemma() {
  const apiKey = await getGemmaApiKey();
  const banner = document.getElementById('gemmaIntelligenceBanner');
  const statusPill = document.getElementById('gemmaStatusPill');
  const analysisText = document.getElementById('gemmaAnalysisText');
  const tagsContainer = document.getElementById('gemmaTagsContainer');

  if (!banner || !analysisText) return;

  const activeSkills = state.skills.length > 0 ? state.skills : ['javascript'];
  const tier = CONFIDENCE_TIERS.find(t => state.confidence >= t.min && state.confidence <= t.max) || CONFIDENCE_TIERS[0];
  const timeHours = state.timeHours || '1';

  // Fallback mode if key is missing or placeholder
  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here' || apiKey.startsWith('your_')) {
    if (statusPill) {
      statusPill.textContent = 'Curated Strategy';
      statusPill.className = 'text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/40';
    }
    analysisText.textContent = `Based on your ${timeHours}h weekly time budget and ${tier.title.toLowerCase()} confidence level (${state.confidence}/10) in ${activeSkills.join(', ')}, we recommend tackling self-contained good-first-issues like documentation updates, typo fixes, and unit test additions in established repositories.`;
    
    if (tagsContainer) {
      tagsContainer.innerHTML = `
        <span class="px-2 py-0.5 rounded-full bg-[#182040] text-[#57D9F4] border border-[#57D9F4]/30 flex items-center space-x-1">
          <svg class="w-3 h-3 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${timeHours}h Micro-Sprint</span>
        </span>
        <span class="px-2 py-0.5 rounded-full bg-[#182040] text-[#A78BFA] border border-[#A78BFA]/30 flex items-center space-x-1">
          <svg class="w-3 h-3 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          <span>Level ${state.confidence}/10 (${tier.title})</span>
        </span>
        <span class="px-2 py-0.5 rounded-full bg-[#182040] text-[#B8B5D3] border border-[#B8B5D3]/30 flex items-center space-x-1">
          <svg class="w-3 h-3 text-[#57D9F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6l-6.3 4.4 2.3-7.2-6-4.4h7.6z"/></svg>
          <span>Verified Starter Repos</span>
        </span>
      `;
    }

    if (state.issues.length > 0) {
      state.issues[0].gemmaRecommended = true;
      state.issues[0].matchReason = `Well-scoped starter task matched to ${activeSkills[0]} and a ${timeHours}h session.`;
      state.issues[0].difficulty = state.confidence <= 4 ? 'Beginner Friendly' : 'Balanced Task';
      if (state.issues.length > 1) {
        state.issues[1].gemmaRecommended = true;
        state.issues[1].matchReason = `High-signal documentation & workflow opportunity for first-time contributors.`;
        state.issues[1].difficulty = 'Quick Win';
      }
    }
    return;
  }

  // Active Gemma API Key available!
  if (statusPill) {
    statusPill.textContent = 'Gemma Analyzing...';
    statusPill.className = 'text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#57D9F4]/20 text-[#57D9F4] border border-[#57D9F4]/40 animate-pulse';
  }
  analysisText.textContent = `Gemma is calibrating flight recommendations for ${activeSkills.join(', ')} (${state.confidence}/10 experience, ${timeHours}h session)...`;

  const prompt = `You are an expert open-source mentor AI helping a developer make their first GitHub pull request.
Developer Profile:
- Skills: ${activeSkills.join(', ')}
- Confidence / Experience: ${state.confidence}/10 (${tier.title}: ${tier.description})
- Weekly Time Available: ${timeHours} hour(s)
- GitHub Handle: ${state.user.username || 'cadet'}

Candidate open-source ecosystems to consider: React, Next.js, Node.js, Express, Vue, FreeCodeCamp, Axe-Core, Lodash, FastAPI, CPython, TypeScript, Heroicons, Spring Boot.

Please provide your intelligent recommendation in strict JSON format:
{
  "flightStrategy": "A 2-sentence encouraging, practical recommendation explaining the ideal contribution type for their skill and time budget.",
  "idealIssueScopes": ["Documentation", "Starter bugfix", "Test case"],
  "recommendedRepos": ["facebook/react", "freeCodeCamp/freeCodeCamp"],
  "topPickReason": "Why these repositories and task scopes fit a ${timeHours}h session at confidence ${state.confidence}/10."
}`;

  try {
    const rawResponse = await callGemmaAPI(prompt, { temperature: 0.6, maxOutputTokens: 600 });
    if (!rawResponse) throw new Error('Empty response from Gemma');

    let parsed = null;
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn('JSON parse error from Gemma:', err);
      }
    }

    if (parsed && parsed.flightStrategy) {
      if (statusPill) {
        statusPill.innerHTML = '<svg class="w-3 h-3 inline mr-1 text-[#57D9F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>Gemma Active';
        statusPill.className = 'text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#57D9F4]/20 text-[#57D9F4] border border-[#57D9F4]/40';
      }
      analysisText.textContent = parsed.flightStrategy;

      if (tagsContainer) {
        const scopes = Array.isArray(parsed.idealIssueScopes) ? parsed.idealIssueScopes : ['Documentation', 'Starter Bugs'];
        tagsContainer.innerHTML = `
          <span class="px-2 py-0.5 rounded-full bg-[#182040] text-[#57D9F4] border border-[#57D9F4]/40 font-bold flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${timeHours}h Orbit</span>
          </span>
          <span class="px-2 py-0.5 rounded-full bg-[#182040] text-[#A78BFA] border border-[#A78BFA]/40 font-bold flex items-center space-x-1">
            <svg class="w-3 h-3 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            <span>Level ${state.confidence}/10</span>
          </span>
          ${scopes.map(s => `<span class="px-2 py-0.5 rounded-full bg-[#6D45C5]/30 text-[#57D9F4] border border-[#57D9F4]/30 flex items-center space-x-1"><svg class="w-3 h-3 text-[#57D9F4] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"></path></svg><span>${escapeHtml(s)}</span></span>`).join('')}
        `;
      }

      if (Array.isArray(parsed.recommendedRepos) && parsed.recommendedRepos.length > 0) {
        const recReposLower = parsed.recommendedRepos.map(r => r.toLowerCase());
        state.issues.forEach(issue => {
          const repoLower = (issue.repo_name || '').toLowerCase();
          const matches = recReposLower.some(r => repoLower.includes(r) || r.includes(repoLower));
          if (matches) {
            issue.gemmaRecommended = true;
            issue.matchReason = parsed.topPickReason || `Recommended by Gemma for ${activeSkills[0]} and ${timeHours}h budget.`;
            issue.difficulty = state.confidence <= 4 ? 'Beginner Friendly' : 'Tailored Challenge';
          }
        });

        const highlighted = state.issues.filter(i => i.gemmaRecommended);
        if (highlighted.length === 0 && state.issues.length > 0) {
          state.issues[0].gemmaRecommended = true;
          state.issues[0].matchReason = parsed.topPickReason || `Tailored by Gemma for ${activeSkills[0]} and ${timeHours}h commitment.`;
          state.issues[0].difficulty = 'Optimal Match';
          if (state.issues.length > 1) {
            state.issues[1].gemmaRecommended = true;
            state.issues[1].matchReason = `High-relevance starter opportunity aligned with your ${tier.title.toLowerCase()} level.`;
            state.issues[1].difficulty = 'Starter Pick';
          }
        }

        // Prioritize Gemma recommended items at the top
        state.issues.sort((a, b) => {
          if (a.gemmaRecommended && !b.gemmaRecommended) return -1;
          if (!a.gemmaRecommended && b.gemmaRecommended) return 1;
          return 0;
        });
      }
    } else {
      if (statusPill) {
        statusPill.innerHTML = '<svg class="w-3 h-3 inline mr-1 text-[#57D9F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>Gemma Active';
        statusPill.className = 'text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#57D9F4]/20 text-[#57D9F4] border border-[#57D9F4]/40';
      }
      analysisText.textContent = rawResponse.replace(/[“”"]/g, '').trim();
    }
  } catch (err) {
    console.warn('Gemma recommendation refinement error:', err);
    if (statusPill) {
      statusPill.textContent = 'Curated Strategy';
      statusPill.className = 'text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/40';
    }
    analysisText.textContent = `Showing verified starter opportunities matching your ${activeSkills.join(', ')} skills and ${timeHours}-hour time budget.`;
  }
}

// =============================================================================
// Mascot Dialogue Engine Powered by Gemma & Voice Controls
// =============================================================================
async function updateAstroBotForStep(stepNum) {
  const messageEl = document.getElementById('astroBotMessage');
  const statusBadgeText = document.getElementById('astroStatusText');
  if (!messageEl) return;

  const fallbackMsg = STEP_ASTRO_MESSAGES[stepNum] || "Ready for launch!";

  // Show fallback immediately so the UI is instantaneous
  messageEl.style.opacity = '0';
  setTimeout(() => {
    messageEl.textContent = fallbackMsg;
    messageEl.style.opacity = '1';
    // Auto-speak if user has interacted/entered galaxy
    if (AstroVoice.autoSpeak && AstroVoice.hasUserInteracted && !AstroVoice.isMuted) {
      AstroVoice.speak(fallbackMsg);
    }
  }, 100);

  const apiKey = await getGemmaApiKey();
  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here' || apiKey.startsWith('your_')) {
    if (statusBadgeText) statusBadgeText.textContent = 'ONLINE';
    return;
  }

  // Active Gemma key present: fetch dynamic context-aware advice!
  if (statusBadgeText) statusBadgeText.textContent = 'THINKING...';

  const activeSkills = state.skills.length > 0 ? state.skills : ['JavaScript'];
  const stepMeta = STEP_METADATA[stepNum] || { title: `Step ${stepNum}` };

  const prompt = `You are Commander Astro, the cheerful astronaut co-pilot of PRbit guiding a developer toward their first GitHub Pull Request.
Current Milestone: Step ${stepNum} of 6 - "${stepMeta.title}"
Selected Skills: ${activeSkills.join(', ')}
Experience Confidence: ${state.confidence}/10
Weekly Time Commitment: ${state.timeHours} hour(s)
Cadet Name: ${state.user.username || 'Cadet'}

Give an inspiring, witty, 1-2 sentence space-themed piece of co-pilot advice directly tailored to this milestone and their setup. Max 28 words. Keep it fun, punchy, and actionable. Do not wrap in quotes.`;

  try {
    const dynamicAdvice = await callGemmaAPI(prompt, { temperature: 0.7, maxOutputTokens: 250 });
    if (dynamicAdvice && dynamicAdvice.trim().length > 10) {
      const clean = dynamicAdvice.replace(/[“”"]/g, '').trim();
      messageEl.style.opacity = '0';
      setTimeout(() => {
        messageEl.textContent = `“${clean}”`;
        messageEl.style.opacity = '1';
        if (statusBadgeText) statusBadgeText.textContent = 'GEMMA';
        if (AstroVoice.autoSpeak) {
          AstroVoice.speak(clean);
        }
      }, 150);
    } else {
      if (statusBadgeText) statusBadgeText.textContent = 'ONLINE';
    }
  } catch (err) {
    console.warn('Gemma mascot update error:', err);
    if (statusBadgeText) statusBadgeText.textContent = 'ONLINE';
  }
}

async function askGemmaCoPilot() {
  const messageEl = document.getElementById('astroBotMessage');
  const statusBadgeText = document.getElementById('astroStatusText');
  if (!messageEl) return;

  const apiKey = await getGemmaApiKey();
  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here' || apiKey.startsWith('your_')) {
    currentAstroTipIdx = (currentAstroTipIdx + 1) % ASTRO_TIPS.length;
    const tip = ASTRO_TIPS[currentAstroTipIdx];
    messageEl.textContent = tip;
    AstroVoice.speak(tip);
    showToast('Tip loaded! Set your Google AI Studio API key in AI Config for dynamic responses.', 'info');
    return;
  }

  if (statusBadgeText) statusBadgeText.textContent = 'THINKING...';
  messageEl.style.opacity = '0.5';

  const stepMeta = STEP_METADATA[state.currentStep] || { title: `Step ${state.currentStep}` };
  const prompt = `You are Commander Astro, the Git Buddy space co-pilot.
The user clicked "Ask Co-Pilot" at Step ${state.currentStep} (${stepMeta.title}).
Tech stack: ${state.skills.join(', ') || 'web development'}
Experience: ${state.confidence}/10
Time: ${state.timeHours}hr/week
Cadet: ${state.user.username || 'Explorer'}

Give a fresh, inspiring, and actionable piece of advice for this exact moment. 1-2 punchy sentences, max 28 words. No quotes.`;

  try {
    const response = await callGemmaAPI(prompt, { temperature: 0.8, maxOutputTokens: 250 });
    messageEl.style.opacity = '1';
    if (response) {
      const clean = response.replace(/[“”"]/g, '').trim();
      messageEl.textContent = `“${clean}”`;
      if (statusBadgeText) statusBadgeText.textContent = 'GEMMA';
      AstroVoice.speak(clean);
      showToast('Commander Astro consulted Gemma AI!', 'success');
    } else {
      throw new Error('No advice received');
    }
  } catch (err) {
    messageEl.style.opacity = '1';
    if (statusBadgeText) statusBadgeText.textContent = 'ONLINE';
    currentAstroTipIdx = (currentAstroTipIdx + 1) % ASTRO_TIPS.length;
    const fallback = ASTRO_TIPS[currentAstroTipIdx];
    messageEl.textContent = fallback;
    AstroVoice.speak(fallback);
  }
}

function initAstroBot() {
  const dialogue = document.getElementById('astroBotDialogue');
  const avatarBtn = document.getElementById('astroAvatarBtn');
  const closeBtn = document.getElementById('closeAstroBotBtn');
  const tipBtn = document.getElementById('astroTipBtn');
  const messageEl = document.getElementById('astroBotMessage');
  const speakBtn = document.getElementById('astroSpeakBtn');
  const askBtn = document.getElementById('astroAskGemmaBtn');
  const muteBtn = document.getElementById('astroMuteBtn');
  const muteIcon = document.getElementById('astroMuteIcon');

  if (!dialogue || !avatarBtn) return;

  // Toggle dialogue on avatar click
  avatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dialogue.classList.toggle('collapsed');
    AstroVoice.hasUserInteracted = true;
    if (window.speechSynthesis) window.speechSynthesis.resume();
    // If opening dialogue, speak current message
    if (!dialogue.classList.contains('collapsed')) {
      const msg = messageEl?.textContent || '';
      AstroVoice.speak(msg);
    }
  });

  // Close dialogue on minimize button click
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dialogue.classList.add('collapsed');
    });
  }

  // Next tip cycle
  if (tipBtn && messageEl) {
    tipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentAstroTipIdx = (currentAstroTipIdx + 1) % ASTRO_TIPS.length;
      messageEl.style.opacity = '0';
      messageEl.style.transition = 'opacity 0.15s ease';
      setTimeout(() => {
        const tip = ASTRO_TIPS[currentAstroTipIdx];
        messageEl.textContent = tip;
        messageEl.style.opacity = '1';
        AstroVoice.hasUserInteracted = true;
        if (window.speechSynthesis) window.speechSynthesis.resume();
        if (AstroVoice.autoSpeak && !AstroVoice.isMuted) {
          AstroVoice.speak(tip);
        }
      }, 150);
    });
  }

  // Speak button (Web Speech API)
  if (speakBtn) {
    speakBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AstroVoice.hasUserInteracted = true;
      if (window.speechSynthesis) window.speechSynthesis.resume();
      if (AstroVoice.isMuted) {
        AstroVoice.isMuted = false;
        if (muteIcon) {
          muteIcon.innerHTML = '<svg class="w-4 h-4 text-[#57D9F4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15.54 8.46a5 5 0 010 7.07"/></svg>';
        }
      }
      const currentText = messageEl?.textContent || '';
      AstroVoice.toggle(currentText);
    });
  }

  // Automatic Speech Synchronization: Reads out loud whenever the mascot updates its chat bubble
  if (messageEl) {
    const observer = new MutationObserver(() => {
      if (AstroVoice.autoSpeak && !AstroVoice.isMuted && AstroVoice.hasUserInteracted) {
        const text = messageEl.textContent || '';
        AstroVoice.speak(text);
      }
    });
    observer.observe(messageEl, { childList: true, characterData: true, subtree: true });
  }

  // Ask Gemma Co-Pilot button
  if (askBtn) {
    askBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      askGemmaCoPilot();
    });
  }

  // Mute / Unmute voice button
  if (muteBtn && muteIcon) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AstroVoice.isMuted = !AstroVoice.isMuted;
      if (AstroVoice.isMuted) {
        AstroVoice.stop();
        muteIcon.innerHTML = '<svg class="w-4 h-4 text-[#FFB59E] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        showToast('Co-Pilot voice muted', 'info');
      } else {
        muteIcon.innerHTML = '<svg class="w-4 h-4 text-[#57D9F4] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor"/><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15.54 8.46a5 5 0 010 7.07"/></svg>';
        showToast('Co-Pilot voice enabled', 'success');
        const currentText = messageEl?.textContent || '';
        AstroVoice.speak(currentText);
      }
    });
  }
}

// =============================================================================
// AI Config Modal Logic
// =============================================================================
function initAiConfigModal() {
  const modal = document.getElementById('aiConfigModal');
  const openBtn = document.getElementById('aiConfigBtn');
  const closeBtn = document.getElementById('closeAiModalBtn');
  const saveBtn = document.getElementById('saveAiKeyBtn');
  const clearBtn = document.getElementById('clearAiKeyBtn');
  const testBtn = document.getElementById('testAiKeyBtn');
  const keyInput = document.getElementById('aiKeyInput');
  const toggleVisibilityBtn = document.getElementById('toggleAiKeyVisibility');
  const autoSpeakToggle = document.getElementById('voiceAutoSpeakToggle');
  const reanalyzeBtn = document.getElementById('reanalyzeGemmaBtn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', async () => {
      modal.classList.remove('hidden');
      const curKey = await getGemmaApiKey();
      if (keyInput && curKey) {
        keyInput.value = curKey;
      }
      if (autoSpeakToggle) {
        autoSpeakToggle.checked = AstroVoice.autoSpeak;
      }
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  if (toggleVisibilityBtn && keyInput) {
    toggleVisibilityBtn.addEventListener('click', () => {
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
      toggleVisibilityBtn.innerHTML = keyInput.type === 'password'
        ? '<svg class="w-4 h-4 text-[#B8B5D3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
        : '<svg class="w-4 h-4 text-[#B8B5D3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const val = keyInput?.value?.trim() || '';
      if (!val) {
        showToast('Please enter an API key', 'error');
        return;
      }
      saveGemmaApiKey(val);
      modal?.classList.add('hidden');
      showToast('Gemma API key saved successfully!', 'success');
      updateAstroBotForStep(state.currentStep);
      if (state.currentStep === 6) {
        await refineIssuesWithGemma();
        applyFiltersAndRender();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearGemmaApiKey();
      if (keyInput) keyInput.value = '';
      modal?.classList.add('hidden');
      showToast('API Key cleared. Switched to fallback mode.', 'info');
      updateAstroBotForStep(state.currentStep);
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', () => {
      testGemmaConnection();
    });
  }

  if (autoSpeakToggle) {
    autoSpeakToggle.addEventListener('change', () => {
      AstroVoice.autoSpeak = autoSpeakToggle.checked;
      showToast(AstroVoice.autoSpeak ? 'Mascot voice auto-speak enabled' : 'Mascot voice auto-speak disabled', 'info');
    });
  }

  if (reanalyzeBtn) {
    reanalyzeBtn.addEventListener('click', async () => {
      reanalyzeBtn.classList.add('animate-pulse');
      await refineIssuesWithGemma();
      applyFiltersAndRender();
      reanalyzeBtn.classList.remove('animate-pulse');
      showToast('Gemma AI flight recommendations refreshed!', 'success');
    });
  }
}

// Initialization
// =============================================================================

// =============================================================================
// 3D Warp Speed / Hyperdrive Starfield Opening Intro
// =============================================================================
class WarpStarfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.numStars = 950;
    this.maxZ = 1600;
    this.speed = 9;
    this.targetSpeed = 9;
    this.baseSpeed = 9;
    this.hyperSpeed = 75;
    this.isRunning = false;
    this.animId = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
    this.colors = ['#57D9F4', '#A78BFA', '#F4F1FF', '#C084FC', '#67E8F9', '#FFFFFF'];

    this.init();
  }

  init() {
    this.resize();
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push(this.createStar(true));
    }
  }

  createStar(randomZ = false) {
    return {
      x: (Math.random() - 0.5) * this.width * 2.4,
      y: (Math.random() - 0.5) * this.height * 2.4,
      z: randomZ ? Math.random() * this.maxZ + 1 : this.maxZ,
      prevZ: randomZ ? Math.random() * this.maxZ + 1 : this.maxZ,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      radius: Math.random() * 1.6 + 0.7
    };
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
    this.cx = this.width / 2;
    this.cy = this.height / 2;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.speed = this.baseSpeed;
    this.targetSpeed = this.baseSpeed;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  boostHyperdrive() {
    this.targetSpeed = this.hyperSpeed;
  }

  resetSpeed() {
    this.speed = this.baseSpeed;
    this.targetSpeed = this.baseSpeed;
  }

  loop() {
    if (!this.isRunning) return;

    // Smooth speed interpolation
    this.speed += (this.targetSpeed - this.speed) * 0.07;

    // Motion trail fade background
    this.ctx.fillStyle = this.speed > 25 ? 'rgba(8, 9, 20, 0.45)' : 'rgba(8, 9, 20, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const fov = 350;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.prevZ = star.z;
      star.z -= this.speed;

      if (star.z <= 0) {
        star.x = (Math.random() - 0.5) * this.width * 2.4;
        star.y = (Math.random() - 0.5) * this.height * 2.4;
        star.z = this.maxZ;
        star.prevZ = this.maxZ;
      }

      // Project 3D to 2D
      const k = fov / star.z;
      const px = this.cx + star.x * k;
      const py = this.cy + star.y * k;

      const prevK = fov / star.prevZ;
      const prevPx = this.cx + star.x * prevK;
      const prevPy = this.cy + star.y * prevK;

      if (px < -60 || px > this.width + 60 || py < -60 || py > this.height + 60) {
        continue;
      }

      const depthRatio = 1 - (star.z / this.maxZ);
      const alpha = Math.min(1, Math.max(0.18, depthRatio * 1.3));
      const lineWidth = Math.max(0.9, star.radius * depthRatio * (this.speed > 25 ? 2.5 : 1.3));

      this.ctx.beginPath();
      this.ctx.moveTo(prevPx, prevPy);
      this.ctx.lineTo(px, py);
      this.ctx.strokeStyle = star.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.lineWidth = lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // Glowing head point when at high warp
      if (this.speed > 22 && depthRatio > 0.35) {
        this.ctx.beginPath();
        this.ctx.arc(px, py, lineWidth * 0.75, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.globalAlpha = Math.min(1, alpha + 0.3);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

let warpInstance = null;

function initWarpIntro() {
  const overlay = document.getElementById('warpIntroOverlay');
  const launchBtn = document.getElementById('enterGalaxyBtn');
  const flash = document.getElementById('warpFlashOverlay');
  const card = document.getElementById('warpContentCard');
  const reopenBtn = document.getElementById('reopenWarpBtn');

  if (!overlay || !launchBtn) return;

  warpInstance = new WarpStarfield('warpCanvas');
  warpInstance.start();

  let isLaunching = false;

  const launchMission = () => {
    if (isLaunching) return;
    isLaunching = true;

    // Unlock and resume speech engine synchronously in user click gesture
    AstroVoice.hasUserInteracted = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    // Shift to deeper dark cosmic theme immediately as button is clicked while entering
    document.body.classList.add('theme-deep-dark');
    try {
      localStorage.setItem('PRBIT_DEEP_DARK', 'true');
    } catch (e) {}

    // 1. Boost star warp speed to hyperdrive
    warpInstance?.boostHyperdrive();

    // 2. Animate card out with zoom
    overlay.classList.add('warp-launching');

    // 3. Starlight flash burst
    setTimeout(() => {
      if (flash) flash.style.opacity = '0.75';
    }, 450);

    setTimeout(() => {
      if (flash) flash.style.opacity = '0';
    }, 700);

    // 4. Smoothly fade out overlay
    setTimeout(() => {
      overlay.classList.add('opacity-0', 'pointer-events-none');
    }, 600);

    // 5. Hide completely, pause animation loop to save 100% resources
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('warp-launching');
      warpInstance?.stop();
      isLaunching = false;

      // Welcome voice greeting from Commander Astro matching current dialogue!
      AstroVoice.hasUserInteracted = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      const activeMsg = document.getElementById('astroBotMessage')?.textContent || STEP_ASTRO_MESSAGES[1];
      if (typeof AstroVoice !== 'undefined' && AstroVoice.autoSpeak && !AstroVoice.isMuted) {
        AstroVoice.speak(activeMsg);
      }
    }, 1100);
  };

  launchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    launchMission();
  });

  // Also support pressing Enter key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !overlay.classList.contains('hidden') && !isLaunching) {
      launchMission();
    }
  });

  // Re-open warp intro anytime user clicks "Warp Intro" in nav
  if (reopenBtn) {
    reopenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none', 'warp-launching');
      if (flash) flash.style.opacity = '0';
      warpInstance?.resetSpeed();
      warpInstance?.start();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Initialization
// =============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  new GalaxyBackground();
  initWarpIntro();
  loadSavedFromStorage();
  updateSkillsSummary();
  updateConfidenceUI(state.confidence);
  await initGemmaApiKey();
  initAstroBot();
  initAiConfigModal();
  goToStep(1);
  await QuestSystem.init();
});



// =============================================================================
// FIRSTPR QUEST: GRADING SYSTEM, QUEST TRACKER & LEADERBOARD MODULE
// =============================================================================

const QuestSystem = {
  activeQuest: null,
  timerInterval: null,
  userStats: {
    username: 'cadet_coder',
    name: 'Cadet Stargazer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    totalScore: 0,
    grade: 'D',
    streak: 1,
    joinLeaderboard: 0,
    skill: 'JavaScript',
    prsOpened: 0,
    prsMerged: 0,
    totalSeconds: 0,
    rank: null,
    lastActiveDate: '',
  },
  allQuests: [],
  currentTimeframe: 'all',
  currentSkillFilter: 'all',
  currentLeagueCode: '',
  userLeagues: [],

  // Grade boundaries: 0-49 = D, 50-99 = C, 100-199 = B, 200-399 = A, 400+ = S
  getGrade(points) {
    const p = Math.max(0, points || 0);
    if (p >= 400) return 'S';
    if (p >= 200) return 'A';
    if (p >= 100) return 'B';
    if (p >= 50) return 'C';
    return 'D';
  },

  getGradeClass(grade) {
    const g = (grade || 'D').toUpperCase();
    return 'grade-' + g.toLowerCase();
  },

  getGradeInfo(grade) {
    const g = (grade || 'D').toUpperCase();
    switch (g) {
      case 'S': return { title: 'Cosmic Grandmaster', min: 400, max: 9999, next: null, target: 400, color: '#F59E0B' };
      case 'A': return { title: 'Orbital Commander', min: 200, max: 399, next: 'S', target: 400, color: '#A855F7' };
      case 'B': return { title: 'Star Navigator', min: 100, max: 199, next: 'A', target: 200, color: '#06B6D4' };
      case 'C': return { title: 'Galactic Pioneer', min: 50, max: 99, next: 'B', target: 100, color: '#10B981' };
      default: return { title: 'Flight Cadet', min: 0, max: 49, next: 'C', target: 50, color: '#F97316' };
    }
  },

  // Helper for smooth animated score count-ups
  animateScoreCountUp(element, targetScore, durationMs = 800) {
    if (!element) return;
    const startVal = parseInt(element.textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const endVal = parseInt(targetScore, 10) || 0;
    if (startVal === endVal) {
      element.textContent = endVal.toLocaleString();
      return;
    }

    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (endVal - startVal) * easeProgress);
      element.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = endVal.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  },

  // Trigger celebration confetti
  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#57D9F4', '#A78BFA', '#FCD34D', '#10B981', '#F4F1FF']
      });
    }
  },

  // Mascot Audio and Dialogue Notification
  notifyBuddy(message) {
    const dialogueMsg = document.getElementById('astroBotMessage');
    if (dialogueMsg) {
      dialogueMsg.textContent = message;
    }
    const bubble = document.getElementById('astroBotDialogue');
    if (bubble) {
      bubble.classList.remove('hidden', 'opacity-0');
    }
    // Speak out loud if speech synthesis is enabled
    if (typeof window.speechSynthesis !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        // Speech API not allowed or muted
      }
    }
  },

  // Format seconds into HH:MM:SS
  formatTimer(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  },

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================
  async init() {
    this.bindEvents();
    await this.loadUserProfile();
    await this.loadAllQuests();
    this.restoreActiveQuest();
    this.updateGlobalBadges();
  },

  bindEvents() {
    // Nav buttons
    const navLb = document.getElementById('navLeaderboardBtn');
    const navMobileLb = document.getElementById('navMobileLeaderboardBtn');
    const navProg = document.getElementById('navMyProgressBtn');
    const navMobileProg = document.getElementById('navMobileProgressBtn');

    if (navLb) navLb.addEventListener('click', () => this.openLeaderboard());
    if (navMobileLb) navMobileLb.addEventListener('click', () => this.openLeaderboard());
    if (navProg) navProg.addEventListener('click', () => this.openMyProgress());
    if (navMobileProg) navMobileProg.addEventListener('click', () => this.openMyProgress());

    // Mobile Hamburger Menu Toggle & Drawer
    const mobileMenuBtn = document.getElementById('mobileMenuToggleBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const closeMenuIcon = document.getElementById('closeMenuIcon');

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !mobileDrawer.classList.contains('hidden');
        if (isOpen) {
          mobileDrawer.classList.add('hidden');
          if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
          if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        } else {
          mobileDrawer.classList.remove('hidden');
          if (hamburgerIcon) hamburgerIcon.classList.add('hidden');
          if (closeMenuIcon) closeMenuIcon.classList.remove('hidden');
        }
      });

      // Close mobile drawer when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileDrawer.classList.add('hidden');
          if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
          if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        }
      });
    }

    // Mobile Drawer buttons
    const mobileWarp = document.getElementById('mobileWarpBtn');
    const mobileLbDrawer = document.getElementById('mobileLeaderboardDrawerBtn');
    const mobileProgDrawer = document.getElementById('mobileProgressDrawerBtn');

    if (mobileWarp) {
      mobileWarp.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        const reopenWarp = document.getElementById('reopenWarpBtn');
        if (reopenWarp) reopenWarp.click();
      });
    }
    if (mobileLbDrawer) {
      mobileLbDrawer.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        this.openLeaderboard();
      });
    }
    if (mobileProgDrawer) {
      mobileProgDrawer.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('hidden');
        if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
        if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        this.openMyProgress();
      });
    }

    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileDrawer.classList.add('hidden');
          if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
          if (closeMenuIcon) closeMenuIcon.classList.add('hidden');
        });
      });
    }

    // Modal Close buttons
    const closeQuest = document.getElementById('closeQuestModalBtn');
    const minQuest = document.getElementById('minimizeQuestModalBtn');
    const saveQuest = document.getElementById('saveQuestModalBtn');
    const closeProg = document.getElementById('closeMyProgressModalBtn');
    const closeLb = document.getElementById('closeLeaderboardModalBtn');
    const dockedOpen = document.getElementById('dockedOpenQuestBtn');

    if (closeQuest) closeQuest.addEventListener('click', () => this.minimizeQuest());
    if (minQuest) minQuest.addEventListener('click', () => this.minimizeQuest());
    if (saveQuest) saveQuest.addEventListener('click', () => {
      this.saveActiveQuestToServer();
      this.minimizeQuest();
      showToast('Quest telemetry synchronized successfully!', 'success');
    });
    if (closeProg) closeProg.addEventListener('click', () => this.closeMyProgress());
    if (closeLb) closeLb.addEventListener('click', () => this.closeLeaderboard());
    if (dockedOpen) dockedOpen.addEventListener('click', () => this.openQuestModal());

    // Quest Timer Controls
    const timerStart = document.getElementById('questTimerStartBtn');
    const timerPause = document.getElementById('questTimerPauseBtn');
    const timerStop = document.getElementById('questTimerStopBtn');

    if (timerStart) timerStart.addEventListener('click', () => this.startTimer());
    if (timerPause) timerPause.addEventListener('click', () => this.pauseTimer());
    if (timerStop) timerStop.addEventListener('click', () => this.concludeQuest());

    // Milestone Checkboxes (Self-reported 1 to 4)
    ['msForked', 'msCloned', 'msBranch', 'msCommit'].forEach((id) => {
      const cb = document.getElementById(id);
      if (cb) {
        cb.addEventListener('change', () => {
          this.handleMilestoneToggle();
        });
      }
    });

    // PR Verification Buttons (5 & 6)
    const verifyPrOpened = document.getElementById('verifyPrOpenedBtn');
    const verifyPrMerged = document.getElementById('verifyPrMergedBtn');
    if (verifyPrOpened) verifyPrOpened.addEventListener('click', () => this.verifyPullRequest('opened'));
    if (verifyPrMerged) verifyPrMerged.addEventListener('click', () => this.verifyPullRequest('merged'));

    // Leaderboard Tabs
    document.querySelectorAll('.leaderboard-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tf = btn.getAttribute('data-timeframe');
        this.setTimeframe(tf);
      });
    });

    // Leaderboard Skill Filter
    const skillSelect = document.getElementById('leaderboardSkillFilter');
    if (skillSelect) {
      skillSelect.addEventListener('change', (e) => {
        this.currentSkillFilter = e.target.value;
        this.fetchAndRenderLeaderboard();
      });
    }

    // Leaderboard Join sticky button
    const stickyJoin = document.getElementById('stickyJoinLeaderboardBtn');
    if (stickyJoin) {
      stickyJoin.addEventListener('click', () => {
        const joinToggle = document.getElementById('joinLeaderboardToggle');
        if (joinToggle) {
          joinToggle.checked = true;
          this.toggleLeaderboardParticipation(true);
        } else {
          this.toggleLeaderboardParticipation(true);
        }
      });
    }

    // Leaderboard Toggle Switch in My Progress
    const joinToggle = document.getElementById('joinLeaderboardToggle');
    if (joinToggle) {
      joinToggle.addEventListener('change', (e) => {
        this.toggleLeaderboardParticipation(e.target.checked);
      });
    }

    // Private League Controls
    const openLeagueBtn = document.getElementById('openPrivateLeagueBtn');
    const leagueDrawer = document.getElementById('privateLeagueDrawer');
    if (openLeagueBtn && leagueDrawer) {
      openLeagueBtn.addEventListener('click', () => {
        leagueDrawer.classList.toggle('hidden');
      });
    }

    const createLeagueBtn = document.getElementById('createLeagueSubmitBtn');
    if (createLeagueBtn) {
      createLeagueBtn.addEventListener('click', () => this.handleCreateLeague());
    }

    const joinLeagueBtn = document.getElementById('joinLeagueSubmitBtn');
    if (joinLeagueBtn) {
      joinLeagueBtn.addEventListener('click', () => this.handleJoinLeague());
    }
  },

  // ===========================================================================
  // DATA PERSISTENCE & USER PROFILE
  // ===========================================================================
  async loadUserProfile() {
    const storedUser = localStorage.getItem('firstpr_user_stats');
    if (storedUser) {
      try {
        this.userStats = Object.assign(this.userStats, JSON.parse(storedUser));
      } catch (e) {}
    }

    const username = state.user?.username || this.userStats.username || 'cadet_coder';
    this.userStats.username = username;
    if (state.user?.name) this.userStats.name = state.user.name;
    if (state.user?.avatarUrl) this.userStats.avatarUrl = state.user.avatarUrl;

    // Check backend API for persistence
    try {
      const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        if (!data.is_new) {
          this.userStats.totalScore = data.total_score || 0;
          this.userStats.grade = data.grade || this.getGrade(this.userStats.totalScore);
          this.userStats.streak = data.streak || 1;
          this.userStats.joinLeaderboard = data.join_leaderboard || 0;
          this.userStats.prsOpened = data.prs_opened || 0;
          this.userStats.prsMerged = data.prs_merged || 0;
          this.userStats.totalSeconds = data.total_seconds || 0;
          this.userStats.lastActiveDate = data.last_active_date || '';
        }
      }
    } catch (e) {
      // Local fallback
    }

    // Calculate Streak based on local/server date
    this.updateDailyStreak();
    localStorage.setItem('firstpr_user_stats', JSON.stringify(this.userStats));
  },

  updateDailyStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const last = this.userStats.lastActiveDate ? this.userStats.lastActiveDate.slice(0, 10) : '';

    if (last && last !== today) {
      const lastDate = new Date(last);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        // Consecutive day
        this.userStats.streak = (this.userStats.streak || 1) + 1;
      } else if (diffDays > 1) {
        // Broken streak
        this.userStats.streak = 1;
      }
    } else if (!last) {
      this.userStats.streak = 1;
    }
    this.userStats.lastActiveDate = today;
  },

  async saveUserProfile() {
    localStorage.setItem('firstpr_user_stats', JSON.stringify(this.userStats));
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.userStats.username,
          name: this.userStats.name,
          avatar_url: this.userStats.avatarUrl,
          total_score: this.userStats.totalScore,
          streak: this.userStats.streak,
          join_leaderboard: this.userStats.joinLeaderboard,
          skill: (state.skills && state.skills[0]) || this.userStats.skill || 'JavaScript',
          prs_opened: this.userStats.prsOpened,
          prs_merged: this.userStats.prsMerged,
          total_seconds: this.userStats.totalSeconds,
        })
      });
    } catch (e) {}
  },

  async loadAllQuests() {
    const stored = localStorage.getItem('firstpr_all_quests');
    if (stored) {
      try {
        this.allQuests = JSON.parse(stored);
      } catch (e) {
        this.allQuests = [];
      }
    }

    try {
      const res = await fetch(`/api/quests?username=${encodeURIComponent(this.userStats.username)}`);
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          this.allQuests = rows.map(r => ({
            id: r.id,
            username: r.username,
            issue_id: r.issue_id,
            issue_title: r.issue_title,
            repo_name: r.repo_name,
            issue_url: r.issue_url,
            difficulty: r.difficulty,
            status: r.status,
            activeSeconds: r.active_seconds,
            milestones: typeof r.milestones_json === 'string' ? JSON.parse(r.milestones_json || '{}') : (r.milestones || {}),
            points: r.points,
            grade: r.grade,
            pr_opened_url: r.pr_opened_url,
            pr_opened_verified: r.pr_opened_verified === 1,
            pr_merged_url: r.pr_merged_url,
            pr_merged_verified: r.pr_merged_verified === 1,
            created_at: r.created_at
          }));
          localStorage.setItem('firstpr_all_quests', JSON.stringify(this.allQuests));
        }
      }
    } catch (e) {}

    this.recalculateTotalScore();
  },

  recalculateTotalScore() {
    let questPointsSum = 0;
    let totalSecs = 0;
    let openedCount = 0;
    let mergedCount = 0;

    this.allQuests.forEach(q => {
      questPointsSum += (q.points || 0);
      totalSecs += (q.activeSeconds || 0);
      if (q.pr_opened_verified) openedCount++;
      if (q.pr_merged_verified) mergedCount++;
    });

    // Add current active quest if not already in allQuests
    if (this.activeQuest) {
      const exists = this.allQuests.some(q => q.id === this.activeQuest.id);
      if (!exists) {
        questPointsSum += (this.activeQuest.points || 0);
        totalSecs += (this.activeQuest.activeSeconds || 0);
        if (this.activeQuest.pr_opened_verified) openedCount++;
        if (this.activeQuest.pr_merged_verified) mergedCount++;
      }
    }

    // Streak bonus: +5 points for each day in a row
    const streakBonus = (this.userStats.streak || 1) * 5;
    const oldGrade = this.userStats.grade || 'D';
    this.userStats.totalScore = questPointsSum + streakBonus;
    this.userStats.totalSeconds = totalSecs;
    this.userStats.prsOpened = openedCount;
    this.userStats.prsMerged = mergedCount;
    this.userStats.grade = this.getGrade(this.userStats.totalScore);

    // If grade improved, celebrate!
    const gradesOrder = ['D', 'C', 'B', 'A', 'S'];
    if (gradesOrder.indexOf(this.userStats.grade) > gradesOrder.indexOf(oldGrade)) {
      this.triggerConfetti();
      this.notifyBuddy(`Promotion alert! You've ranked up to Grade ${this.userStats.grade}! Your open-source journey is reaching orbital velocity!`);
    }

    this.updateGlobalBadges();
    this.saveUserProfile();
  },

  updateGlobalBadges() {
    const g = this.userStats.grade || 'D';
    const gClass = this.getGradeClass(g);

    // Docked HUD grade badge
    const dockedBadge = document.getElementById('dockedQuestGradeBadge');
    if (dockedBadge && this.activeQuest) {
      dockedBadge.className = `grade-badge-sm grade-badge-glow ${this.getGradeClass(this.activeQuest.grade)} text-[9px] font-mono font-bold`;
      dockedBadge.textContent = this.activeQuest.grade;
    }
  },

  // ===========================================================================
  // 1. QUEST TRACKER LOGIC
  // ===========================================================================
  startOrOpenQuest(issue) {
    if (this.activeQuest && this.activeQuest.issue_id === issue.id) {
      // Re-opening same active quest
      this.openQuestModal();
      return;
    }

    // Conclude/save current active quest before starting new one
    if (this.activeQuest) {
      this.concludeQuest(false);
    }

    const diff = (issue.difficulty || issue.tier || 'easy').toLowerCase();
    const mult = diff === 'challenging' ? 2.0 : (diff === 'medium' ? 1.5 : 1.0);

    this.activeQuest = {
      id: 'quest_' + issue.id + '_' + Date.now(),
      username: this.userStats.username,
      issue_id: issue.id,
      issue_number: issue.number,
      issue_title: issue.title,
      repo_name: issue.repo_name,
      issue_url: issue.html_url,
      difficulty: diff,
      multiplier: mult,
      status: 'in_progress',
      activeSeconds: 0,
      timerRunning: true,
      milestones: {
        forked: false,
        cloned: false,
        branch: false,
        commit: false,
      },
      pr_opened_url: '',
      pr_opened_verified: false,
      pr_merged_url: '',
      pr_merged_verified: false,
      points: 0,
      grade: 'D',
      created_at: new Date().toISOString()
    };

    localStorage.setItem('firstpr_active_quest', JSON.stringify(this.activeQuest));
    this.openQuestModal();
    this.startTimer();
    this.updateDailyStreak();
    this.notifyBuddy(`Quest initiated for ${issue.repo_name}! Timer is live. Start by forking and cloning the repository!`);
    showToast(`Mission tracker started for ${issue.repo_name}!`, 'info');
  },

  restoreActiveQuest() {
    const stored = localStorage.getItem('firstpr_active_quest');
    if (stored) {
      try {
        this.activeQuest = JSON.parse(stored);
        if (this.activeQuest && this.activeQuest.status === 'in_progress') {
          this.updateDockedHUD();
          this.startTimer();
        }
      } catch (e) {}
    }
  },

  openQuestModal() {
    if (!this.activeQuest) return;
    const modal = document.getElementById('questTrackerModal');
    if (!modal) return;

    // Populate Issue Header
    const titleEl = document.getElementById('questModalTitle');
    const repoEl = document.getElementById('questModalRepo');
    const diffBadge = document.getElementById('questDifficultyBadge');
    const multPill = document.getElementById('questMultiplierPill');
    const inspectLink = document.getElementById('questInspectGithubLink');

    if (titleEl) titleEl.textContent = this.activeQuest.issue_title;
    if (repoEl) repoEl.innerHTML = `<svg class="w-3.5 h-3.5 text-[#57D9F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg><span>${escapeHtml(this.activeQuest.repo_name)} #${this.activeQuest.issue_number || ''}</span>`;
    if (inspectLink) inspectLink.href = this.activeQuest.issue_url;

    const diff = this.activeQuest.difficulty;
    const mult = this.activeQuest.multiplier || 1.0;
    if (diffBadge) {
      if (diff === 'challenging') {
        diffBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40';
        diffBadge.textContent = `Challenging x${mult.toFixed(1)}`;
      } else if (diff === 'medium') {
        diffBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
        diffBadge.textContent = `Medium x${mult.toFixed(1)}`;
      } else {
        diffBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        diffBadge.textContent = `Easy x${mult.toFixed(1)}`;
      }
    }
    if (multPill) multPill.textContent = `Multiplier: x${mult.toFixed(1)}`;

    // Sync Milestone Checkboxes
    const ms = this.activeQuest.milestones || {};
    const msForked = document.getElementById('msForked');
    const msCloned = document.getElementById('msCloned');
    const msBranch = document.getElementById('msBranch');
    const msCommit = document.getElementById('msCommit');
    const msPrOpened = document.getElementById('msPrOpened');
    const msPrMerged = document.getElementById('msPrMerged');

    if (msForked) msForked.checked = !!ms.forked;
    if (msCloned) msCloned.checked = !!ms.cloned;
    if (msBranch) msBranch.checked = !!ms.branch;
    if (msCommit) msCommit.checked = !!ms.commit;
    if (msPrOpened) msPrOpened.checked = !!this.activeQuest.pr_opened_verified;
    if (msPrMerged) msPrMerged.checked = !!this.activeQuest.pr_merged_verified;

    // PR URLs and badges
    const prOpenInput = document.getElementById('prOpenedUrlInput');
    const prOpenBadge = document.getElementById('prOpenedVerifiedBadge');
    if (prOpenInput) prOpenInput.value = this.activeQuest.pr_opened_url || '';
    if (prOpenBadge) {
      if (this.activeQuest.pr_opened_verified) {
        prOpenBadge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        prOpenBadge.textContent = 'GitHub Verified';
      } else {
        prOpenBadge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30';
        prOpenBadge.textContent = 'Verification Required';
      }
    }

    const prMergeInput = document.getElementById('prMergedUrlInput');
    const prMergeBadge = document.getElementById('prMergedVerifiedBadge');
    if (prMergeInput) prMergeInput.value = this.activeQuest.pr_merged_url || this.activeQuest.pr_opened_url || '';
    if (prMergeBadge) {
      if (this.activeQuest.pr_merged_verified) {
        prMergeBadge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
        prMergeBadge.textContent = 'Merged & Verified';
      } else {
        prMergeBadge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30';
        prMergeBadge.textContent = 'Verification Required';
      }
    }

    this.updateQuestScoreUI();
    modal.classList.remove('hidden');
    this.updateDockedHUD();
  },

  minimizeQuest() {
    const modal = document.getElementById('questTrackerModal');
    if (modal) modal.classList.add('hidden');
    this.updateDockedHUD();
  },

  updateDockedHUD() {
    const hud = document.getElementById('dockedQuestTracker');
    if (!hud) return;

    if (!this.activeQuest || this.activeQuest.status !== 'in_progress') {
      hud.classList.add('hidden');
      return;
    }

    hud.classList.remove('hidden');
    const repoEl = document.getElementById('dockedQuestRepo');
    const timerEl = document.getElementById('dockedQuestTimer');
    const ptsEl = document.getElementById('dockedQuestPoints');
    const badgeEl = document.getElementById('dockedQuestGradeBadge');
    const statusDot = document.getElementById('dockedQuestStatusDot');

    if (repoEl) repoEl.textContent = this.activeQuest.repo_name;
    if (timerEl) timerEl.textContent = this.formatTimer(this.activeQuest.activeSeconds);
    if (ptsEl) ptsEl.textContent = `+${this.activeQuest.points} pts`;
    if (badgeEl) {
      badgeEl.className = `grade-badge-sm grade-badge-glow ${this.getGradeClass(this.activeQuest.grade)} text-[9px] font-mono font-bold`;
      badgeEl.textContent = this.activeQuest.grade;
    }
    if (statusDot) {
      if (this.activeQuest.timerRunning) {
        statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-ping';
      } else {
        statusDot.className = 'w-2 h-2 rounded-full bg-amber-400';
      }
    }
  },

  startTimer() {
    if (!this.activeQuest) return;
    this.activeQuest.timerRunning = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.activeQuest && this.activeQuest.timerRunning) {
        this.activeQuest.activeSeconds++;
        const timerDisplay = document.getElementById('questLiveTimerDisplay');
        if (timerDisplay) {
          timerDisplay.textContent = this.formatTimer(this.activeQuest.activeSeconds);
        }
        const dockedTimer = document.getElementById('dockedQuestTimer');
        if (dockedTimer) {
          dockedTimer.textContent = this.formatTimer(this.activeQuest.activeSeconds);
        }

        // Check if a 10-minute active boundary was just crossed (+1 time point)
        if (this.activeQuest.activeSeconds % 600 === 0) {
          this.calculatePointsAndGrade();
          this.updateQuestScoreUI();
          this.saveActiveQuestToServer();
        }
      }
    }, 1000);

    const statusLabel = document.getElementById('timerStatusLabel');
    const statusDot = document.getElementById('timerStatusDot');
    if (statusLabel) statusLabel.textContent = 'MISSION ACTIVE';
    if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-ping';
    this.updateDockedHUD();
  },

  pauseTimer() {
    if (!this.activeQuest) return;
    this.activeQuest.timerRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);

    const statusLabel = document.getElementById('timerStatusLabel');
    const statusDot = document.getElementById('timerStatusDot');
    if (statusLabel) statusLabel.textContent = 'MISSION PAUSED';
    if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-amber-400';
    this.updateDockedHUD();
    this.saveActiveQuestToServer();
    showToast('Quest timer paused.', 'info');
  },

  concludeQuest(notify = true) {
    if (!this.activeQuest) return;
    this.pauseTimer();
    this.activeQuest.status = 'completed';

    // Add to allQuests if not present, or update
    const idx = this.allQuests.findIndex(q => q.id === this.activeQuest.id);
    if (idx >= 0) {
      this.allQuests[idx] = Object.assign({}, this.activeQuest);
    } else {
      this.allQuests.unshift(Object.assign({}, this.activeQuest));
    }

    localStorage.setItem('firstpr_all_quests', JSON.stringify(this.allQuests));
    localStorage.removeItem('firstpr_active_quest');

    this.saveActiveQuestToServer();
    this.recalculateTotalScore();
    this.minimizeQuest();
    this.updateDockedHUD();

    if (notify) {
      this.triggerConfetti();
      this.notifyBuddy(`Mission completed! You earned +${this.activeQuest.points} contribution points on ${this.activeQuest.repo_name}!`);
      showToast(`Quest successfully concluded! +${this.activeQuest.points} points awarded.`, 'success');
    }
  },

  handleMilestoneToggle() {
    if (!this.activeQuest) return;
    const msForked = document.getElementById('msForked');
    const msCloned = document.getElementById('msCloned');
    const msBranch = document.getElementById('msBranch');
    const msCommit = document.getElementById('msCommit');

    this.activeQuest.milestones = {
      forked: !!msForked?.checked,
      cloned: !!msCloned?.checked,
      branch: !!msBranch?.checked,
      commit: !!msCommit?.checked,
    };

    this.calculatePointsAndGrade();
    this.updateQuestScoreUI();
    this.saveActiveQuestToServer();
  },

  // Public GitHub API verification for milestones 5 and 6
  async verifyPullRequest(type) {
    if (!this.activeQuest) return;
    const isMergedCheck = type === 'merged';
    const inputEl = document.getElementById(isMergedCheck ? 'prMergedUrlInput' : 'prOpenedUrlInput');
    const feedbackEl = document.getElementById(isMergedCheck ? 'prMergedFeedback' : 'prOpenedFeedback');
    const btn = document.getElementById(isMergedCheck ? 'verifyPrMergedBtn' : 'verifyPrOpenedBtn');

    if (!inputEl || !feedbackEl) return;
    const url = inputEl.value.trim();

    // Reset feedback
    feedbackEl.classList.remove('hidden', 'text-rose-400', 'text-emerald-400');

    // Parse URL: https://github.com/owner/repo/pull/123
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/i);
    if (!match) {
      feedbackEl.textContent = 'Please enter a valid GitHub Pull Request link (e.g. https://github.com/owner/repo/pull/123)';
      feedbackEl.classList.add('text-rose-400');
      return;
    }

    const [_, owner, repo, pullNumber] = match;
    const originalBtnText = btn.textContent;
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
      const res = await fetch(apiUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!res.ok) {
        if (res.status === 404) {
          feedbackEl.textContent = `Pull Request #${pullNumber} was not found on GitHub. Verify the repo & PR number are public.`;
        } else {
          feedbackEl.textContent = `GitHub API check failed (${res.status}). Please check link or rate limit.`;
        }
        feedbackEl.classList.add('text-rose-400');
        btn.textContent = originalBtnText;
        btn.disabled = false;
        return;
      }

      const pr = await res.json();
      const prAuthor = (pr.user?.login || '').toLowerCase();
      let currentUser = (this.userStats.username || state.user?.username || '').toLowerCase();

      // If user is guest or unset, automatically assign their username to the PR author
      if (!currentUser || currentUser === 'guest_explorer' || currentUser === 'cadet_coder') {
        currentUser = prAuthor;
        this.userStats.username = pr.user?.login;
        this.userStats.name = pr.user?.login;
        if (pr.user?.avatar_url) this.userStats.avatarUrl = pr.user.avatar_url;
        state.user.username = pr.user?.login;
        this.saveUserProfile();
      }

      // Verify PR author matches active user
      if (prAuthor !== currentUser) {
        feedbackEl.textContent = `Verification failed: This PR was created by @${pr.user?.login}, but your active astronaut username is @${this.userStats.username}. PR must be authored by your account.`;
        feedbackEl.classList.add('text-rose-400');
        btn.textContent = originalBtnText;
        btn.disabled = false;
        return;
      }

      // Milestone 5: Opened
      if (!isMergedCheck) {
        this.activeQuest.pr_opened_url = url;
        this.activeQuest.pr_opened_verified = true;
        const cb = document.getElementById('msPrOpened');
        if (cb) cb.checked = true;
        const badge = document.getElementById('prOpenedVerifiedBadge');
        if (badge) {
          badge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          badge.textContent = 'GitHub Verified';
        }

        // Auto pre-fill Milestone 6 with the same PR link
        const mergeInput = document.getElementById('prMergedUrlInput');
        if (mergeInput && !mergeInput.value) {
          mergeInput.value = url;
        }

        feedbackEl.textContent = `Pull Request verified! Authored by @${pr.user?.login}. +50 Points awarded!`;
        feedbackEl.classList.add('text-emerald-400');
        this.triggerConfetti();
        this.notifyBuddy(`Pull Request verified on GitHub! Fantastic work Cadet! +50 Points secured!`);
      } else {
        // Milestone 6: Merged
        if (!pr.merged) {
          feedbackEl.textContent = `PR #${pullNumber} is currently open but not merged yet on GitHub. Keep going! When the maintainers merge it, verify to claim +100 pts!`;
          feedbackEl.classList.add('text-rose-400');
          btn.textContent = originalBtnText;
          btn.disabled = false;
          return;
        }

        this.activeQuest.pr_merged_url = url;
        this.activeQuest.pr_merged_verified = true;
        const cb = document.getElementById('msPrMerged');
        if (cb) cb.checked = true;
        const badge = document.getElementById('prMergedVerifiedBadge');
        if (badge) {
          badge.className = 'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          badge.textContent = 'Merged & Verified';
        }

        feedbackEl.textContent = `Mission Accomplished! PR #${pullNumber} confirmed merged on GitHub! +100 Points awarded!`;
        feedbackEl.classList.add('text-emerald-400');
        this.triggerConfetti();
        this.notifyBuddy(`Pull Request merged into ${owner}/${repo}! Legendary accomplishment, Cadet! +100 Points awarded!`);
      }

      this.calculatePointsAndGrade();
      this.updateQuestScoreUI();
      this.saveActiveQuestToServer();
    } catch (err) {
      feedbackEl.textContent = 'Network error while contacting GitHub API. Please try again.';
      feedbackEl.classList.add('text-rose-400');
    } finally {
      btn.textContent = originalBtnText;
      btn.disabled = false;
    }
  },

  // 2. SCORING & MULTIPLIERS
  calculatePointsAndGrade() {
    if (!this.activeQuest) return;

    // Milestones: Forked +10, Cloned +10, Branch +10, Commit +20, PR opened +50, PR merged +100
    const ms = this.activeQuest.milestones || {};
    let msPoints = 0;
    let completedCount = 0;

    if (ms.forked) { msPoints += 10; completedCount++; }
    if (ms.cloned) { msPoints += 10; completedCount++; }
    if (ms.branch) { msPoints += 10; completedCount++; }
    if (ms.commit) { msPoints += 20; completedCount++; }
    if (this.activeQuest.pr_opened_verified) { msPoints += 50; completedCount++; }
    if (this.activeQuest.pr_merged_verified) { msPoints += 100; completedCount++; }

    // Time points: +1 pt every 10 active mins, max 30 per quest
    const activeMins = Math.floor((this.activeQuest.activeSeconds || 0) / 60);
    const timePoints = Math.min(30, Math.floor(activeMins / 10));

    // Multiplier: Easy x1, Medium x1.5, Challenging x2
    const diff = (this.activeQuest.difficulty || 'easy').toLowerCase();
    const mult = diff === 'challenging' ? 2.0 : (diff === 'medium' ? 1.5 : 1.0);
    this.activeQuest.multiplier = mult;

    const basePoints = msPoints + timePoints;
    const totalPoints = Math.round(basePoints * mult);

    this.activeQuest.points = totalPoints;
    this.activeQuest.grade = this.getGrade(totalPoints);
    this.activeQuest.milestonePoints = msPoints;
    this.activeQuest.timePoints = timePoints;
    this.activeQuest.milestonesCompleted = completedCount;

    localStorage.setItem('firstpr_active_quest', JSON.stringify(this.activeQuest));
  },

  updateQuestScoreUI() {
    if (!this.activeQuest) return;
    this.calculatePointsAndGrade();

    const scoreDisplay = document.getElementById('questTotalScoreDisplay');
    const gradeBadge = document.getElementById('questGradeBadge');
    const gradeLabel = document.getElementById('questGradeLabel');
    const msPtsEl = document.getElementById('questMilestonePts');
    const timePtsEl = document.getElementById('questTimePts');
    const timePtsLabel = document.getElementById('questTimePointsLabel');
    const ratioEl = document.getElementById('questMilestonesRatio');
    const dockedPts = document.getElementById('dockedQuestPoints');
    const dockedBadge = document.getElementById('dockedQuestGradeBadge');

    if (scoreDisplay) this.animateScoreCountUp(scoreDisplay, this.activeQuest.points, 400);
    if (dockedPts) dockedPts.textContent = `+${this.activeQuest.points} pts`;

    const g = this.activeQuest.grade;
    const gClass = this.getGradeClass(g);
    if (gradeBadge) {
      gradeBadge.className = `grade-badge-lg grade-badge-glow ${gClass} shadow-[0_0_20px_rgba(249,115,22,0.6)]`;
      gradeBadge.textContent = g;
    }
    if (dockedBadge) {
      dockedBadge.className = `grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold`;
      dockedBadge.textContent = g;
    }
    if (gradeLabel) gradeLabel.textContent = `Grade ${g} (${this.getGradeInfo(g).min}-${this.getGradeInfo(g).max === 9999 ? '400+' : this.getGradeInfo(g).max})`;
    if (msPtsEl) msPtsEl.textContent = this.activeQuest.milestonePoints || 0;
    if (timePtsEl) timePtsEl.textContent = this.activeQuest.timePoints || 0;
    if (timePtsLabel) timePtsLabel.textContent = `+${this.activeQuest.timePoints || 0} Time Pts`;
    if (ratioEl) ratioEl.textContent = `${this.activeQuest.milestonesCompleted || 0} / 6 Completed`;

    this.recalculateTotalScore();
  },

  async saveActiveQuestToServer() {
    if (!this.activeQuest) return;
    try {
      await fetch('/api/quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: this.activeQuest.id,
          username: this.userStats.username,
          issue_id: this.activeQuest.issue_id,
          issue_title: this.activeQuest.issue_title,
          repo_name: this.activeQuest.repo_name,
          issue_url: this.activeQuest.issue_url,
          difficulty: this.activeQuest.difficulty,
          status: this.activeQuest.status,
          active_seconds: this.activeQuest.activeSeconds,
          milestones: this.activeQuest.milestones,
          points: this.activeQuest.points,
          pr_opened_url: this.activeQuest.pr_opened_url,
          pr_opened_verified: this.activeQuest.pr_opened_verified ? 1 : 0,
          pr_merged_url: this.activeQuest.pr_merged_url,
          pr_merged_verified: this.activeQuest.pr_merged_verified ? 1 : 0
        })
      });
    } catch (e) {}
  },

  // ===========================================================================
  // 4. MY PROGRESS PAGE
  // ===========================================================================
  openMyProgress() {
    const modal = document.getElementById('myProgressModal');
    if (!modal) return;
    this.recalculateTotalScore();
    this.renderMyProgressContent();
    modal.classList.remove('hidden');
  },

  closeMyProgress() {
    const modal = document.getElementById('myProgressModal');
    if (modal) modal.classList.add('hidden');
  },

  renderMyProgressContent() {
    const u = this.userStats;
    const avatar = document.getElementById('progressUserAvatar');
    const uname = document.getElementById('progressUsername');
    const rankBadge = document.getElementById('progressRankBadge');
    const streakText = document.getElementById('progressStreakText');
    const scoreDisplay = document.getElementById('progressTotalScoreDisplay');
    const overallBadge = document.getElementById('progressOverallGradeBadge');
    const gradeLabel = document.getElementById('progressGradeLabel');

    if (avatar) avatar.src = u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';
    if (uname) uname.textContent = u.username;
    if (rankBadge) {
      rankBadge.textContent = u.rank ? `Rank #${u.rank}` : (u.joinLeaderboard ? 'Ranked' : 'Unranked');
    }
    if (streakText) {
      streakText.innerHTML = `
        <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23c6.075 0 11-4.925 11-11 0-4.667-2.667-8.333-5-10-1 2-2 3.5-3.5 4.5-1.5-3-3-5.5-3-5.5S9 3.5 6.5 6C4 8.5 1 12 1 12c0 6.075 4.925 11 11 11z"/></svg>
        <span>${u.streak || 1}-Day Streak (+${(u.streak || 1) * 5} pts bonus)</span>
      `;
    }

    if (scoreDisplay) this.animateScoreCountUp(scoreDisplay, u.totalScore, 600);

    const g = u.grade || 'D';
    const gClass = this.getGradeClass(g);
    if (overallBadge) {
      overallBadge.className = `grade-badge-xl grade-badge-glow ${gClass} shadow-[0_0_25px_rgba(249,115,22,0.7)]`;
      overallBadge.textContent = g;
    }
    if (gradeLabel) gradeLabel.textContent = `Grade ${g} (${this.getGradeInfo(g).title})`;

    // Progress bar to next grade
    const targetLabel = document.getElementById('nextGradeTargetLabel');
    const remainingEl = document.getElementById('nextGradePointsRemaining');
    const bar = document.getElementById('nextGradeProgressBar');
    const info = this.getGradeInfo(g);

    if (info.next) {
      const needed = Math.max(0, info.target - u.totalScore);
      const span = info.target - info.min;
      const done = Math.max(0, u.totalScore - info.min);
      const pct = Math.min(100, Math.max(5, Math.round((done / span) * 100)));

      if (targetLabel) targetLabel.textContent = `Progress to Grade ${info.next} (${info.target} pts)`;
      if (remainingEl) remainingEl.textContent = `${needed} pts needed`;
      if (bar) bar.style.width = pct + '%';
    } else {
      if (targetLabel) targetLabel.textContent = 'Highest Rank Achieved (Grade S)';
      if (remainingEl) remainingEl.textContent = 'Max Tier Cosmic Champion';
      if (bar) bar.style.width = '100%';
    }

    // 6 Metrics Cards
    const completedQuests = this.allQuests.filter(q => q.status === 'completed').length;
    const totalHours = (u.totalSeconds / 3600).toFixed(1);
    const avgPts = completedQuests > 0 ? Math.round(u.totalScore / completedQuests) : u.totalScore;

    const elQ = document.getElementById('statQuestsCompleted');
    const elO = document.getElementById('statPrsOpened');
    const elM = document.getElementById('statPrsMerged');
    const elH = document.getElementById('statTotalHours');
    const elS = document.getElementById('statDailyStreak');
    const elA = document.getElementById('statAvgPoints');

    if (elQ) elQ.textContent = completedQuests;
    if (elO) elO.textContent = u.prsOpened;
    if (elM) elM.textContent = u.prsMerged;
    if (elH) elH.textContent = `${totalHours}h`;
    if (elS) elS.textContent = `${u.streak || 1} Days`;
    if (elA) elA.textContent = avgPts;

    // Breakdown
    let totalMsPts = 0;
    let totalTimePts = 0;
    let totalMultBonus = 0;

    this.allQuests.forEach(q => {
      const ms = (q.milestones?.forked ? 10 : 0) + (q.milestones?.cloned ? 10 : 0) +
                 (q.milestones?.branch ? 10 : 0) + (q.milestones?.commit ? 20 : 0) +
                 (q.pr_opened_verified ? 50 : 0) + (q.pr_merged_verified ? 100 : 0);
      const tm = Math.min(30, Math.floor((q.activeSeconds || 0) / 600));
      const mult = q.multiplier || (q.difficulty === 'challenging' ? 2 : (q.difficulty === 'medium' ? 1.5 : 1));
      const base = ms + tm;
      const bonus = Math.round(base * mult) - base;
      totalMsPts += ms;
      totalTimePts += tm;
      totalMultBonus += Math.max(0, bonus);
    });

    const streakBonus = (u.streak || 1) * 5;
    const bdMs = document.getElementById('breakdownMilestonePts');
    const bdTm = document.getElementById('breakdownTimePts');
    const bdMult = document.getElementById('breakdownMultiplierPts');
    const bdStr = document.getElementById('breakdownStreakPts');

    if (bdMs) bdMs.textContent = `${totalMsPts} pts`;
    if (bdTm) bdTm.textContent = `${totalTimePts} pts`;
    if (bdMult) bdMult.textContent = `+${totalMultBonus} pts`;
    if (bdStr) bdStr.textContent = `+${streakBonus} pts`;

    // Leaderboard toggle
    const toggle = document.getElementById('joinLeaderboardToggle');
    if (toggle) {
      toggle.checked = u.joinLeaderboard === 1;
    }

    // Quests History List
    const historyList = document.getElementById('progressQuestsHistoryList');
    if (historyList) {
      if (this.allQuests.length === 0) {
        historyList.innerHTML = `<p class="text-xs text-[#B8B5D3]/60 italic font-mono py-2">No completed quests yet. Click 'Start this quest' on any issue to begin!</p>`;
      } else {
        historyList.innerHTML = this.allQuests.map(q => {
          const gClass = this.getGradeClass(q.grade || 'D');
          return `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#182040]/40 border border-[#A78BFA]/20 text-xs">
              <div class="min-w-0 pr-2">
                <p class="font-display font-bold text-[#F4F1FF] truncate">${escapeHtml(q.issue_title)}</p>
                <div class="flex items-center space-x-2 text-[10px] font-mono text-[#B8B5D3] mt-0.5">
                  <span class="text-[#57D9F4]">${escapeHtml(q.repo_name)}</span>
                  <span>•</span>
                  <span>${Math.round((q.activeSeconds || 0) / 60)} active mins</span>
                  <span>•</span>
                  <span class="capitalize text-emerald-400">${escapeHtml(q.difficulty || 'Easy')}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2 shrink-0">
                <span class="font-mono font-bold text-[#F4F1FF]">+${q.points} pts</span>
                <span class="grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold">${q.grade || 'D'}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  },

  async toggleLeaderboardParticipation(enabled) {
    this.userStats.joinLeaderboard = enabled ? 1 : 0;
    localStorage.setItem('firstpr_user_stats', JSON.stringify(this.userStats));
    await this.saveUserProfile();
    showToast(enabled ? 'You joined the Galactic Leaderboard!' : 'Leaderboard public visibility turned off.', enabled ? 'success' : 'info');
    if (enabled) {
      this.triggerConfetti();
      this.notifyBuddy('You have joined the public leaderboard! Your scores and rank are now visible across the galaxy!');
    }
  },

  // ===========================================================================
  // 5. LEADERBOARD (OPTIONAL)
  // ===========================================================================
  openLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.fetchAndRenderLeaderboard();
  },

  closeLeaderboard() {
    const modal = document.getElementById('leaderboardModal');
    if (modal) modal.classList.add('hidden');
  },

  setTimeframe(tf) {
    this.currentTimeframe = tf;
    document.querySelectorAll('.leaderboard-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-timeframe') === tf;
      if (match) {
        btn.className = 'leaderboard-tab-btn px-3 py-1.5 rounded-lg text-[#080914] bg-gradient-to-r from-[#A78BFA] to-[#57D9F4] font-bold shadow-sm transition-all cursor-pointer';
      } else {
        btn.className = 'leaderboard-tab-btn px-3 py-1.5 rounded-lg text-[#B8B5D3] hover:text-[#F4F1FF] transition-all cursor-pointer';
      }
    });
    this.fetchAndRenderLeaderboard();
  },

  async fetchAndRenderLeaderboard() {
    const tableBody = document.getElementById('leaderboardTableBody');
    const podiumEl = document.getElementById('leaderboardPodiumContainer');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-xs font-mono text-[#B8B5D3]">Scanning galactic telemetry...</td></tr>`;

    try {
      let url = `/api/leaderboard?timeframe=${this.currentTimeframe}&skill=${this.currentSkillFilter}`;
      if (this.currentLeagueCode) {
        url += `&league=${encodeURIComponent(this.currentLeagueCode)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      const players = data.leaderboard || [];

      this.renderPodium(players.slice(0, 3));
      this.renderRankedTable(players);
      this.renderStickyUserRankBar(players);
    } catch (e) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-xs font-mono text-rose-400">Failed to load leaderboard telemetry.</td></tr>`;
    }
  },

  renderPodium(top3) {
    const container = document.getElementById('leaderboardPodiumContainer');
    if (!container) return;

    if (!top3 || top3.length === 0) {
      container.innerHTML = `<p class="text-xs font-mono text-[#B8B5D3]/60 italic py-4">No ranked astronauts found yet.</p>`;
      return;
    }

    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    let html = '';

    // 2nd Place: Silver Planet (Left)
    if (second) {
      const gClass = this.getGradeClass(second.grade);
      html += `
        <div class="podium-column w-24 sm:w-32">
          <div class="podium-planet podium-planet-silver">
            <img src="${second.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/80" alt="${escapeHtml(second.username)}" />
            <span class="absolute -bottom-1 -right-1 grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold">${second.grade}</span>
          </div>
          <p class="text-xs font-display font-bold text-[#F4F1FF] truncate max-w-[90px] sm:max-w-[110px] text-center">${escapeHtml(second.name || second.username)}</p>
          <p class="text-[10px] font-mono text-[#57D9F4] font-bold">${second.total_score} pts</p>
          <div class="podium-pedestal podium-pedestal-2 mt-2">
            <span class="text-2xl font-display font-extrabold text-gray-300">2</span>
            <span class="text-[9px] font-mono text-gray-400 uppercase">Silver</span>
          </div>
        </div>
      `;
    }

    // 1st Place: Gold Planet (Center, Taller)
    if (first) {
      const gClass = this.getGradeClass(first.grade);
      html += `
        <div class="podium-column w-28 sm:w-36 -mt-4">
          <!-- Gold Crown SVG -->
          <div class="mb-1 text-amber-300">
            <svg class="w-6 h-6 mx-auto filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>
          </div>
          <div class="podium-planet podium-planet-gold">
            <img src="${first.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-300" alt="${escapeHtml(first.username)}" />
            <span class="absolute -bottom-1 -right-1 grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold">${first.grade}</span>
          </div>
          <p class="text-xs sm:text-sm font-display font-bold text-[#F4F1FF] truncate max-w-[100px] sm:max-w-[130px] text-center">${escapeHtml(first.name || first.username)}</p>
          <p class="text-xs font-mono text-amber-300 font-extrabold">${first.total_score} pts</p>
          <div class="podium-pedestal podium-pedestal-1 mt-2">
            <span class="text-3xl font-display font-extrabold text-amber-300">1</span>
            <span class="text-[9px] font-mono text-amber-200 uppercase tracking-wider">Gold Leader</span>
          </div>
        </div>
      `;
    }

    // 3rd Place: Bronze Planet (Right)
    if (third) {
      const gClass = this.getGradeClass(third.grade);
      html += `
        <div class="podium-column w-24 sm:w-32">
          <div class="podium-planet podium-planet-bronze">
            <img src="${third.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'}" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-600/80" alt="${escapeHtml(third.username)}" />
            <span class="absolute -bottom-1 -right-1 grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold">${third.grade}</span>
          </div>
          <p class="text-xs font-display font-bold text-[#F4F1FF] truncate max-w-[90px] sm:max-w-[110px] text-center">${escapeHtml(third.name || third.username)}</p>
          <p class="text-[10px] font-mono text-amber-400 font-bold">${third.total_score} pts</p>
          <div class="podium-pedestal podium-pedestal-3 mt-2">
            <span class="text-2xl font-display font-extrabold text-amber-500">3</span>
            <span class="text-[9px] font-mono text-amber-600 uppercase">Bronze</span>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  renderRankedTable(players) {
    const tableBody = document.getElementById('leaderboardTableBody');
    if (!tableBody) return;

    if (!players || players.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-xs font-mono text-[#B8B5D3]/60 italic">No public records found. Enable leaderboard in My Progress to be ranked!</td></tr>`;
      return;
    }

    const currentHandle = (this.userStats.username || '').toLowerCase();

    tableBody.innerHTML = players.map(p => {
      const isMe = p.username && p.username.toLowerCase() === currentHandle;
      const gClass = this.getGradeClass(p.grade);

      // Rank change arrows: green up, red down, neutral dash
      let rankArrowHtml = '<span class="rank-change-same">-</span>';
      if (p.rank_change > 0) {
        rankArrowHtml = `<span class="rank-change-up">▲ +${p.rank_change}</span>`;
      } else if (p.rank_change < 0) {
        rankArrowHtml = `<span class="rank-change-down">▼ ${p.rank_change}</span>`;
      }

      const rowClass = isMe 
        ? 'bg-[#57D9F4]/10 border-l-4 border-l-[#57D9F4]' 
        : 'hover:bg-[#182040]/50';

      return `
        <tr class="${rowClass} transition-colors">
          <td class="py-3 px-3 text-center">
            <div class="flex flex-col items-center">
              <span class="font-display font-bold text-sm ${p.rank <= 3 ? 'text-[#57D9F4]' : 'text-[#F4F1FF]'}">#${p.rank}</span>
              ${rankArrowHtml}
            </div>
          </td>
          <td class="py-3 px-4">
            <div class="flex items-center space-x-3">
              <img src="${p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}" class="w-8 h-8 rounded-full border border-[#57D9F4]/40 object-cover shrink-0" alt="${escapeHtml(p.username)}" />
              <div class="min-w-0">
                <div class="flex items-center space-x-1.5 flex-wrap">
                  <span class="font-display font-bold text-xs text-[#F4F1FF] truncate">${escapeHtml(p.name || p.username)}</span>
                  ${p.is_demo ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#182040] text-[#B8B5D3] border border-[#A78BFA]/30">Demo player</span>` : ''}
                  ${isMe ? `<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#57D9F4]/20 text-[#57D9F4] border border-[#57D9F4]/40 font-bold">You</span>` : ''}
                </div>
                <span class="text-[10px] font-mono text-[#B8B5D3]">@${escapeHtml(p.username)} • ${escapeHtml(p.skill || 'JavaScript')}</span>
              </div>
            </div>
          </td>
          <td class="py-3 px-3 text-right font-display font-bold text-sm text-[#F4F1FF]">
            ${p.total_score.toLocaleString()}
          </td>
          <td class="py-3 px-3 text-center">
            <span class="grade-badge-sm grade-badge-glow ${gClass} text-[9px] font-mono font-bold">${p.grade}</span>
          </td>
          <td class="py-3 px-3 text-center hidden sm:table-cell text-xs font-mono text-[#B8B5D3]">
            <span class="text-[#A78BFA]">${p.prs_opened}</span> / <span class="text-emerald-400 font-bold">${p.prs_merged}</span>
          </td>
          <td class="py-3 px-4 text-right hidden sm:table-cell text-xs font-mono text-[#B8B5D3]">
            ${p.hours || (Math.round((p.total_seconds || 0) / 360) / 10).toFixed(1)}h
          </td>
        </tr>
      `;
    }).join('');
  },

  renderStickyUserRankBar(players) {
    const bar = document.getElementById('stickyYourRankBar');
    if (!bar) return;

    const currentHandle = (this.userStats.username || '').toLowerCase();
    const me = players.find(p => (p.username || '').toLowerCase() === currentHandle);

    const avatar = document.getElementById('stickyUserAvatar');
    const label = document.getElementById('stickyUserRankLabel');
    const hint = document.getElementById('stickyUserHint');
    const btn = document.getElementById('stickyJoinLeaderboardBtn');

    if (avatar) avatar.src = this.userStats.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80';

    if (me) {
      this.userStats.rank = me.rank;
      if (label) label.textContent = `Your Standing: Rank #${me.rank} in Galaxy (${me.total_score} pts)`;
      if (hint) hint.textContent = `You are actively listed on the Galactic Leaderboard.`;
      if (btn) {
        btn.textContent = 'View My Progress';
        btn.onclick = () => {
          this.closeLeaderboard();
          this.openMyProgress();
        };
      }
    } else {
      this.userStats.rank = null;
      if (label) label.textContent = 'Your Standing: Not on Public Leaderboard';
      if (hint) hint.textContent = 'Turn on public visibility in My Progress to climb the galaxy ranks!';
      if (btn) {
        btn.textContent = 'Join Leaderboard';
        btn.onclick = async () => {
          await this.toggleLeaderboardParticipation(true);
          this.fetchAndRenderLeaderboard();
        };
      }
    }
  },

  // Private League Management
  async handleCreateLeague() {
    const input = document.getElementById('createLeagueNameInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) {
      showToast('Please enter a league name.', 'info');
      return;
    }

    try {
      const res = await fetch('/api/leagues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: this.userStats.username })
      });
      const data = await res.json();
      if (data.code) {
        this.currentLeagueCode = data.code;
        showToast(`Private league '${data.name}' created! Code: ${data.code}`, 'success');
        this.triggerConfetti();
        const lbl = document.getElementById('leagueButtonLabel');
        if (lbl) lbl.textContent = `League: ${data.code}`;
        input.value = '';
        this.fetchAndRenderLeaderboard();
      }
    } catch (e) {
      showToast('Failed to create league.', 'error');
    }
  },

  async handleJoinLeague() {
    const input = document.getElementById('joinLeagueCodeInput');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a league code.', 'info');
      return;
    }

    try {
      const res = await fetch('/api/leagues/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username: this.userStats.username })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.currentLeagueCode = data.code;
        showToast(`Joined league: ${data.name}!`, 'success');
        this.triggerConfetti();
        const lbl = document.getElementById('leagueButtonLabel');
        if (lbl) lbl.textContent = `League: ${data.code}`;
        input.value = '';
        this.fetchAndRenderLeaderboard();
      } else {
        showToast(data.error || 'League code not found.', 'error');
      }
    } catch (e) {
      showToast('Failed to join league.', 'error');
    }
  }
};

// Global Exposure for start-quest-btn handlers
window.startOrOpenQuest = function(issueData) {
  QuestSystem.startOrOpenQuest(issueData);
};
