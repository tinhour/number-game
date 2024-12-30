class GameUI {
  constructor() {
    this.initializeResponsive();
    this.addEventListeners();
  }

  initializeResponsive() {
    // 检测设备类型
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // 添加设备类型标识
    document.body.classList.toggle('mobile-device', this.isMobile);
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', () => {
      this.handleOrientationChange();
    });
    
    // 监听窗口大小变化
    this.resizeDebounce = null;
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeDebounce);
      this.resizeDebounce = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleOrientationChange() {
    // 重新计算卡片布局
    this.updateLayout();
    
    // 在横屏模式下调整布局
    if (window.orientation === 90 || window.orientation === -90) {
      this.optimizeForLandscape();
    } else {
      this.optimizeForPortrait();
    }
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 根据屏幕尺寸动态调整游戏参数
    this.updateGameParameters(width, height);
    
    // 重新布局游戏元素
    this.updateLayout();
  }

  updateGameParameters(width, height) {
    // 根据屏幕尺寸调整难度
    if (width < 360) {
      this.adjustForSmallScreens();
    } else if (width < 768) {
      this.adjustForMediumScreens();
    } else {
      this.adjustForLargeScreens();
    }
  }

  updateLayout() {
    const gameContainer = document.querySelector('.game-container');
    const cards = document.querySelectorAll('.card');
    
    // 计算最佳的网格列数
    const containerWidth = gameContainer.clientWidth;
    const cardSize = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--card-size'));
    const gap = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--gap-size'));
      
    const columns = Math.floor((containerWidth + gap) / (cardSize + gap));
    gameContainer.style.gridTemplateColumns = `repeat(${columns}, var(--card-size))`;
  }

  addEventListeners() {
    // 添加触摸事件支持
    if (this.isMobile) {
      this.setupTouchEvents();
    }
  }

  setupTouchEvents() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        // 触发卡片点击事件
        card.click();
      });
    });
  }

  adjustForSmallScreens() {
    // 小屏幕设备的优化设置
    document.documentElement.style.setProperty('--card-size', '50px');
    document.documentElement.style.setProperty('--card-font-size', '20px');
    document.documentElement.style.setProperty('--gap-size', '6px');
    
    // 调整游戏难度和布局
    this.updateLayout();
  }

  adjustForMediumScreens() {
    // 中等屏幕设备的优化设置
    document.documentElement.style.setProperty('--card-size', '70px');
    document.documentElement.style.setProperty('--card-font-size', '28px');
    document.documentElement.style.setProperty('--gap-size', '8px');
    
    // 调整游戏难度和布局
    this.updateLayout();
  }

  adjustForLargeScreens() {
    // 大屏幕设备的优化设置
    document.documentElement.style.setProperty('--card-size', '100px');
    document.documentElement.style.setProperty('--card-font-size', '36px');
    document.documentElement.style.setProperty('--gap-size', '12px');
    
    // 调整游戏难度和布局
    this.updateLayout();
  }

  optimizeForLandscape() {
    // 横屏模式优化
    document.documentElement.style.setProperty('--card-size', 'clamp(40px, 12vh, 100px)');
    document.documentElement.style.setProperty('--card-font-size', 'clamp(16px, 4vh, 36px)');
    this.updateLayout();
  }

  optimizeForPortrait() {
    // 竖屏模式优化
    document.documentElement.style.setProperty('--card-size', 'clamp(60px, 15vw, 120px)');
    document.documentElement.style.setProperty('--card-font-size', 'clamp(24px, 6vw, 48px)');
    this.updateLayout();
  }
}

// 初始化 UI
const gameUI = new GameUI(); 