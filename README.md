# 数学游戏

![游戏截图](https://github.com/tinhour/number-game/raw/main/screenshots/gameplay.png)

一个简单有趣的数字游戏，使用HTML5 + JavaScript开发。玩家需要在规定时间内计算出数字结果，适合儿童玩耍。

## ✨ 特性

- 🎯 多个难度级别
- ⏱️ 计时挑战模式
- 🏆 分数记录系统
- 🎵 音效反馈
- 📱 响应式设计，支持移动设备
- 🌈 精美的动画效果

## 🚀 快速开始

### 在线试玩

访问 [游戏演示页面](https://tinhour.github.io/number-game/) 即可开始游戏，可以使用页面的按钮或键盘数字来玩。

### 本地运行

1. **克隆仓库**：
   ```bash
   git clone https://github.com/tinhour/number-game.git
2. **创建并进入项目目录**：
   ```bash
   mkdir number-game && cd number-game
3. **项目结构**：
   ```bash
    number-game/
    ├── css/
    │   └── style.css # 游戏样式
    ├── js/
    │   ├── game.js # 游戏主逻辑
    │   ├── audio.js # 音效管理
    │   ├── storage.js # 数据存储
    │   └── ui.js # 界面控制
    ├── audio/ # 音效文件
    ├── images/ # 游戏图片
    └── index.html # 游戏入口
   ```
4. **运行游戏**：
   ```bash
   open index.html

## 🎵 音效说明

游戏包含以下音效：
- 数字消除音效
- 升级提示音
- 游戏结束音效
- 按键反馈音

音效文件位于 `audio` 目录下：
```bash
audio/
├── hit.wav     # 打中音效
├── levelup.wav # 升级音效
├── pop.wav     # 消除音效
└── gameover.wav # 游戏结束音效
```

可以通过界面右上角的🔊按钮控制音效开关。
