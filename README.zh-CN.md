[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [日本語](README.ja.md)

# 🎃 Witch’s Potion Match — 万圣节魔药三消游戏

**一点月光，一把糖果，再来一串漂亮连消。**《魔药连消》把熟悉的相邻交换，变成十二份小小的万圣节配方：收集原料、点亮烛火，再把最后一撮星光送进锅里。游戏属于 Midnight Candy Club，为 [BlockBlasty](https://blockblasty.top/) 的节日专题创作。

**[在线试玩](https://halloween-potion-match.crazy3d.org/)** · [万圣节游戏总合集](https://github.com/AshinTop/halloween-games) · [嵌入说明](EMBEDDING.md) · [设计说明](DESIGN.md)

**文档语言：** English、简体中文、Español、Português (Brasil)、日本語。**游戏界面目前仅支持英语和简体中文**；西班牙语、葡萄牙语和日语版本为完整说明文档，并非已实现的界面翻译。

![魔药三消游戏，展示五种原料、配方进度、剩余步数和烛火目标](docs/images/gameplay.jpg)

## 锅里有什么魔法？👻

- **12 份可重复的固定配方**，在 6×6 棋盘上收集南瓜糖、月光、蝙蝠莓、薄荷叶和星尘五种原创原料。
- 相邻交换、交叉匹配、重力掉落与连续消除；全部配方都有仅用普通交换完成的验证路径。
- 不只看数量：烛火目标让消除位置同样重要，每关还有一次月光火花。
- 原料蓄光、彩色粒子、飞向配方的图案、真实掉落与轻弹落地；连锁越长，反馈越丰富。
- 实用提示、自由选配方、无限重来、本地最佳分数和星级，以及可选声音与减少动态效果。

## 怎样调出一瓶魔药

先看配方要求，再决定交换。点击两个相邻格，或向邻格滑动；横向或纵向连成至少三个相同原料即可消除。不允许斜向交换，也不能跨过一行的边缘。没有形成匹配的交换不会扣步数。

一次有效交换只花一步，后续掉落产生的全部连锁都包含在这一步内。每波收集都会计入原料目标，得分随连锁层数提高。大面积消除很热闹，但优先补齐缺少的原料往往更有用。

带烛台的配方还需要点亮烛火：消除烛台本格，或者它上下左右紧邻的原料即可。必须同时完成**全部原料数量和全部烛火**；只收齐原料还不算完成。

按下 **Moon Spark（月光火花）**，再点一个格子，可以同时清除整行和整列。第一波覆盖 11 个不同格子，之后照常结算连锁。每份配方只有一次火花，不消耗移动次数。即使剩余步数为零，只要火花还没用，仍有最后一次机会。

游戏没有倒计时。完成时剩至少 8 步获得三星，剩至少 3 步获得两星，其余成功完成获得一星。提示会根据当前目标评估合法交换，但不保证接下来的任意选择都能通关。

## 操作方式

| 操作 | 鼠标或触屏 | 键盘 |
|---|---|---|
| 选择与交换 | 依次点两个邻格，或滑动 | 方向键移动焦点，Enter / 空格选择 |
| 月光火花 | 点按钮后再点格子 | Tab 到按钮，激活后选择目标 |
| 提示 | Hint 按钮 | H |
| 取消选择 | 再点已选格 | Escape |
| 重来或选配方 | 重来按钮／下拉菜单 | Tab 到相应控件 |

等待本次连锁落定后再继续交换。动画中仍可重来或切换配方；旧动画会被取消，不会把旧得分、旧棋盘或旧特效写进新局。

## 记录与分享

同一配方采用固定随机种子，相同操作会得到相同结果，适合复盘。最佳分数、星级、语言和声音偏好保存在当前浏览器。刷新会重新开始所选配方，不恢复未完成棋盘。[配方 8 链接](https://halloween-potion-match.crazy3d.org/#recipe=8) 分享的是起始布局，不是你的操作录像。

## 常见问题

**不使用火花也能过关吗？** 可以。十二份配方都经过普通交换通关验证，火花是额外的战术选择。

**棋盘为什么突然重排？** 没有合法交换时，游戏会尝试重排现有原料；分布特别偏斜时可能重新补充。目标、分数和剩余步数都会保留。

**特效卡住会影响继续玩吗？** 视觉流程有取消和超时保护。即使某段效果失败或动画时间线停滞，也会安全完成已计算好的合法结果，避免按钮一直锁住。

## 图文与视频

![紧凑窗口中的魔药棋盘、配方目标和月光火花按钮](docs/images/mobile.jpg)

截图来自真实浏览器中的紧凑 iframe，用于说明布局，不代表实体手机性能测试。

[观看 24 秒介绍视频](https://halloween-potion-match.crazy3d.org/intro.html) · [下载带字幕 MP4](docs/media/intro.mp4)。视频无声，由实际游戏截图编排而成，并非连续操作录像。截图和视频记录的是拍摄时的界面，可能早于后续视觉细节更新。

## 嵌入你的站点

```html
<iframe src="https://halloween-potion-match.crazy3d.org/"
  title="Witch’s Potion Match"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

布局面向 1160×654 桌面窗口、390×650 / 390×794 竖屏窗口，以及 844×340 横屏窗口。棋盘按 iframe 的实际空间缩放；浏览器尺寸检查不等于所有实体设备都已测试。

在线版本通过 GitHub 关联部署到 Cloudflare。请为 iframe 设置实际高度，并给主站工具栏留出空间；全屏入口可由主站提供。详细约定见 [EMBEDDING.md](EMBEDDING.md)。

## 本地运行与规则验证

```sh
python3 -m http.server 4173
```

在仓库根目录启动静态服务，再打开 [http://localhost:4173/](http://localhost:4173/)。游戏无需构建或安装依赖。请使用 HTTP(S)，直接双击 `file://` 页面可能阻止 ES 模块加载。运行测试需要 Node.js。

```sh
npm test
```

**24 项测试**覆盖规则、十二关通关、旧指针与并发输入、真实掉落路线、逐波计数、各动画阶段的取消，以及特效失败或时间线停滞时的恢复。

游戏源码不依赖账号、远程 API、广告 SDK 或外部素材 CDN。记录保存在当前浏览器，不提供云端同步；Cloudflare 可能另外加入托管脚本与请求日志。可选合成音效遵循浏览器的声音权限。

## 下一段月光小冒险 🍬

- [Witch’s Candy Blocks](https://halloween-block-blast.crazy3d.org/) · [源码](https://github.com/AshinTop/halloween-block-blast) — 8×8 糖果方块摆放消除.
- [Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/) · [源码](https://github.com/AshinTop/halloween-pumpkin-shift) — 带月光滑行的数字滑块谜题.
- [Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/) · [源码](https://github.com/AshinTop/halloween-tripeaks) — 高低相邻接龙与月亮桥.
- [Moonlit Mirrors](https://halloween-mirror-hearts.crazy3d.org/) · [源码](https://github.com/AshinTop/halloween-mirror-hearts) — 让镜像移动的双幽灵一起到家.

## 制作说明与支持

为 **AshinTop 的 Midnight Candy Club** 创作，设计、编程、文案、测试与审查由人类指导的 AI 协作完成。原创插画和浏览器合成声音为本项目制作，创作意图可见 [设计说明](DESIGN.md)。

喜欢这段小冒险？欢迎 **[给 Witch’s Potion Match 点一颗 GitHub Star](https://github.com/AshinTop/halloween-potion-match)**，方便收藏并关注更新。反馈问题时，请附关卡或模式、浏览器、窗口大小和复现步骤。还可以逛逛 [完整万圣节合集](https://github.com/AshinTop/halloween-games)。
