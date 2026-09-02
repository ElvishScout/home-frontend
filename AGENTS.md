<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 项目结构

```
app/
├─ layout.tsx                根布局：next/font 字体变量（Anton / Noto Sans SC / Space Mono / Geist）+ globals.css + 全站噪点（grain.tsx）
├─ globals.css               全站设计 token + prose 长文覆盖
├─ (home)/                   首页组 —— 不经由 (sub) 外壳
│  ├─ page.tsx               / → redirect /home
│  └─ home/                  首页本体（海报模式）
│     ├─ page.tsx            区块组装：Hero → About → Projects → Blog → Music → Skills → Contact → Footer
│     ├─ components/         区块与机制组件（chrome=噪点+导航 / loader / scroll-rail / providers=Lenis+SmoothLink / reveal …）
│     └─ lib/gsap.ts         GSAP + ScrollTrigger 封装
└─ (sub)/                    子页面组 —— 共享统一外壳
   ├─ layout.tsx             子页面外壳：墨底页眉页脚 + 纸底限宽内容区
   ├─ nav-link.tsx           页眉导航项（当前栏目 acid 高亮）
   ├─ components/            子页面共享件：PageHead（标题区）/ RowList（行式列表）
   ├─ articles/              /articles 技术博客
   │  ├─ page.tsx            文章列表（数据来自 virtual:mdx-registry）
   │  ├─ table-of-contents.tsx
   │  └─ [...slug]/          文章详情；layout.tsx 查 registry 并注入 ArticleTemplate（scroll-spy TOC + prose）
   └─ music/                 /music 音乐创作（占位框架，曲目是 TRACKS 常量）

articles/                    文章源（.md / .mdx），构建期被扫描注册
lib/articles.ts              slug ↔ registry key ↔ href 换算
lib/date.ts                  中文长日期格式化
plugins/mdx-registry/        自写 loader：扫描 articles/**/*.{md,mdx} 生成 virtual:mdx-registry（title / lastModified / headingTree）与 virtual:mdx-components（key → 文章组件的静态懒加载映射）
public/grain.svg             全站噪点材质
next.config.ts               @next/mdx 与 mdx-registry 串联（MDX 插件清单与 loader 内的是两份，改动需同步）
```

关键机制：

- **路由分组决定布局归属**：`(home)` 与 `(sub)` 平级，URL 不受影响；子页面外壳只写在 `(sub)/layout.tsx`，新增子页面放进 `(sub)` 组即自动获得外壳。
- **virtual:mdx-registry**：文章元信息（标题、修改时间、标题树）在构建期生成，列表页与详情页都从这里取数；写新文章只需在 `articles/` 放 `.md` 或 `.mdx`。
- **virtual:mdx-components**：文章组件的静态 import 映射，详情页经它加载正文。文章 import 路径必须静态（含变量的动态 import 被 Turbopack 拒绝，import.meta.glob 跨目录引服务端组件有已知 bug），故由 loader 在构建期展开；生成路径相对 stub 文件（plugins/mdx-registry/）解析，移动 stub 需同步改 loader 前缀。
- **样式取值先查 theme token**：`globals.css` 的 `@theme` / `@utility` 已收编全站的设计签名样式（流式字号、超宽字距、行距、硬阴影、描边字等），新增样式时优先复用；确需新的签名值就更新/新增 token，不要在组件里平行另写。一次性使用的元素大小、位置、transform 等布局值可以直接写任意值。

---

# 设计规范

STREET POP · 街头波普。气质锚点：街头的、漫画的、波普的——高对比、硬边缘、能量感；直白、坦率、不加修饰。同一套基因，两种音量：首页是海报，子页面是装帧精良的杂志内页。

## 全局

> 适用范围：全站所有路由与组件。本节只放不可协商的基因与禁令；尺度数值见「首页」「子页面」两节。

### 基因

1. **图形即内容**：每个图形必须能回答"它在传达什么"——承载信息（进度、计数、曲线）、完成叙事（分隔、强调）或引导行为（悬停反馈）。回答不了的图形一律删除，唯一例外是下面的品牌签名。
2. **品牌签名**（封闭清单；清单之外新增签名元素，先改本节再写代码）：
   - **噪点**：全站覆盖（grain.svg，`opacity-5`，steps 跳帧），印刷颗粒质感。
   - **描边字**：`text-stroke-*` + `text-fill-transparent`。仅首页。
   - **竖排文字**：`writing-mode: vertical-rl`。仅首页 hero。
   - **跑马灯**：无限横滚条带。仅首页。
   - **编号系统**：等宽体连续编号。形式与位置见各页节。
3. **配色**：双色基底——纸白 `paper` + 墨黑 `ink`，都是带暖意的近色。强调色恰好 3 个：`acid`（黄）/ `scarlet`（红）/ `aqua`（青），在两种底色上都要炸得开。禁渐变、禁低饱和莫兰迪、禁玻璃拟态、禁大面积柔影。
4. **字体**（三字体，token 见 globals.css）：展示体 `font-disp`（Anton + Noto Sans SC）用于巨型标题与横幅大字；中文黑体 `font-zh`（900）用于中文标题与强调短句；等宽体 `font-spacemono` 用于编号、标签、元信息。中文禁斜体，强调用底色高亮/加粗/变色。中西文混排的字体栈必须同时含拉丁展示体与中文字体。层级靠尺寸悬殊拉开。
5. **形状**：一律直角，边框 2–4px 实线；圆形只允许作为元素自身的形状（票根打孔、网点圆），禁止圆角卡片。硬阴影纯偏移无模糊（`shadow-ink-*` / `shadow-paper-*`），悬停时阴影缩短 + 元素位移，模拟"按下去"。方块必须承载文字或数字，不放空色块。选中态用虚线框 + 角柄。
6. **动效底律**：CSS 过渡与悬停一律 `ease-expo`；GSAP 入场用 power3/4.out，需要回弹性格（贴纸、编号牌）用 back.out。悬停反色用 `clip-path` 从左擦入，不做变色过渡。尊重 `prefers-reduced-motion`，降级为全部静态可见。

