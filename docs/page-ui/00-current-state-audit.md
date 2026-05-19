# 当前状态审计

本文件只记录当前站点的现状问题，方便和目标规格拆开阅读。

## 审计结论

1. 首页主内容曾被改成偏深色霓虹的产品页语法，与当前确定下来的“亮底产品展示官网”目标不一致。
2. 公共 Footer 仍保留旧站暖棕渐变和旧式信息组织方式，和目标视觉体系明显脱节。
3. Header / Footer 虽然结构上是公共组件，但还没有真正进入同一套共享视觉系统。
4. 现有页面与公共层之间缺少统一的目标规格承接，因此需要把“现状问题”和“目标母版”分开管理。

## 现状涉及文件

- [index/index.html](/Users/wangwang/Desktop/扫码官网/website/src/pages/index/index.html)
- [index/tailwind.css](/Users/wangwang/Desktop/扫码官网/website/src/pages/index/tailwind.css)
- [common/header/index.html](/Users/wangwang/Desktop/扫码官网/website/src/pages/common/header/index.html)
- [common/header/index.less](/Users/wangwang/Desktop/扫码官网/website/src/pages/common/header/index.less)
- [common/footer/index.html](/Users/wangwang/Desktop/扫码官网/website/src/pages/common/footer/index.html)
- [common/footer/index.less](/Users/wangwang/Desktop/扫码官网/website/src/pages/common/footer/index.less)

## 目标规格入口

- 全站 UI 母版请查看 [README.md](/Users/wangwang/Desktop/扫码官网/website/docs/page-ui/README.md)
- 公共 Header / Footer 目标规格请查看 [09-shared-chrome.md](/Users/wangwang/Desktop/扫码官网/website/docs/page-ui/09-shared-chrome.md)

