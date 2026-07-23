export type Locale = "zh" | "en"

type LocalizedString = Record<Locale, string>

export interface Project {
  id: string
  image: string
  gallery: string[]
  year: string
  accent: string
  title: LocalizedString
  summary: LocalizedString
  category: LocalizedString
  role: LocalizedString
  description: LocalizedString
  challenge: LocalizedString
  solution: LocalizedString
  outcome: LocalizedString
  tags: string[]
}

export interface Experience {
  period: LocalizedString
  company: LocalizedString
  role: LocalizedString
  description: LocalizedString
}

// ---------------------------------------------------------------------------
// Static fallback data (kept for backwards compatibility & client components)
// ---------------------------------------------------------------------------

/** @deprecated Use `fetchProjects()` instead. Kept as fallback. */
export const projects: Project[] = [
  {
    id: "fintech",
    image: "/projects/fintech.png",
    gallery: ["/projects/fintech-1.png", "/projects/fintech-2.png"],
    year: "2025",
    accent: "oklch(0.6 0.12 250)",
    title: { zh: "Lumen 理财", en: "Lumen Finance" },
    summary: {
      zh: "让个人理财像呼吸一样自然",
      en: "Personal finance that feels effortless",
    },
    category: { zh: "移动端 · 金融科技", en: "Mobile · Fintech" },
    role: { zh: "产品设计 / 交互", en: "Product Design / Interaction" },
    description: {
      zh: "为新一代年轻用户打造的移动理财应用。通过清晰的信息层级、可视化的消费图表与柔和的动效，把复杂的资金流动变得一目了然，帮助用户建立健康的储蓄习惯。",
      en: "A mobile banking app built for a new generation. Through clear hierarchy, visual spending charts and soft motion, complex money flows become instantly legible, helping users build healthy saving habits.",
    },
    challenge: {
      zh: "传统银行 App 功能繁杂、层级混乱，年轻用户难以快速掌握自己的财务状况，记账与预算功能形同虚设。",
      en: "Traditional banking apps are cluttered and confusing. Young users struggle to grasp their finances at a glance, and budgeting features go unused.",
    },
    solution: {
      zh: "重新梳理信息架构，以「一屏概览」为核心，用可视化图表与柔和动效呈现收支与预算，并引入渐进式引导降低上手门槛。",
      en: "We rebuilt the information architecture around a single overview screen, using visual charts and soft motion for income, spending and budgets, with progressive onboarding to lower the barrier to entry.",
    },
    outcome: {
      zh: "上线后次日留存提升 34%，用户平均每周主动查看理财报告 3.2 次，储蓄目标达成率显著提高。",
      en: "Day-one retention rose 34% after launch, users checked their finance report 3.2 times per week on average, and saving-goal completion improved markedly.",
    },
    tags: ["Figma", "iOS", "Design System", "Motion"],
  },
  {
    id: "smarthome",
    image: "/projects/smarthome.png",
    gallery: ["/projects/smarthome-1.png", "/projects/smarthome-2.png"],
    year: "2025",
    accent: "oklch(0.62 0.1 60)",
    title: { zh: "Nest 智能家居", en: "Nest Home" },
    summary: {
      zh: "一块面板掌控整个家",
      en: "Control the whole home from one panel",
    },
    category: { zh: "桌面端 · 物联网", en: "Desktop · IoT" },
    role: { zh: "界面设计 / 系统", en: "UI Design / System" },
    description: {
      zh: "智能家居中控台设计。将灯光、温度、安防等分散的设备聚合到统一的控制中心，通过卡片式布局与情景模式，让家庭自动化触手可及。",
      en: "A smart home control dashboard. Scattered devices for lighting, climate and security are unified into one hub, where card-based layouts and scene presets make home automation truly within reach.",
    },
    challenge: {
      zh: "家中设备来自不同品牌，App 各自为政，用户需要在多个应用间反复切换，自动化配置门槛高。",
      en: "Home devices span many brands with siloed apps, forcing users to switch back and forth, while automation setup remains intimidating.",
    },
    solution: {
      zh: "设计统一的中控台，用卡片聚合设备状态，并支持自定义情景模式一键联动，把复杂配置收敛为可视化操作。",
      en: "A unified control hub aggregates device status in cards and supports one-tap custom scenes, folding complex configuration into visual, tangible controls.",
    },
    outcome: {
      zh: "设备操作步骤平均减少 60%，情景模式被 78% 的用户纳入日常使用。",
      en: "Average steps to control a device dropped 60%, and 78% of users adopted scenes in their daily routine.",
    },
    tags: ["Figma", "Web", "Dashboard", "IoT"],
  },
  {
    id: "ecommerce",
    image: "/projects/ecommerce.png",
    gallery: ["/projects/ecommerce-1.png", "/projects/ecommerce-2.png"],
    year: "2024",
    accent: "oklch(0.55 0.02 20)",
    title: { zh: "Atelier 时尚商城", en: "Atelier Store" },
    summary: {
      zh: "为设计师品牌打造的购物体验",
      en: "A shopping experience for design-led brands",
    },
    category: { zh: "桌面端 · 电商", en: "Desktop · E-commerce" },
    role: { zh: "视觉设计 / 体验", en: "Visual Design / UX" },
    description: {
      zh: "高端时尚电商网站的重设计。以留白与精致排版突出商品本身，优化的浏览与结算流程显著提升了转化率与用户停留时长。",
      en: "A redesign of a high-end fashion store. Whitespace and refined typography let the products speak, while an optimized browsing and checkout flow lifted conversion and dwell time.",
    },
    challenge: {
      zh: "小众设计师品牌需要在保留调性的同时提升转化，原站点信息拥挤、跳出率偏高。",
      en: "A design-led brand needed to lift conversion without losing its tone; the old site was crowded with a high bounce rate.",
    },
    solution: {
      zh: "以大量留白与精致排版突出商品，重构浏览与结算流程，缩短从浏览到下单的决策路径。",
      en: "Whitespace and refined typography spotlight the products, while a rebuilt browsing and checkout flow shortens the path from viewing to buying.",
    },
    outcome: {
      zh: "结算完成率提升 27%，平均停留时长增加 41%，品牌调性获得客户高度认可。",
      en: "Checkout completion rose 27%, average dwell time increased 41%, and the client praised how well the brand tone was preserved.",
    },
    tags: ["Figma", "Web", "Branding", "E-commerce"],
  },
  {
    id: "health",
    image: "/projects/health.png",
    gallery: ["/projects/health-1.png", "/projects/health-2.png"],
    year: "2024",
    accent: "oklch(0.65 0.13 150)",
    title: { zh: "Pulse 健康", en: "Pulse Health" },
    summary: {
      zh: "把健康数据变成前进的动力",
      en: "Turning health data into momentum",
    },
    category: { zh: "移动端 · 健康", en: "Mobile · Health" },
    role: { zh: "产品设计 / 数据可视化", en: "Product Design / Data Viz" },
    description: {
      zh: "健康与运动追踪应用。用活动圆环、心率曲线与每日目标激励用户坚持锻炼，温暖的配色与恰到好处的鼓励让坚持变得轻松。",
      en: "A health and fitness tracker. Activity rings, heart-rate curves and daily goals motivate users to keep moving, with a warm palette and gentle encouragement that make consistency feel easy.",
    },
    challenge: {
      zh: "健康数据枯燥且难以坚持，用户容易在记录几天后放弃，难以形成长期习惯。",
      en: "Health data is dry and hard to sustain; users often quit logging after a few days and never build a lasting habit.",
    },
    solution: {
      zh: "用活动圆环、心率曲线与每日目标构建正向激励，配合温暖配色与适度提醒，让每一次进步都被看见。",
      en: "Activity rings, heart-rate curves and daily goals build positive reinforcement, paired with a warm palette and well-timed reminders so every bit of progress is seen.",
    },
    outcome: {
      zh: "30 天持续使用率达到 52%，远高于行业平均水平，用户日均活跃时长稳步增长。",
      en: "30-day retention reached 52%, well above the industry average, with steady growth in daily active time.",
    },
    tags: ["Figma", "iOS", "Data Viz", "Wellness"],
  },
  {
    id: "music",
    image: "/projects/music.png",
    gallery: ["/projects/music-1.png", "/projects/music-2.png"],
    year: "2024",
    accent: "oklch(0.5 0.05 300)",
    title: { zh: "Echo 音乐", en: "Echo Music" },
    summary: {
      zh: "沉浸式的聆听旅程",
      en: "An immersive listening journey",
    },
    category: { zh: "移动端 · 流媒体", en: "Mobile · Streaming" },
    role: { zh: "界面设计 / 动效", en: "UI Design / Motion" },
    description: {
      zh: "音乐流媒体应用的深色界面设计。围绕专辑封面构建沉浸式播放体验，流畅的过渡动效与智能推荐让每一次聆听都恰到好处。",
      en: "A dark-mode music streaming interface. Built around album art for an immersive playback experience, with fluid transitions and smart recommendations that make every listen feel just right.",
    },
    challenge: {
      zh: "音乐产品同质化严重，难以在播放体验上形成记忆点，用户忠诚度低。",
      en: "Music apps feel interchangeable, making a memorable playback experience hard to achieve and loyalty hard to earn.",
    },
    solution: {
      zh: "围绕专辑封面构建沉浸式深色界面，用流畅过渡与智能推荐串联聆听旅程，强化情绪表达。",
      en: "An immersive dark interface built around album art, with fluid transitions and smart recommendations that connect the listening journey and heighten emotion.",
    },
    outcome: {
      zh: "单次使用时长提升 23%，歌单分享率翻倍，品牌辨识度显著增强。",
      en: "Session length grew 23%, playlist sharing doubled, and brand recognition improved significantly.",
    },
    tags: ["Figma", "iOS", "Dark UI", "Motion"],
  },
  {
    id: "travel",
    image: "/projects/travel.png",
    gallery: ["/projects/travel-1.png", "/projects/travel-2.png"],
    year: "2023",
    accent: "oklch(0.58 0.09 220)",
    title: { zh: "Voyage 旅行", en: "Voyage Travel" },
    summary: {
      zh: "从灵感到出发的完整旅程",
      en: "From inspiration to departure",
    },
    category: { zh: "桌面端 · 旅游", en: "Desktop · Travel" },
    role: { zh: "体验设计 / 视觉", en: "UX Design / Visual" },
    description: {
      zh: "旅行预订平台设计。以大幅目的地影像激发探索欲，简化的搜索与预订流程把灵感到成行之间的每一步都梳理得清晰顺畅。",
      en: "A travel booking platform. Large destination imagery sparks wanderlust, while a streamlined search and booking flow smooths every step from inspiration to a confirmed trip.",
    },
    challenge: {
      zh: "旅行决策链路长，用户在灵感与预订之间频繁流失，信息分散难以比较。",
      en: "Travel decisions are long; users drop off between inspiration and booking, and scattered information is hard to compare.",
    },
    solution: {
      zh: "以大幅目的地影像激发探索欲，把搜索、比价与预订整合到连贯流程中，减少认知负担。",
      en: "Large destination imagery sparks exploration, unifying search, comparison and booking into one coherent flow that reduces cognitive load.",
    },
    outcome: {
      zh: "预订转化率提升 19%，用户探索深度显著增加，跨设备体验保持一致。",
      en: "Booking conversion rose 19%, exploration depth grew markedly, and the experience stayed consistent across devices.",
    },
    tags: ["Figma", "Web", "Booking", "Visual"],
  },
  {
    id: "saas",
    image: "/projects/saas.png",
    gallery: ["/projects/saas-1.png", "/projects/saas-2.png"],
    year: "2023",
    accent: "oklch(0.55 0.11 265)",
    title: { zh: "Prism 数据台", en: "Prism Analytics" },
    summary: {
      zh: "让数据讲出清晰的故事",
      en: "Making data tell a clear story",
    },
    category: { zh: "桌面端 · SaaS", en: "Desktop · SaaS" },
    role: { zh: "产品设计 / 系统", en: "Product Design / System" },
    description: {
      zh: "B端 SaaS 数据分析仪表盘。构建了一套可扩展的组件系统与图表规范，帮助团队在海量指标中快速定位关键洞察并做出决策。",
      en: "A B2B SaaS analytics dashboard. A scalable component system and charting standards help teams surface key insights from a sea of metrics and act on them quickly.",
    },
    challenge: {
      zh: "B 端产品指标繁多，团队难以从海量数据中快速定位关键洞察，报表构建效率低。",
      en: "B2B products have countless metrics; teams struggle to surface key insights from the noise, and building reports is slow.",
    },
    solution: {
      zh: "建立可扩展的组件系统与图表规范，用清晰的层级与筛选帮助用户聚焦决策，统一设计语言。",
      en: "A scalable component system and charting standards with clear hierarchy and filtering help users focus on decisions under one unified design language.",
    },
    outcome: {
      zh: "关键报表的构建时间缩短 45%，设计交付效率与团队协作质量大幅提升。",
      en: "Time to build key reports dropped 45%, greatly improving delivery efficiency and cross-team collaboration.",
    },
    tags: ["Figma", "Web", "Design System", "Charts"],
  },
  {
    id: "education",
    image: "/projects/education.png",
    gallery: ["/projects/education-1.png", "/projects/education-2.png"],
    year: "2023",
    accent: "oklch(0.62 0.1 40)",
    title: { zh: "Cova 学堂", en: "Cova Learn" },
    summary: {
      zh: "为专注而设计的学习空间",
      en: "A learning space designed for focus",
    },
    category: { zh: "平板端 · 教育", en: "Tablet · Education" },
    role: { zh: "界面设计 / 体验", en: "UI Design / UX" },
    description: {
      zh: "在线教育平台设计。围绕课程学习路径构建清晰的进度追踪与视频学习界面，温暖的配色营造出专注而不焦虑的学习氛围。",
      en: "An online learning platform. Built around clear learning paths with progress tracking and a focused video lesson interface, its warm palette creates an atmosphere of calm concentration.",
    },
    challenge: {
      zh: "在线学习容易分心，学生难以坚持完成完整课程路径，学习动机随时间衰减。",
      en: "Online learning invites distraction; students rarely finish full course paths and motivation fades over time.",
    },
    solution: {
      zh: "围绕学习路径设计清晰的进度追踪与专注的视频界面，用温暖配色营造沉浸而不焦虑的氛围。",
      en: "Clear progress tracking and a focused video interface around learning paths, with a warm palette for an immersive yet calm mood.",
    },
    outcome: {
      zh: "课程完成率提升 38%，学习时长稳步增长，用户满意度评分持续走高。",
      en: "Course completion rose 38%, study time grew steadily, and satisfaction scores kept climbing.",
    },
    tags: ["Figma", "iPad", "Education", "UX"],
  },
  {
    id: "food",
    image: "/projects/food.png",
    gallery: ["/projects/food-1.png", "/projects/food-2.png"],
    year: "2022",
    accent: "oklch(0.65 0.15 50)",
    title: { zh: "Savor 外卖", en: "Savor Delivery" },
    summary: {
      zh: "三步下单，好味立刻到家",
      en: "Great food, three taps away",
    },
    category: { zh: "移动端 · 生活服务", en: "Mobile · Lifestyle" },
    role: { zh: "产品设计 / 交互", en: "Product Design / Interaction" },
    description: {
      zh: "餐饮外卖应用设计。通过诱人的食物影像、清晰的分类导航与极简的下单流程，把从选择到收货的体验压缩到最短路径。",
      en: "A food delivery app. Appetizing imagery, clear category navigation and a minimal ordering flow compress the experience from choosing to receiving into the shortest possible path.",
    },
    challenge: {
      zh: "外卖下单步骤繁琐，用户在选择与结算环节流失明显，决策疲劳严重。",
      en: "Food ordering is tedious, with clear drop-off during choosing and checkout and heavy decision fatigue.",
    },
    solution: {
      zh: "用诱人的食物影像与清晰分类加速选择，把下单流程压缩到三步之内，减少每一次犹豫。",
      en: "Appetizing imagery and clear categories speed up choosing, compressing the order flow into three steps and cutting hesitation.",
    },
    outcome: {
      zh: "下单转化率提升 31%，复购频次明显提高，用户好评率稳步上升。",
      en: "Order conversion rose 31%, repeat frequency climbed noticeably, and positive ratings kept rising.",
    },
    tags: ["Figma", "iOS", "Lifestyle", "Interaction"],
  },
]

