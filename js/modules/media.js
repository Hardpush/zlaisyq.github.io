// 媒体模块 - 处理图片和音乐相关功能
const mediaModule = {
  // 初始化媒体模块
  init(appState, config) {
    this.appState = appState;
    this.config = config;
    this.imageCache = new Map();
    this.initImageLazyLoading();
    // 注释掉音乐播放器初始化，避免错误
    // this.initMusicPlayer();
  },
  
  // 初始化图片懒加载
  initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            this.loadLazyImage(image);
            observer.unobserve(image);
          }
        });
      }, {
        rootMargin: '0px 0px 200px 0px', // 提前200px开始加载
        threshold: 0.01
      });
      
      // 观察所有懒加载图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 降级方案：立即加载所有图片
      this.fallbackLazyLoading();
    }
  },
  
  // 加载懒加载图片
  loadLazyImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;
    
    // 检查缓存
    if (this.imageCache.has(src)) {
      img.src = src;
      this.applyImageLoadedEffect(img);
      return;
    }
    
    // 预加载图片
    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      this.imageCache.set(src, true);
      this.applyImageLoadedEffect(img);
    };
    newImg.onerror = () => {
      console.error(`❌ 图片加载失败: ${src}`);
      // 应用错误占位图
      this.applyImageErrorEffect(img);
    };
    newImg.src = src;
  },
  
  // 降级加载方案
  fallbackLazyLoading() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.getAttribute('data-src');
      this.applyImageLoadedEffect(img);
    });
  },
  
  // 图片加载完成效果
  applyImageLoadedEffect(img) {
    // 移除加载占位符
    const placeholder = img.parentElement?.querySelector('.img-placeholder');
    if (placeholder) {
      placeholder.style.opacity = '0';
      setTimeout(() => {
        placeholder.remove();
      }, 300);
    }
    
    // 添加淡入效果
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      img.style.opacity = '1';
    }, 50);
    
    // 移除骨架屏
    const skeleton = img.parentElement?.querySelector('.skeleton');
    if (skeleton) {
      skeleton.style.opacity = '0';
      setTimeout(() => {
        skeleton.remove();
      }, 300);
    }
  },
  
  // 图片加载错误效果
  applyImageErrorEffect(img) {
    img.src = '../images/default.jpg'; // 默认错误占位图
    img.classList.add('img-error');
  },
  
  // 初始化音乐播放器
  initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle') || document.getElementById('toggleMusic');
    const audioElement = document.getElementById('background-music');
    
    if (!musicToggle || !audioElement) {
      console.warn('⚠️ 音乐播放器元素未找到');
      return;
    }
    
    // 设置音乐播放器初始状态
    this.setupMusicPlayerEvents(musicToggle, audioElement);
    
    // 尝试播放音乐（需要用户交互后才能自动播放）
    document.addEventListener('click', this.handleFirstUserInteraction.bind(this, audioElement), { once: true });
  },
  
  // 设置音乐播放器事件
  setupMusicPlayerEvents(toggleButton, audioElement) {
    toggleButton.addEventListener('click', () => {
      if (audioElement.paused) {
        audioElement.play().catch(error => {
          console.warn('⚠️ 音乐播放被阻止:', error);
        });
        toggleButton.textContent = '🔇';
        toggleButton.classList.add('active');
      } else {
        audioElement.pause();
        toggleButton.textContent = '🔊';
        toggleButton.classList.remove('active');
      }
    });
    
    // 音乐播放结束时循环播放
    audioElement.addEventListener('ended', () => {
      audioElement.currentTime = 0;
      audioElement.play().catch(error => {
        console.warn('⚠️ 音乐重新播放被阻止:', error);
      });
    });
  },
  
  // 处理首次用户交互
  handleFirstUserInteraction(audioElement) {
    audioElement.play().catch(error => {
      console.warn('⚠️ 首次音乐播放尝试失败:', error);
    });
  },
  
  // 加载情书背景音乐
  loadLetterMusic(letterId) {
    // 情书音乐加载逻辑
    const musicUrls = [
      '../music/music1.mp3',
      '../music/music2.mp3',
      '../music/music3.mp3'
    ];
    
    const audioPlayer = document.createElement('audio');
    const randomIndex = Math.floor(Math.random() * musicUrls.length);
    audioPlayer.src = musicUrls[randomIndex];
    audioPlayer.loop = true;
    
    return audioPlayer;
  }
};

export default mediaModule;