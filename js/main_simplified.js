// 简化版主文件 - 整合模块化结构

// 应用状态管理
const appState = {
  isAuthenticated: false,
  currentPage: 'home',
  isMusicPlaying: false,
  loadedImages: new Set(),
};

// 动态导入配置文件
let config;

// 测试脚本变量
let runAllTests;

// 动态导入模块的函数
async function loadModules() {
  try {
    // 加载配置文件
    config = window.appConfig || {};
    
    // 动态导入测试脚本（仅在开发模式下）
    if (config?.debug || typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      try {
        const testModule = await import('./test.js');
        runAllTests = testModule.runAllTests;
      } catch (e) {
        console.warn('测试模块加载失败:', e);
      }
    }
    
    // 动态导入模块加载器
    const moduleLoaderModule = await import('./modules/moduleLoader.js');
    const moduleLoader = moduleLoaderModule.default;
    
    // 动态导入各个功能模块
    const passwordModule = await import('./modules/password.js');
    const uiModule = await import('./modules/ui.js');
    const mediaModule = await import('./modules/media.js');
    const loveLettersModule = await import('./modules/loveLetters.js');
    const countdownModule = await import('./modules/countdown.js');
    const imageOptimizerModule = await import('./modules/imageOptimizer.js');
    
    // 加载模块
    moduleLoader.loadModule('password', passwordModule.default);
    moduleLoader.loadModule('ui', uiModule.default);
    moduleLoader.loadModule('media', mediaModule.default);
    moduleLoader.loadModule('imageOptimizer', imageOptimizerModule.default);
    moduleLoader.loadModule('loveLetters', loveLettersModule.default);
    moduleLoader.loadModule('countdown', countdownModule.default);
    
    // 初始化所有模块
    moduleLoader.initAllModules(appState, config);
    
    console.log('✅ 所有模块加载完成');
    
    // 初始化应用
    initApp();
  } catch (error) {
    console.error('❌ 模块加载失败:', error);
    // 降级方案：使用内联脚本
    fallbackToInlineScripts();
  }
}

// 应用初始化函数
function initApp() {
  console.log('🚀 应用初始化开始');
  
  // 设置事件监听器
  setupGlobalEventListeners();
  
  // 检查密码状态
  checkAuthentication();
  
  // 预加载关键资源
  preloadCriticalResources();
  
  // 显示加载完成消息
  console.log('✅ 应用初始化完成');
}

// 设置全局事件监听器
function setupGlobalEventListeners() {
  // 页面加载完成事件
  window.addEventListener('load', handlePageLoad);
  
  // 页面可见性变化事件
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 窗口大小变化事件
  window.addEventListener('resize', debounce(handleResize, 300));
  
  // 网络状态变化事件
  window.addEventListener('online', handleNetworkChange);
  window.addEventListener('offline', handleNetworkChange);
}

// 处理页面加载完成
function handlePageLoad() {
  console.log('📄 页面加载完成');
  
  // 移除加载指示器
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
}

// 处理页面可见性变化
function handleVisibilityChange() {
  if (document.hidden) {
    // 页面隐藏时暂停音乐
    pauseBackgroundMusic();
  } else {
    // 页面显示时恢复音乐
    resumeBackgroundMusic();
  }
}

// 处理窗口大小变化
function handleResize() {
  // 响应式调整
  updateResponsiveLayout();
}

// 处理网络状态变化
function handleNetworkChange() {
  const isOnline = navigator.onLine;
  
  if (!isOnline) {
    showOfflineNotification();
  } else {
    hideOfflineNotification();
  }
}

// 检查认证状态
function checkAuthentication() {
  // 检查本地存储中的认证状态
  const savedAuth = localStorage.getItem('isAuthenticated');
  
  if (savedAuth === 'true') {
    // 如果已认证，直接显示主内容
    appState.isAuthenticated = true;
    showMainContent();
  }
}

// 显示主内容
function showMainContent() {
  const passwordOverlay = document.getElementById('password-overlay');
  const mainContent = document.getElementById('main-content');
  
  if (passwordOverlay) {
    passwordOverlay.style.display = 'none';
  }
  
  if (mainContent) {
    mainContent.style.display = 'block';
    mainContent.classList.add('animate-fade-in');
  }
}

// 预加载关键资源
function preloadCriticalResources() {
  // 优化现有图片
  const imageOptimizerModule = moduleLoader.getModule('imageOptimizer');
  if (imageOptimizerModule) {
    
    // 预加载首屏图片
    const criticalImages = [];
    
    // 获取页面上的主要图片
    document.querySelectorAll('.hero-image, .gallery img, .love-letter-preview img').forEach(img => {
      if (img.src) {
        criticalImages.push(img.src);
      } else if (img.dataset.src) {
        criticalImages.push(img.dataset.src);
      }
    });
    
    // 如果没有找到元素图片，使用默认图片
    if (criticalImages.length === 0 && config?.performance?.preloadCriticalImages) {
      const defaultImages = [
        '../images/default.jpg',
        '../images/background.jpg'
      ];
      
      defaultImages.forEach(src => {
        criticalImages.push(src);
        const img = new Image();
        img.src = src;
        appState.loadedImages.add(src);
      });
    }
    
    // 预加载图片
    if (criticalImages.length > 0) {
      imageOptimizerModule.preloadImages(criticalImages, 'high');
    }
  } else if (config?.performance?.preloadCriticalImages) {
    // 降级方案：不使用图片优化模块
    const criticalImages = [
      '../images/default.jpg',
      '../images/background.jpg'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      appState.loadedImages.add(src);
    });
  }
}

