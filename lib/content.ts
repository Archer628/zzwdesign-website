export type Locale = "zh" | "en"

type LocalizedString = Record<Locale, string>

export interface Project {
  id: string
  image: string
  year: string
  accent: string
  title: LocalizedString
  summary: LocalizedString
  category: LocalizedString
  role: LocalizedString
  description: LocalizedString
  tags: string[]
}

export const projects: Project[] = [
  {
    id: "fintech",
    image: "/projects/fintech.png",
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
    tags: ["Figma", "iOS", "Design System", "Motion"],
  },
  {
    id: "smarthome",
    image: "/projects/smarthome.png",
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
    tags: ["Figma", "Web", "Dashboard", "IoT"],
  },
  {
    id: "ecommerce",
    image: "/projects/ecommerce.png",
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
    tags: ["Figma", "Web", "Branding", "E-commerce"],
  },
  {
    id: "health",
    image: "/projects/health.png",
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
    tags: ["Figma", "iOS", "Data Viz", "Wellness"],
  },
  {
    id: "music",
    image: "/projects/music.png",
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
    tags: ["Figma", "iOS", "Dark UI", "Motion"],
  },
  {
    id: "travel",
    image: "/projects/travel.png",
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
    tags: ["Figma", "Web", "Booking", "Visual"],
  },
  {
    id: "saas",
    image: "/projects/saas.png",
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
    tags: ["Figma", "Web", "Design System", "Charts"],
  },
  {
    id: "education",
    image: "/projects/education.png",
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
    tags: ["Figma", "iPad", "Education", "UX"],
  },
  {
    id: "food",
    image: "/projects/food.png",
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
    tags: ["Figma", "iOS", "Lifestyle", "Interaction"],
  },
]

export const ui = {
  brandName: { zh: "陈墨", en: "Chen Mo" },
  brandRole: { zh: "UI/UX 设计师", en: "UI/UX Designer" },
  navWork: { zh: "作品", en: "Work" },
  navAbout: { zh: "关于", en: "About" },
  navContact: { zh: "联系", en: "Contact" },
  sectionWork: { zh: "精选作品", en: "Selected Work" },
  sectionWorkDesc: {
    zh: "近年来的界面与体验设计实践，涵盖移动端、桌面端与多平台产品。",
    en: "Recent interface and experience design work across mobile, desktop and multi-platform products.",
  },
  aboutTitle: { zh: "关于我", en: "About" },
  aboutText: {
    zh: "我是一名独立数字产品设计师，专注于界面与交互设计。我相信优秀的设计源于对细节的执着与对用户的同理心，致力于把复杂的问题化为简洁而优雅的体验。",
    en: "I'm an independent digital product designer focused on interface and interaction design. I believe great design comes from an obsession with detail and empathy for users, turning complex problems into simple, elegant experiences.",
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
  close: { zh: "关闭", en: "Close" },
  themeToggle: { zh: "切换主题", en: "Toggle theme" },
  langToggle: { zh: "切换语言", en: "Toggle language" },
  footer: { zh: "版权所有", en: "All rights reserved" },
} satisfies Record<string, Record<Locale, string>>