/** @deprecated Use `fetchSiteData()` instead. Kept as fallback. */
export const experiences: Experience[] = [
  {
    period: { zh: "2021 — 至今", en: "2021 — Present" },
    company: { zh: "自由设计顾问", en: "Independent Design Consultant" },
    role: { zh: "数字产品设计师", en: "Digital Product Designer" },
    description: {
      zh: "为初创团队与成熟品牌提供端到端的产品设计服务，覆盖用户研究、交互设计、视觉设计与设计系统搭建，交付移动端、桌面端及多平台产品。",
      en: "Providing end-to-end product design for startups and established brands — from user research and interaction to visual design and design systems — across mobile, desktop and multi-platform products.",
    },
  },
  {
    period: { zh: "2018 — 2021", en: "2018 — 2021" },
    company: { zh: "云图科技", en: "Yuntu Technology" },
    role: { zh: "高级 UI/UX 设计师", en: "Senior UI/UX Designer" },
    description: {
      zh: "主导企业级 SaaS 数据平台的体验设计，建立可扩展的组件系统与图表规范，显著提升团队的设计交付效率与产品一致性。",
      en: "Led experience design for an enterprise SaaS data platform, building a scalable component system and charting standards that greatly improved delivery efficiency and product consistency.",
    },
  },
  {
    period: { zh: "2016 — 2018", en: "2016 — 2018" },
    company: { zh: "智联智能", en: "Zhilian Intelligence" },
    role: { zh: "交互设计师", en: "Interaction Designer" },
    description: {
      zh: "负责智能终端与物联网产品的交互设计，将分散的硬件设备整合为统一的中控体验，推动软硬件协同的设计标准落地。",
      en: "Owned interaction design for smart devices and IoT products, unifying scattered hardware into one cohesive control experience and establishing hardware-software design standards.",
    },
  },
  {
    period: { zh: "2014 — 2016", en: "2014 — 2016" },
    company: { zh: "海岸互动", en: "Coastline Studio" },
    role: { zh: "UI 设计师", en: "UI Designer" },
    description: {
      zh: "参与电商与生活服务类 App 的界面与视觉设计，从品牌视觉延展到产品界面，积累了扎实的 C 端设计经验。",
      en: "Contributed interface and visual design for e-commerce and lifestyle apps, extending brand visuals into product UI and building a solid foundation in consumer-facing design.",
    },
  },
  {
    period: { zh: "2012 — 2014", en: "2012 — 2014" },
    company: { zh: "微光设计", en: "Glimmer Design" },
    role: { zh: "视觉设计师", en: "Visual Designer" },
    description: {
      zh: "从事品牌视觉与平面设计工作，负责标识、视觉规范与传播物料，为日后转向数字产品设计打下审美与表达的基础。",
      en: "Worked on brand visual and graphic design — logos, visual guidelines and marketing collateral — laying the aesthetic foundation for a later move into digital product design.",
    },
  },
]