// 暂停背景音乐
function pauseBackgroundMusic() {
  const audioElement = document.getElementById('background-music');
  if (audioElement && !audioElement.paused) {
    appState.isMusicPlaying = true;
    audioElement.pause();
  }
}

// 恢复背景音乐
function resumeBackgroundMusic() {
  const audioElement = document.getElementById('background-music');
  if (audioElement && appState.isMusicPlaying) {
    audioElement.play().catch(error => {
      console.warn('⚠️ 音乐播放被阻止:', error);
    });
  }
}

// 更新响应式布局
function updateResponsiveLayout() {
  const windowWidth = window.innerWidth;
  const breakpoints = config?.ui?.breakpoints || {};
  
  // 根据窗口大小应用不同的布局调整
  if (windowWidth < breakpoints.mobile) {
    applyMobileLayout();
  } else if (windowWidth < breakpoints.tablet) {
    applyTabletLayout();
  } else {
    applyDesktopLayout();
  }
}

// 应用移动端布局
function applyMobileLayout() {
  // 移动端特定的布局调整
  console.log('📱 应用移动端布局');
}

// 应用平板布局
function applyTabletLayout() {
  // 平板特定的布局调整
  console.log('📱 应用平板布局');
}

// 应用桌面布局
function applyDesktopLayout() {
  // 桌面特定的布局调整
  console.log('💻 应用桌面布局');
}

// 显示离线通知
function showOfflineNotification() {
  // 创建离线通知元素
  let notification = document.getElementById('offline-notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50';
    notification.textContent = '您当前处于离线状态';
    document.body.appendChild(notification);
  }
  
  notification.style.display = 'block';
}

// 隐藏离线通知
function hideOfflineNotification() {
  const notification = document.getElementById('offline-notification');
  if (notification) {
    notification.style.display = 'none';
  }
}

// 降级到内联脚本
function fallbackToInlineScripts() {
  console.warn('⚠️ 使用降级方案：内联脚本');
  
  // 基本的密码验证功能
  setupBasicPasswordVerification();
  
  // 基本的导航功能
  setupBasicNavigation();
  
  // 基本的倒计时功能
  setupBasicCountdown();
}

// 设置基本密码验证
function setupBasicPasswordVerification() {
  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('password-input')?.value;
      
      if (password === '123456') { // 简化的密码验证
        showMainContent();
      } else {
        alert('密码错误');
      }
    });
  }
}

// 设置基本导航
function setupBasicNavigation() {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 设置基本倒计时
function setupBasicCountdown() {
  const countdownElement = document.getElementById('countdown-container');
  if (!countdownElement) return;
  
  const updateCountdown = () => {
    const startDate = new Date('2022-01-20');
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    countdownElement.innerHTML = `<p>我们已经相爱 ${diffDays} 天啦！</p>`;
  };
  
  updateCountdown();
  setInterval(updateCountdown, 86400000); // 每天更新一次
}

// 工具函数：防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 工具函数：节流
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 根据需要运行测试
function runTestsIfNeeded() {
  // 仅在配置启用调试模式或环境不是生产环境时运行测试
  if ((config?.debug || false) && typeof runAllTests === 'function') {
    setTimeout(() => {
      runAllTests().catch(err => {
        console.error('测试执行失败:', err);
      });
    }, 1000); // 延迟1秒运行测试，确保页面完全加载
  }
}

// 更新性能指标显示
function updatePerformanceMetrics(metrics) {
  try {
    // 更新加载时间
    if (metrics.loadTime !== undefined) {
      const loadTimeElem = document.getElementById('load-time');
      if (loadTimeElem) {
        loadTimeElem.textContent = `加载时间: ${metrics.loadTime.toFixed(2)}ms`;
      }
    }
    
    // 更新内存使用情况
    if (performance && performance.memory) {
      const memoryUsageElem = document.getElementById('memory-usage');
      if (memoryUsageElem) {
        const usedMemory = performance.memory.usedJSHeapSize / (1024 * 1024);
        memoryUsageElem.textContent = `内存使用: ${usedMemory.toFixed(2)}MB`;
      }
    }
  } catch (e) {
    console.warn('更新性能指标失败:', e);
  }
}

  // 启动应用
  (function() {
    // 记录页面加载开始时间
    const pageStartTime = performance.now();
    
    // 定期更新内存使用情况
    if (performance && performance.memory) {
      setInterval(() => updatePerformanceMetrics({}), 5000); // 每5秒更新一次
    }
    
    // 检查浏览器兼容性
    if (typeof Promise !== 'undefined' && typeof fetch !== 'undefined' && typeof import !== 'undefined') {
      // 现代浏览器：使用模块化加载
      loadModules().then(() => {
        // 计算并显示加载时间
        const loadTime = performance.now() - pageStartTime;
        updatePerformanceMetrics({ loadTime });
        
        runTestsIfNeeded();
      });
    } else {
    // 老旧浏览器：直接使用降级方案
    console.warn('⚠️ 当前浏览器不支持模块化功能，使用降级方案');
    fallbackToInlineScripts();
  }
})();

