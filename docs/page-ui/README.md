# 官网 UI 交付说明

本目录用于沉淀官网改版的 UI 规格文档，和 [page-copy](/Users/wangwang/Desktop/扫码官网/website/docs/page-copy) 文案稿配套使用。

## 交付目标

- 统一全站视觉母版
- 明确 8 个页面的版式和交互差异
- 为每个页面准备可替换的占位图清单
- 为每张占位图提前写好生成 Prompt

## 全站风格方向

- 亮底产品展示官网
- 紫蓝渐变强调
- 长卷轴分段叙事
- 轻卡片、轻阴影、强留白
- 兼顾品牌增长感与产品展示感

## 全站视觉基准

### 颜色

- 主背景：`#f8fafc` 到 `#ffffff`
- 次背景：`#f3f4f6`
- 标题文字：`#111827`
- 正文文字：`#4b5563`
- 主强调渐变：`linear-gradient(135deg, #4f46e5, #7c3aed)`
- 辅助强调：`#e0e7ff`、`#ede9fe`

### 字体建议

- 中文正文：`PingFang SC` / `Noto Sans SC`
- 英文与数字辅助：`Outfit` / `Satoshi`
- Hero 标题更紧、更重
- 正文行宽控制在 32 到 40 个中文字符

### 容器与节奏

- 页面主容器：`max-width 1200px`
- 横向内边距：桌面 `32px`，移动端 `20px`
- 章节间距：桌面 `96px` 到 `128px`
- 卡片圆角：主卡 `24px`，小卡 `16px`

### 组件统一

- 公共 Header / Footer 共享母版
- 顶部滚动进度条
- Hero 双按钮：渐变主按钮 + 描边次按钮
- 交替图文分段
- 数据证明横带
- 白底卡片与浅灰背景区块
- CTA 收口区

### 动效统一

- 段落 reveal：`translateY(24px) -> 0` + `opacity 0 -> 1`
- 按钮 hover：轻微上浮 + 阴影增强
- 卡片 hover：边框轻亮 + 上浮 `2px`
- 数字区：滚动进入时做轻量计数或渐显
- 移动端保留 reveal，弱化过强阴影和复杂视觉层

## 占位图统一规则

### 生成目标

- 先服务于网页排版，不追求艺术海报感
- 统一为“明亮商业官网视觉”
- 保持足够留白，方便与文字共存
- 不生成文字、水印、Logo、UI 假字

### Prompt 统一要求

每张图的 Prompt 都尽量包含以下信息：

- 风格：明亮商业官网视觉、现代品牌官网、紫蓝渐变强调
- 构图：横版 Hero / 横版内容图 / 竖版卡片图
- 主题：包装、扫码、会员、门店、活动、数据、顾问沟通等
- 质感：写实 3D、产品展示、轻插画或半写实 UI 场景
- 氛围：干净、可信、留白、适合网页排版
- 限制：无文字、无水印、无多余 Logo、无复杂背景杂物

### 推荐结尾词

- `适合官网 Hero`
- `适合网页内容配图`
- `无文字，无水印`
- `高质感商业视觉`

### 建议比例

- Hero 图：`16:9`，推荐尺寸：`1920 × 1080px`
- 内容图：`4:3`，推荐尺寸：`1440 × 1080px`
- 竖版场景图：`3:4`，推荐尺寸：`1200 × 1600px`
- 小卡片图：`1:1`，推荐尺寸：`1200 × 1200px`

### 尺寸补充说明

- Hero 图建议优先按 `1920 × 1080px` 出图，方便桌面端大图裁切
- 内容图建议优先按 `1440 × 1080px` 出图，便于 4:3 卡片区统一使用
- 如果后面要做局部放大或二次裁切，建议在推荐尺寸基础上再放大 `1.25x`
- 图片格式优先 `jpg`，需要透明背景时再改成 `png`

### 文件命名规则

- 页面名放前：如 `home-`、`solution-`、`products-`
- 位置或用途放后：如 `hero-main`、`flow-overview`、`case-retail`
- 统一使用小写英文与中划线
- 推荐格式：`page-purpose-version.ext`

## 页面列表

- `00-current-state-audit.md`
- `01-home.md`
- `02-solution.md`
- `03-products.md`
- `04-industries.md`
- `05-cases.md`
- `06-models.md`
- `07-security.md`
- `08-contact.md`
- `09-shared-chrome.md`

## 建议图片目录

后续如果生成图片，建议统一落在：

- `/Users/wangwang/Desktop/扫码官网/website/src/assets/img/generated/`

按页面再细分：

- `generated/home/`
- `generated/solution/`
- `generated/products/`
- `generated/industries/`
- `generated/cases/`
- `generated/models/`
- `generated/security/`
- `generated/contact/`