/**
 * Static UI copy. Kept as a synchronous export so that client components
 * (SiteHeader, SiteFooter, etc.) can import it directly without needing
 * to make an API call.  Server components should prefer `fetchSiteData()`.
 */
export const ui = {
  brandName: { zh: "陈墨", en: "Chen Mo" },
  brandRole: { zh: "UI/UX 设计师", en: "UI/UX Designer" },
  navHome: { zh: "首页", en: "Home" },
  navWork: { zh: "作品", en: "Work" },
  navAbout: { zh: "关于我", en: "About" },
  navContact: { zh: "联系", en: "Contact" },
  heroEyebrow: { zh: "UI/UX 设计作品集", en: "UI/UX Design Portfolio" },
  heroLine1: {
    zh: "以需求为导向，",
    en: "Driven by real needs,",
  },
  heroLine2: {
    zh: "创造有价值的数字产品体验",
    en: "crafting digital products that matter.",
  },
  heroSub: {
    zh: "10 年 UI/UX 设计经验，擅长业务系统、智能终端及品牌视觉设计，专注于 B 端 / C 端产品设计。",
    en: "10 years of UI/UX design experience across enterprise systems, smart devices and brand visual design — focused on B2B and B2C product design.",
  },
  heroCtaWork: { zh: "浏览作品", en: "Browse work" },
  heroCtaAbout: { zh: "关于我", en: "About me" },
  featuredTitle: { zh: "精选项目", en: "Featured" },
  featuredDesc: {
    zh: "从近年的实践中挑选的几个代表作。",
    en: "A few highlights from recent work.",
  },
  viewAllWork: { zh: "查看全部作品", en: "View all work" },
  backToWork: { zh: "返回作品", en: "Back to work" },
  nextProject: { zh: "下一个项目", en: "Next project" },
  overview: { zh: "项目概述", en: "Overview" },
  challengeLabel: { zh: "挑战", en: "The challenge" },
  solutionLabel: { zh: "方案", en: "The solution" },
  outcomeLabel: { zh: "成果", en: "The outcome" },
  sectionWork: { zh: "精选作品", en: "Selected Work" },
  sectionWorkDesc: {
    zh: "近年来的界面与体验设计实践，涵盖移动端、桌面端与多平台产品。",
    en: "Recent interface and experience design work across mobile, desktop and multi-platform products.",
  },
  aboutTitle: { zh: "关于我", en: "About" },
  aboutIntro: {
    zh: "你好，我是陈墨 —— 一名独立数字产品设计师。",
    en: "Hi, I'm Chen Mo — an independent digital product designer.",
  },
  aboutText: {
    zh: "我专注于界面与交互设计。我相信优秀的设计源于对细节的执着与对用户的同理心，致力于把复杂的问题化为简洁而优雅的体验。过去几年，我与初创团队和成熟品牌合作，交付了覆盖移动端、桌面端与多平台的产品设计。",
    en: "I focus on interface and interaction design. I believe great design comes from an obsession with detail and empathy for users, turning complex problems into simple, elegant experiences. Over the past years I've worked with startups and established brands, delivering product design across mobile, desktop and multi-platform surfaces.",
  },
  experienceTitle: { zh: "工作经历", en: "Experience" },
  galleryTitle: { zh: "项目细节", en: "In detail" },
  aboutSkillsTitle: { zh: "专长", en: "Expertise" },
  aboutSkills: {
    zh: "产品设计 · 交互设计 · 设计系统 · 用户研究 · 原型与动效 · 可视化",
    en: "Product Design · Interaction · Design Systems · User Research · Prototyping & Motion · Data Viz",
  },
  contactTitle: { zh: "一起合作", en: "Let's work together" },
  contactText: {
    zh: "如果你有想聊的项目，或者只是想打个招呼，随时欢迎联系。",
    en: "If you'd like to discuss a project or just say hi, I'm always down to chat.",
  },
  viewProject: { zh: "查看项目", en: "View project" },
  role: { zh: "角色", en: "Role" },
  year: { zh: "年份", en: "Year" },
  category: { zh: "类别", en: "Category" },
  themeToggle: { zh: "切换主题", en: "Toggle theme" },
  langToggle: { zh: "切换语言", en: "Toggle language" },
  footer: { zh: "版权所有", en: "All rights reserved" },
} satisfies Record<string, Record<Locale, string>>

export type UiStrings = typeof ui

// ---------------------------------------------------------------------------
// Synchronous helpers (backwards-compatible, operate on static fallback)
// ---------------------------------------------------------------------------

/**
 * @deprecated Prefer the async `fetchProject()` from server components.
 * Kept as a synchronous fallback that operates on the static data.
 */
export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

/**
 * @deprecated Prefer computing the next project from `fetchProjects()` in
 * server components.  Kept as a synchronous fallback.
 */
export function getNextProject(id: string): Project {
  const index = projects.findIndex((p) => p.id === id)
  return projects[(index + 1) % projects.length]
}