### 反模式（出现即违规）

- 圆角卡片 + 柔和投影 + 渐变背景
- 居中 hero + 两个 CTA + 三栏特性卡片的模板布局
- emoji 图标、图标字体方块
- 蓝紫渐变、霓虹 glow、毛玻璃
- 纯 opacity 变化作为入场——任何入场必须含位移、擦除或缩放之一
- 大段正文无层级地平铺
- 与内容和功能无关的几何图形、网点、色块充当背景壁纸
- 装饰性视差（不承载信息的背景元素随滚动乱飘）

## 首页（app/(home)/home）

海报模式：把全局基因推到极限——能量优先，宁可吵，不可温吞。风格元素必须长在交互与信息里；硬阴影、粗描边、错位拼贴，像手工剪贴，不像软件渲染。

**配色**：强调色只用于标题高亮、贴纸、横幅、关键数字、悬停态——面积小、爆发力强。纸底与墨底区块沿长滚动交替，形成节拍。

**字体**：巨型标题用 `text-fluid-*` 流式字号。描边字用于大字、编号与英文副题。竖排文字只出现在 hero 边角。

**图形库**（全局形状之上额外允许）：

1. **网点圆**：radial-gradient 点阵，漫画印刷质感；限 projects 画板内的叙事用途，不做整屏背景。
2. **棋盘格**：repeating-conic-gradient 黑白格；全站仅 Skills→Contact 之间一条分隔带。
3. **方块错位叠放**：一块实心、一块仅描边轮廓。
4. **全宽条带**：水平贯通；跑马灯条带允许 ±0.75° 微旋转。
5. **旋转**：贴纸/卡片/标签 ±1.5°~3° 制造手工感，同屏旋转角度不超过两种。

硬阴影：`shadow-ink-6` 贴纸/标签、`shadow-ink-8` 按钮、`shadow-ink-10` 画框。

**构图**：非对称 12 列网格，内容左右锯齿交替，禁止从头居中堆叠。允许压字、出血出屏、互相叠压，用 `overflow:hidden` 控制出血边界。每个内容区块带等宽体连续编号（01、02…），呈现形式不限（编号牌、贴纸、大号数字皆可），Hero 与 Footer 不计入编号。区块之间留 12vh+ 大空白。

**动效**（以下手法全部允许，缓动仍按全局底律）：

- **入场编排**：开场是一条时间线——加载计数 → 遮罩升起 → 主标题逐字弹入 → 贴纸旋转弹出 → 元信息就位。多步骤、有门控。
- **逐字/逐词**：大标题逐字弹入（`yPercent: 110 → 0`，stagger 0.03–0.06）；长句宣言随滚动逐词点亮（12% → 100% 透明度，scrub 绑定）。
- **线条绘制**：SVG 用 `pathLength: 1` + `stroke-dashoffset` 滚动到位时画出。
- **跑马灯**：相邻条带方向相反、速度不同；内容 DOM 复制一份无缝循环。
- **视差**：只许内容级视差（如画框整体 ±40px 反向漂移），不给背景图形做。
- **数字计数**：入视口从 0 跳到目标值，padStart 补零保持等宽。

## 子页面（(sub) 组所有路由）

杂志内页：内容优先，风格是装帧；任何与阅读竞争注意力的元素都算违规。描边字、竖排文字、跑马灯不在子页面出现。

**外壳**：所有子页面共用 `(sub)/layout.tsx`，禁止各页自建框架。页眉墨底：站点标识（点击回首页）+ 主导航（当前栏目 acid 高亮）。内容区 `max-w-7xl`，长文正文收窄到 `max-w-3xl`。页脚墨底：站点标识 + 一行联系/导航信息。标题区统一用 PageHead：mono 小标签 + 黑体大标题（`text-fluid-4`）+ 一行元信息。页面之间只允许内容区不同。

**配色**：正文与列表一律纸底；墨黑用于页眉、页脚与小面积强调区块。强调色按用途分配，不限处数：acid = 导航当前态、标签、悬停擦除、prose 点缀（引用边、行内码、链接）；scarlet = prose 列表点；aqua 子页面不用。

**字体与可读性**：尺寸悬殊以读感为先。正文 15–16px、行高 ≥ 1.9（`leading-loose`）、行长跟随 `max-w-3xl` 容器。长文排版基于 `@tailwindcss/typography`（prose），只覆盖颜色、边框与标题字重，不重写整套样式。

**形状**：图形一律承担内容职能——标签、虚线选中框、行式列表的分隔线。硬阴影取 `shadow-ink-4`。区块分隔用 2–3px 水平实线或留白。

**动效**：首屏直接呈现内容，一次入场即结束。区块入场 reveal = 上浮 + autoAlpha，once。悬停反馈：clip-path 擦除、阴影缩短 + 位移、箭头平移（缓动按全局底律）。页内锚点平滑滚动。
