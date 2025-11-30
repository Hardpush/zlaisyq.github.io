// 性能优化模块 - v1.2.0
// 负责网站性能优化，包括资源预加载、图片优化、代码优化等

class PerformanceOptimizer {
  constructor() {
    this.startTime = performance.now();
    this.criticalResources = [];
    this.loadedResources = new Set();
    this.performanceData = {
      domLoadTime: 0,
      resourcesLoaded: 0,
      totalResources: 0,
      memoryUsage: 0
    };
    
    // 配置项
    this.config = {
      enableLazyLoading: true,
      enableResourceHinting: true,
      enableCacheBusting: true,
      enableCriticalCSS: true,
      maxConcurrentRequests: 6,
      prefetchDistance: 300
    };
  }

  /**
   * 初始化性能优化模块
   * @param {Object} appState - 应用状态对象
   * @param {Object} options - 配置选项
   */
  init(appState, options = {}) {
    try {
      this.appState = appState;
      this.config = { ...this.config, ...options };
      
      console.log('🔄 性能优化模块初始化中...');
      
      // 设置性能监控
      this.setupPerformanceMonitoring();
      
      // 启用资源提示
      if (this.config.enableResourceHinting) {
        this.setupResourceHinting();
      }
      
      // 启用懒加载
      if (this.config.enableLazyLoading) {
        this.setupLazyLoading();
      }
      
      // 优化缓存策略
      if (this.config.enableCacheBusting) {
        this.setupCacheBusting();
      }
      
      // 启用关键CSS优化
      if (this.config.enableCriticalCSS) {
        this.optimizeCriticalCSS();
      }
      
      // 减少主线程阻塞
      this.reduceMainThreadBlocking();
      
      // 优化大型DOM操作
      this.optimizeDomOperations();
      
      console.log('✅ 性能优化模块初始化完成');
    } catch (error) {
      console.error('❌ 性能优化模块初始化失败:', error);
      if (window.errorHandler) {
        window.errorHandler.handleError('性能优化初始化失败', error);
      }
    }
  }

  /**
   * 设置性能监控
   */
  setupPerformanceMonitoring() {
    try {
      // 监听load事件
      window.addEventListener('load', () => {
        this.performanceData.domLoadTime = performance.now() - this.startTime;
        console.log(`⏱️ DOM加载时间: ${this.performanceData.domLoadTime.toFixed(2)}ms`);
        this.logPerformanceMetrics();
      });

      // 监听资源加载
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.initiatorType) {
              this.performanceData.resourcesLoaded++;
              this.performanceData.totalResources++;
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });

        // 监听LCP、FID等核心性能指标
        const po = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            console.log(`📊 性能指标 [${entry.entryType}]: ${entry.startTime.toFixed(2)}ms`);
          });
        });
        po.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'layout-shift'] });
      }

      // 内存使用监控
      if (performance && performance.memory) {
        this.performanceData.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
      }
    } catch (error) {
      console.warn('性能监控设置失败:', error);
    }
  }

  /**
   * 设置资源提示（预连接、预加载等）
   */
  setupResourceHinting() {
    try {
      // 预连接到关键域名
      const domains = [
        window.location.hostname
        // 可以添加其他CDN或API域名
      ];

      domains.forEach(domain => {
        if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = `https://${domain}`;
          document.head.appendChild(link);
        }
      });

      // 预加载关键资源
      this.prefetchCriticalResources();
    } catch (error) {
      console.warn('资源提示设置失败:', error);
    }
  }

  /**
   * 预加载关键资源
   */
  prefetchCriticalResources() {
    try {
      // 预加载关键字体
      const fontLinks = document.querySelectorAll('link[rel="stylesheet"]');
      fontLinks.forEach(link => {
        if (link.href.includes('fonts.googleapis.com') || link.href.includes('fonts.gstatic.com')) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.href = link.href;
          preloadLink.as = 'style';
          document.head.appendChild(preloadLink);
        }
      });

      // 预预取可能会用到的资源
      this.prefetchLikelyResources();
    } catch (error) {
      console.warn('关键资源预加载失败:', error);
    }
  }

  /**
   * 预预取可能会用到的资源
   */
  prefetchLikelyResources() {
    try {
      // 预预取下一页可能会用到的图片
      const nextImages = [
        'img/photo1.jpg',
        'img/photo2.jpg',
        // 可以添加更多可能需要的图片
      ];

      nextImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = img;
        document.head.appendChild(link);
      });
    } catch (error) {
      console.warn('资源预预取失败:', error);
    }
  }

  /**
   * 设置图片懒加载
   */
  setupLazyLoading() {
    try {
      // 使用IntersectionObserver实现懒加载
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              
              if (src) {
                img.setAttribute('src', src);
                img.onload = () => {
                  img.classList.add('loaded');
                  this.loadedResources.add(src);
                };
                img.removeAttribute('data-src');
              }
              
              observer.unobserve(img);
            }
          });
        }, {
          rootMargin: `${this.config.prefetchDistance}px`,
          threshold: 0.01
        });

        // 观察所有懒加载图片
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      } else {
        // 回退方案：立即加载所有图片
        document.querySelectorAll('img[data-src]').forEach(img => {
          img.setAttribute('src', img.getAttribute('data-src'));
          img.removeAttribute('data-src');
        });
      }
    } catch (error) {
      console.warn('懒加载设置失败:', error);
    }
  }

  /**
   * 设置缓存破坏策略
   */
  setupCacheBusting() {
    try {
      // 获取缓存清除键
      const getCacheBustKey = () => {
        return this.appState && this.appState.getCacheBustKey ? 
               this.appState.getCacheBustKey() : 
               `v${new Date().getTime().toString().slice(-8)}`;
      };

      // 更新动态加载资源的URL
      this.cacheBustKey = getCacheBustKey();
      console.log(`🔑 缓存清除键: ${this.cacheBustKey}`);

      // 应用到动态加载的资源
      this.applyCacheBusting();
    } catch (error) {
      console.warn('缓存破坏策略设置失败:', error);
    }
  }

  /**
   * 应用缓存破坏
   */
  applyCacheBusting() {
    try {
      // 为动态加载的脚本添加缓存破坏参数
      window.cacheBustedLoad = (url) => {
        const cacheBustedUrl = `${url}${url.includes('?') ? '&' : '?'}v=${this.cacheBustKey}`;
        return cacheBustedUrl;
      };
    } catch (error) {
      console.warn('缓存破坏应用失败:', error);
    }
  }

  /**
   * 优化关键CSS
   */
  optimizeCriticalCSS() {
    try {
      // 注入关键CSS（这里简化处理，实际项目中可以提取首屏关键CSS）
      const criticalCSS = `
        .container { max-width: 1200px; margin: 0 auto; }
        .hero-section { opacity: 1; transition: opacity 0.3s ease; }
        .navbar { position: sticky; top: 0; z-index: 1000; }
        /* 可以添加更多首屏关键样式 */
      `;

      const style = document.createElement('style');
      style.textContent = criticalCSS;
      style.setAttribute('critical', 'true');
      document.head.appendChild(style);

      // 延迟加载非关键CSS
      this.deferNonCriticalCSS();
    } catch (error) {
      console.warn('关键CSS优化失败:', error);
    }
  }

  /**
   * 延迟加载非关键CSS
   */
  deferNonCriticalCSS() {
    try {
      // 延迟加载额外的样式表
      const nonCriticalStyles = document.querySelectorAll('link[rel="stylesheet"]:not([critical])');
      nonCriticalStyles.forEach(link => {
        const originalHref = link.getAttribute('href');
        link.setAttribute('href', '');
        link.setAttribute('data-href', originalHref);
      });

      // 页面加载完成后加载非关键CSS
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.querySelectorAll('link[data-href]').forEach(link => {
            link.setAttribute('href', link.getAttribute('data-href'));
            link.removeAttribute('data-href');
          });
        }, 500);
      });
    } catch (error) {
      console.warn('非关键CSS延迟加载失败:', error);
    }
  }

  /**
   * 减少主线程阻塞
   */
  reduceMainThreadBlocking() {
    try {
      // 将非关键脚本移至后台线程
      this.moveNonCriticalTasksToBackground();

      // 实现任务调度，避免长时间运行的JavaScript
      this.implementTaskScheduling();
    } catch (error) {
      console.warn('主线程阻塞优化失败:', error);
    }
  }

  /**
   * 将非关键任务移至后台线程
   */
  moveNonCriticalTasksToBackground() {
    try {
      // 使用Web Workers处理复杂计算（如果需要）
      window.scheduleInBackground = (task, callback) => {
        // 简化实现，实际项目中可以使用Web Workers
        setTimeout(() => {
          try {
            const result = task();
            callback(null, result);
          } catch (error) {
            callback(error);
          }
        }, 0);
      };
    } catch (error) {
      console.warn('后台任务调度设置失败:', error);
    }
  }

  /**
   * 实现任务调度
   */
  implementTaskScheduling() {
    try {
      // 微任务调度器
      window.scheduler = {
        microTask: (callback) => {
          if (window.requestIdleCallback) {
            requestIdleCallback(callback);
          } else {
            setTimeout(callback, 16);
          }
        },
        
        priorityTask: (callback) => {
          if (window.requestAnimationFrame) {
            requestAnimationFrame(callback);
          } else {
            setTimeout(callback, 0);
          }
        }
      };
    } catch (error) {
      console.warn('任务调度实现失败:', error);
    }
  }

  /**
   * 优化大型DOM操作
   */
  optimizeDomOperations() {
    try {
      // 提供高效DOM操作的辅助函数
      window.domHelper = {
        // 使用DocumentFragment批量添加元素
        createFragment: () => document.createDocumentFragment(),
        
        // 批量添加元素
        appendBatch: (parent, elements) => {
          const fragment = document.createDocumentFragment();
          elements.forEach(el => fragment.appendChild(el));
          parent.appendChild(fragment);
        },
        
        // 防抖函数
        debounce: (func, wait) => {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        },
        
        // 节流函数
        throttle: (func, limit) => {
          let inThrottle;
          return function(...args) {
            if (!inThrottle) {
              func.apply(this, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
            }
          };
        }
      };
    } catch (error) {
      console.warn('DOM操作优化失败:', error);
    }
  }

  /**
   * 优化图片加载
   */
  optimizeImages() {
    try {
      // 设置图片压缩和响应式处理
      document.querySelectorAll('img:not([loading])').forEach(img => {
        // 设置懒加载属性
        img.setAttribute('loading', 'lazy');
        
        // 优化图片尺寸
        this.optimizeImageSize(img);
      });
    } catch (error) {
      console.warn('图片优化失败:', error);
    }
  }

  /**
   * 优化图片尺寸
   */
  optimizeImageSize(img) {
    try {
      // 基于设备像素比优化图片
      const dpr = window.devicePixelRatio || 1;
      const width = img.clientWidth;
      
      if (width > 0) {
        // 可以根据需要替换为适当分辨率的图片
        const optimalWidth = Math.min(width * dpr, 1200);
        console.log(`📐 优化图片尺寸: ${img.src} -> ${optimalWidth}px`);
      }
    } catch (error) {
      console.warn('图片尺寸优化失败:', error);
    }
  }

  /**
   * 日志性能指标
   */
  logPerformanceMetrics() {
    try {
      const metrics = {
        loadTime: this.performanceData.domLoadTime,
        resources: `${this.performanceData.resourcesLoaded}/${this.performanceData.totalResources}`,
        memory: `${this.performanceData.memoryUsage.toFixed(2)}MB`,
        timestamp: new Date().toISOString()
      };
      
      console.log('📈 性能指标汇总:', metrics);
      
      // 可以将性能数据发送到分析服务
      if (window.analytics) {
        window.analytics.recordPerformance(metrics);
      }
    } catch (error) {
      console.warn('性能指标记录失败:', error);
    }
  }

  /**
   * 获取当前性能状态
   */
  getPerformanceStatus() {
    return {
      loadTime: this.performanceData.domLoadTime,
      resourcesLoaded: this.performanceData.resourcesLoaded,
      totalResources: this.performanceData.totalResources,
      memoryUsage: this.performanceData.memoryUsage,
      cacheBustKey: this.cacheBustKey,
      startTime: this.startTime
    };
  }

  /**
   * 清理资源
   */
  cleanup() {
    try {
      this.loadedResources.clear();
      console.log('🧹 性能优化模块资源已清理');
    } catch (error) {
      console.warn('资源清理失败:', error);
    }
  }
}

// 导出单例实例
const performanceOptimizer = new PerformanceOptimizer();
export default performanceOptimizer;
