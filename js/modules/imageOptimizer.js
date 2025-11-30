// 图片优化模块 - 提供高级图片加载和优化功能
const imageOptimizerModule = {
  /**
   * 初始化图片优化器
   * @param {Object} appState - 应用状态对象
   * @param {Object} options - 配置选项
   */
  init(appState, options = {}) {
    try {
      // 保存应用状态引用
      this.appState = appState;
      
      // 合并配置选项
      this.config = { ...this.config, ...options };
      this.imageCache = new Map();
      this.lazyLoadObserver = null;
      this.preloadQueue = [];
      this.supportsWebP = null;
      
      console.log('🔍 图片优化器初始化中...');
      
      // 检测浏览器兼容性
      this.detectBrowserSupport();
      
      // 检查浏览器支持
      if (!this.supportsIntersectionObserver && !this.supportsRequestIdleCallback) {
        const warningMessage = '当前浏览器不支持所有图片优化功能';
        console.warn(`⚠️ ${warningMessage}`);
        
        if (window.errorHandler) {
          window.errorHandler.showNotice(warningMessage, '浏览器兼容性');
        }
      }
      
      // 使用性能优化模块的懒加载功能
      if (window.performanceOptimizer && window.performanceOptimizer.setupLazyLoading) {
        console.log('✅ 使用性能优化模块的懒加载功能');
      } else {
        // 回退到本地懒加载实现
        this.initImageOptimization();
      }
      
      console.log('✅ 图片优化器初始化完成');
    } catch (error) {
      console.error('❌ 图片优化器初始化失败:', error);
      // 使用错误处理模块记录错误
      if (window.errorHandler) {
        window.errorHandler.handleError('图片优化器初始化失败', error, { module: 'imageOptimizer' });
      }
    }
  },
  
  // 检测浏览器支持
  detectBrowserSupport() {
    // 检测WebP支持
    this.detectWebPSupport();
    
    // 检测IntersectionObserver支持
    this.supportsIntersectionObserver = 'IntersectionObserver' in window;
    
    // 检测requestIdleCallback支持
    this.supportsRequestIdleCallback = 'requestIdleCallback' in window;
  },
  
  // 检测WebP支持
  detectWebPSupport() {
    if (this.supportsWebP === null) {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        this.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } else {
        this.supportsWebP = false;
      }
    }
  },
  
  // 初始化图片优化
  initImageOptimization() {
    // 初始化懒加载
    this.initLazyLoading();
    
    // 处理已有的图片元素
    this.optimizeExistingImages();
    
    // 监听DOM变化，自动处理动态添加的图片
    this.observeDomChanges();
  },
  
  // 初始化懒加载
  initLazyLoading() {
    if (this.supportsIntersectionObserver) {
      // 现代浏览器：使用IntersectionObserver
      this.initIntersectionObserverLazyLoading();
    } else {
      // 降级方案：使用滚动事件
      this.initScrollEventLazyLoading();
    }
  },
  
  // 使用IntersectionObserver的懒加载
  initIntersectionObserverLazyLoading() {
    const options = {
      root: null,
      rootMargin: '200px 0px', // 提前200px开始加载
      threshold: 0.01
    };
    
    this.lazyLoadObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadLazyImage(img);
          observer.unobserve(img);
        }
      });
    }, options);
    
    // 观察所有懒加载图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.lazyLoadObserver.observe(img);
    });
  },
  
  // 使用滚动事件的懒加载（降级方案）
  initScrollEventLazyLoading() {
    // 使用节流函数处理滚动事件
    const handleScroll = throttle(() => {
      document.querySelectorAll('img[data-src]:not([data-loading])').forEach(img => {
        if (this.isElementInViewport(img)) {
          this.loadLazyImage(img);
        }
      });
    }, 200);
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('orientationchange', handleScroll);
    
    // 初始检查
    setTimeout(handleScroll, 100);
  },
  
  // 加载懒加载图片
  loadLazyImage(img) {
    if (!img || img.hasAttribute('data-loading')) return;
    
    // 标记为正在加载
    img.setAttribute('data-loading', 'true');
    
    // 获取图片源
    const src = this.getOptimalImageSource(img);
    if (!src) {
      this.handleImageError(img);
      return;
    }
    
    // 检查缓存
    if (this.imageCache.has(src)) {
      this.applyImageToElement(img, src);
      return;
    }
    
    // 预加载图片
    const preloadImg = new Image();
    
    // 设置加载完成回调
    preloadImg.onload = () => {
      // 添加到缓存
      this.imageCache.set(src, true);
      
      // 应用到实际图片元素
      this.applyImageToElement(img, src);
      
      // 触发自定义事件
      this.dispatchImageLoadedEvent(img);
    };
    
    // 设置加载错误回调
    preloadImg.onerror = () => {
      this.handleImageError(img);
    };
    
    // 设置加载超时
    const timeoutId = setTimeout(() => {
      preloadImg.onerror();
    }, 10000); // 10秒超时
    
    preloadImg.onload = () => {
      clearTimeout(timeoutId);
      this.imageCache.set(src, true);
      this.applyImageToElement(img, src);
      this.dispatchImageLoadedEvent(img);
    };
    
    // 设置图片源
    preloadImg.src = src;
  },
  
  // 获取最佳图片源
  getOptimalImageSource(img) {
    // 首先尝试获取响应式图片源
    let src = this.getResponsiveImageSource(img);
    
    if (!src) {
      // 回退到data-src
      src = img.getAttribute('data-src');
    }
    
    // 如果支持WebP，尝试获取WebP版本
    if (this.supportsWebP && src && !src.endsWith('.webp')) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
      // 注意：这里需要服务器端支持WebP格式
      // 实际应用中，可能需要通过配置或约定来确定WebP路径
    }
    
    return src;
  },
  
  // 获取响应式图片源
  getResponsiveImageSource(img) {
    const windowWidth = window.innerWidth;
    
    // 尝试获取不同断点的图片源
    if (windowWidth < 640 && img.hasAttribute('data-src-mobile')) {
      return img.getAttribute('data-src-mobile');
    } else if (windowWidth < 1024 && img.hasAttribute('data-src-tablet')) {
      return img.getAttribute('data-src-tablet');
    } else if (img.hasAttribute('data-src-desktop')) {
      return img.getAttribute('data-src-desktop');
    }
    
    return null;
  },
  
  // 应用图片到元素
  applyImageToElement(img, src) {
    // 移除加载占位符
    this.removeImagePlaceholder(img);
    
    // 设置图片源
    img.src = src;
    
    // 应用淡入效果
    this.applyImageFadeIn(img);
    
    // 清理数据属性
    img.removeAttribute('data-loading');
    img.removeAttribute('data-src');
    img.removeAttribute('data-src-mobile');
    img.removeAttribute('data-src-tablet');
    img.removeAttribute('data-src-desktop');
  },
  
  // 移除图片占位符
  removeImagePlaceholder(img) {
    const parent = img.parentElement;
    if (!parent) return;
    
    // 移除骨架屏
    const skeleton = parent.querySelector('.skeleton');
    if (skeleton) {
      skeleton.style.transition = 'opacity 0.3s ease';
      skeleton.style.opacity = '0';
      setTimeout(() => {
        skeleton.remove();
      }, 300);
    }
    
    // 移除加载指示器
    const spinner = parent.querySelector('.img-loading-spinner');
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.remove();
      }, 300);
    }
  },
  
  // 应用图片淡入效果
  applyImageFadeIn(img) {
    // 保存原始的过渡和透明度设置
    const originalTransition = img.style.transition;
    const originalOpacity = img.style.opacity;
    
    // 应用淡入效果
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    // 强制重排
    img.offsetHeight;
    
    // 应用淡入
    img.style.opacity = '1';
    
    // 恢复原始设置
    setTimeout(() => {
      img.style.transition = originalTransition;
      img.style.opacity = originalOpacity;
    }, 500);
  },
  
  /**
   * 处理图片错误
   * @param {HTMLElement} img - 图片元素
   * @param {Error} error - 错误对象
   */
  handleImageError(img, error) {
    try {
      // 使用性能优化模块的微任务处理错误，避免阻塞主线程
      if (window.scheduler && window.scheduler.microTask) {
        window.scheduler.microTask(() => this._processImageError(img, error));
      } else {
        this._processImageError(img, error);
      }
    } catch (err) {
      console.error('❌ 处理图片错误时出错:', err);
      if (window.errorHandler) {
        window.errorHandler.handleError('图片错误处理失败', err, { module: 'imageOptimizer' });
      }
    }
  },

  /**
   * 内部处理图片错误的方法
   * @private
   * @param {HTMLElement} img - 图片元素
   * @param {Error} error - 错误对象
   */
  _processImageError(img, error) {
    try {
      const errorMessage = '图片加载失败: ' + (img.getAttribute('data-src') || img.src);
      console.error(errorMessage, error);
      
      // 使用错误处理模块显示错误
      if (window.errorHandler) {
        window.errorHandler.showWarning('部分图片无法加载，已显示备用图片', '图片加载问题');
      }
      
      // 移除加载标记
      img.removeAttribute('data-loading');
      
      // 使用默认图片
      const defaultImg = this.config.media?.images?.defaultImage || '../images/default.jpg';
      img.src = defaultImg;
      
      // 添加错误类
      img.classList.add('image-error');
      
      // 移除占位符
      this.removeImagePlaceholder(img);
      
      // 触发错误事件
      this.dispatchImageErrorEvent(img);
    } catch (err) {
      console.error('❌ 内部处理图片错误时出错:', err);
    }
  },
  
  /**
   * 优化现有图片
   */
  optimizeExistingImages() {
    try {
      console.log('🔄 开始优化现有图片...');
      
      // 获取所有图片
      const images = document.querySelectorAll('img:not([data-src])');
      let optimizedCount = 0;
      
      // 使用性能优化模块的DOM辅助函数进行批量处理
      if (window.domHelper && window.domHelper.throttle) {
        // 使用节流函数处理图片优化，避免主线程阻塞
        const optimizeImageThrottled = window.domHelper.throttle((img, index) => {
          try {
            // 为图片添加优化类
            img.classList.add('optimized-image');
            
            // 如果图片尺寸过大，尝试使用更合适的尺寸
            this.optimizeLargeImages(img);
            
            optimizedCount++;
            
            // 每优化10张图片报告一次进度
            if (optimizedCount % 10 === 0 || index === images.length - 1) {
              console.log(`📊 图片优化进度: ${optimizedCount}/${images.length}`);
            }
          } catch (error) {
            console.error(`❌ 优化图片时出错: ${img.src || '未知图片'}`, error);
            if (window.errorHandler) {
              window.errorHandler.handleError('图片优化失败', error, { module: 'imageOptimizer', image: img.src });
            }
          }
        }, 10); // 每10ms处理一次，避免阻塞
        
        // 分批处理图片
        for (let i = 0; i < images.length; i++) {
          // 使用setTimeout分批调度
          setTimeout(() => optimizeImageThrottled(images[i], i), i * 5);
        }
      } else {
        // 回退到简单的循环处理
        images.forEach(img => {
          // 为图片添加优化类
          img.classList.add('optimized-image');
          
          // 如果图片尺寸过大，尝试使用更合适的尺寸
          this.optimizeLargeImages(img);
        });
      }
      
      console.log(`✅ 图片优化任务已调度，总计需要优化 ${images.length} 张图片`);
    } catch (error) {
      console.error('❌ 优化现有图片时出错:', error);
      if (window.errorHandler) {
        window.errorHandler.handleError('批量图片优化失败', error, { module: 'imageOptimizer' });
      }
    }
  },
  
  // 优化大图片
  optimizeLargeImages(img) {
    try {
      // 检查图片尺寸
      if (img.naturalWidth && img.naturalHeight) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 如果图片尺寸明显大于视口，可能需要优化
        if (img.naturalWidth > viewportWidth * 2 || img.naturalHeight > viewportHeight * 2) {
          console.warn('检测到大图片可能需要优化:', img.src);
          // 这里可以添加进一步的优化逻辑
          
          // 使用错误处理模块显示警告
          if (window.errorHandler) {
            window.errorHandler.showNotice('检测到较大图片，可能影响加载性能', '图片优化建议');
          }
        }
      }
    } catch (error) {
      const errorMessage = '应用响应式调整时发生错误';
      console.error(`${errorMessage}:`, error);
      
      if (window.errorHandler) {
        window.errorHandler.handleError(errorMessage, error);
      }
    }
  },
  
  // 观察DOM变化
  observeDomChanges() {
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 元素节点
              // 检查添加的节点是否是图片
              if (node.tagName === 'IMG') {
                this.processNewImage(node);
              }
              
              // 检查子节点中的图片
              node.querySelectorAll('img').forEach(img => {
                this.processNewImage(img);
              });
            }
          });
        });
      });
      
      // 观察整个文档
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  },
  
  /**
   * 处理新添加的图片
   * @param {HTMLElement} img - 图片元素
   */
  processNewImage(img) {
    try {
      // 使用性能优化模块的批量DOM操作
      if (window.domHelper && window.domHelper.createFragment) {
        // 创建图片副本进行优化
        const clonedImg = img.cloneNode(true);
        
        // 处理懒加载
        if (clonedImg.hasAttribute('data-src')) {
          if (this.lazyLoadObserver) {
            this.lazyLoadObserver.observe(clonedImg);
          } else {
            // 降级方案：检查是否在视口中
            if (this.isElementInViewport(clonedImg)) {
              this.loadLazyImage(clonedImg);
            }
          }
        }
        
        // 添加优化类
        clonedImg.classList.add('optimized-image');
        
        // 使用requestAnimationFrame在动画帧中进行DOM替换，避免布局抖动
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            if (img.parentNode) {
              img.parentNode.replaceChild(clonedImg, img);
            }
          });
        } else {
          if (img.parentNode) {
            img.parentNode.replaceChild(clonedImg, img);
          }
        }
      } else {
        // 回退到简单的处理方式
        // 如果图片有data-src，使用懒加载
        if (img.hasAttribute('data-src')) {
          if (this.lazyLoadObserver) {
            this.lazyLoadObserver.observe(img);
          } else {
            // 降级方案：检查是否在视口中
            if (this.isElementInViewport(img)) {
              this.loadLazyImage(img);
            }
          }
        }
        
        // 添加优化类
        img.classList.add('optimized-image');
      }
    } catch (error) {
      const errorMessage = '处理图片时发生错误';
      console.error(`${errorMessage}:`, img, error);
      
      if (window.errorHandler) {
        window.errorHandler.handleError(errorMessage, error);
      }
    }
  },
  
  // 预加载图片
  preloadImages(imageUrls, priority = 'low') {
    // 将图片添加到预加载队列
    this.preloadQueue = this.preloadQueue.concat(imageUrls.map(url => ({
      url,
      priority
    })));
    
    // 开始预加载
    this.processPreloadQueue();
  },
  
  // 处理预加载队列
  processPreloadQueue() {
    // 如果队列为空，直接返回
    if (this.preloadQueue.length === 0) return;
    
    // 根据优先级排序
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    // 使用空闲时间处理预加载
    if (this.supportsRequestIdleCallback) {
      requestIdleCallback(this.preloadNextImage.bind(this), {
        timeout: 2000 // 2秒超时，确保图片最终会加载
      });
    } else {
      // 降级方案：使用setTimeout
      setTimeout(this.preloadNextImage.bind(this), 100);
    }
  },
  
  // 预加载下一张图片
  preloadNextImage() {
    if (this.preloadQueue.length === 0) return;
    
    // 获取下一张图片
    const item = this.preloadQueue.shift();
    
    // 如果图片已经在缓存中，跳过
    if (this.imageCache.has(item.url)) {
      this.processPreloadQueue();
      return;
    }
    
    // 预加载图片
    const img = new Image();
    img.onload = () => {
      // 添加到缓存
      this.imageCache.set(item.url, true);
      console.log('图片预加载完成:', item.url);
      
      // 继续处理队列
      this.processPreloadQueue();
    };
    
    img.onerror = () => {
      console.error('图片预加载失败:', item.url);
      // 继续处理队列
      this.processPreloadQueue();
    };
    
    img.src = item.url;
  },
  
  // 检查元素是否在视口中
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= -rect.height * 2 &&
      rect.left >= -rect.width * 2 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height * 2 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width * 2
    );
  },
  
  // 触发图片加载完成事件
  dispatchImageLoadedEvent(img) {
    const event = new CustomEvent('image:loaded', {
      bubbles: true,
      detail: { image: img }
    });
    img.dispatchEvent(event);
  },
  
  // 触发图片加载错误事件
  dispatchImageErrorEvent(img) {
    const event = new CustomEvent('image:error', {
      bubbles: true,
      detail: { image: img }
    });
    img.dispatchEvent(event);
  }
};

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

export default imageOptimizerModule;