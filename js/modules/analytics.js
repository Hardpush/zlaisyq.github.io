// 数据监控和分析模块
const analyticsModule = {
  // 配置项
  config: {
    enabled: true,
    debug: false,
    sessionTimeout: 30 * 60 * 1000, // 30分钟
    eventBatchSize: 20,
    sendInterval: 10000, // 10秒
  },
  
  // 内部状态
  state: {
    sessionId: null,
    startTime: null,
    events: [],
    lastSendTime: null,
    userData: {},
    performanceData: {},
  },
  
  // 初始化分析模块
  init(options = {}) {
    try {
      // 合并配置
      this.config = { ...this.config, ...options };
      
      if (!this.config.enabled) {
        console.log('📊 数据分析模块已禁用');
        return;
      }
      
      // 生成会话ID
      this.state.sessionId = this._generateSessionId();
      this.state.startTime = Date.now();
      this.state.lastSendTime = Date.now();
      
      // 收集基础用户数据
      this._collectUserData();
      
      // 初始化性能监控
      this._initPerformanceMonitoring();
      
      // 设置事件监听
      this._setupEventListeners();
      
      // 设置定时发送事件的定时器
      this._startEventSender();
      
      // 记录页面加载事件
      this.trackEvent('page_load', {
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      });
      
      console.log('📊 数据分析模块初始化成功');
      
      return this;
    } catch (error) {
      console.error('❌ 数据分析模块初始化失败:', error);
      // 不抛出错误，避免影响主应用
    }
  },
  
  // 跟踪事件
  trackEvent(eventName, eventData = {}) {
    if (!this.config.enabled) return;
    
    try {
      const event = {
        event_name: eventName,
        timestamp: Date.now(),
        session_id: this.state.sessionId,
        url: window.location.href,
        user_agent: navigator.userAgent,
        ...eventData,
      };
      
      this.state.events.push(event);
      
      // 如果事件数量达到批次大小，立即发送
      if (this.state.events.length >= this.config.eventBatchSize) {
        this._sendEvents();
      }
      
      if (this.config.debug) {
        console.log('📊 跟踪事件:', event);
      }
    } catch (error) {
      console.error('❌ 事件跟踪失败:', error);
    }
  },
  
  // 跟踪页面浏览
  trackPageView() {
    this.trackEvent('page_view', {
      page: window.location.pathname,
      title: document.title,
      scroll_depth: 0,
    });
  },
  
  // 跟踪错误
  trackError(errorMessage, errorDetails = {}) {
    this.trackEvent('error', {
      message: errorMessage,
      ...errorDetails,
    });
  },
  
  // 跟踪用户交互
  trackUserInteraction(elementType, action, details = {}) {
    this.trackEvent('user_interaction', {
      element_type: elementType,
      action: action,
      ...details,
    });
  },
  
  // 记录性能指标
  recordPerformanceMetric(metricName, value, details = {}) {
    if (!this.config.enabled) return;
    
    try {
      this.state.performanceData[metricName] = {
        value,
        timestamp: Date.now(),
        ...details,
      };
      
      // 同时发送到事件队列
      this.trackEvent('performance_metric', {
        metric_name: metricName,
        value: value,
        ...details,
      });
    } catch (error) {
      console.error('❌ 性能指标记录失败:', error);
    }
  },
  
  // 获取当前会话信息
  getSessionInfo() {
    return {
      session_id: this.state.sessionId,
      start_time: this.state.startTime,
      duration: Date.now() - this.state.startTime,
      event_count: this.state.events.length,
    };
  },
  
  // 手动发送所有事件
  flushEvents() {
    this._sendEvents();
  },
  
  // 清理资源
  cleanup() {
    try {
      // 发送剩余事件
      this._sendEvents();
      
      // 移除事件监听
      this._removeEventListeners();
      
      console.log('📊 数据分析模块已清理');
    } catch (error) {
      console.error('❌ 数据分析模块清理失败:', error);
    }
  },
  
  // 私有方法：生成会话ID
  _generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
  
  // 私有方法：收集用户数据
  _collectUserData() {
    try {
      this.state.userData = {
        language: navigator.language,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        connection_type: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      };
    } catch (error) {
      console.error('❌ 用户数据收集失败:', error);
    }
  },
  
  // 私有方法：初始化性能监控
  _initPerformanceMonitoring() {
    try {
      // 监听性能条目
      if ('performance' in window && 'PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.recordPerformanceMetric('navigation_time', entry.duration, {
                type: entry.entryType,
                name: entry.name,
              });
            } else if (entry.entryType === 'resource') {
              // 记录资源加载时间
              this.recordPerformanceMetric('resource_load_time', entry.duration, {
                resource_type: entry.initiatorType,
                resource_name: entry.name,
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['navigation', 'resource'] });
      }
      
      // 记录首屏加载时间
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.recordPerformanceMetric('load_time', performance.now(), {
            type: 'page_load',
          });
        }, 0);
      });
      
      // 记录首屏渲染时间
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.recordPerformanceMetric('first_contentful_paint', performance.now(), {
            type: 'render_metric',
          });
        });
      }
    } catch (error) {
      console.error('❌ 性能监控初始化失败:', error);
    }
  },
  
  // 私有方法：设置事件监听
  _setupEventListeners() {
    try {
      // 监听页面卸载事件，发送剩余数据
      window.addEventListener('beforeunload', () => this._sendEvents());
      
      // 监听滚动事件，记录滚动深度
      const throttledScroll = this._throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        // 只在滚动深度达到25%、50%、75%和100%时记录
        if (scrollPercent % 25 === 0) {
          this.trackEvent('scroll_depth', {
            percentage: scrollPercent,
            page: window.location.pathname,
          });
        }
      }, 1000);
      
      window.addEventListener('scroll', throttledScroll);
      
      // 监听用户交互事件
      this._setupInteractionListeners();
    } catch (error) {
      console.error('❌ 事件监听器设置失败:', error);
    }
  },
  
  // 私有方法：设置交互事件监听
  _setupInteractionListeners() {
    // 为关键元素添加点击事件监听
    const trackableElements = document.querySelectorAll('button, a, [data-trackable]');
    
    trackableElements.forEach((element) => {
      element.addEventListener('click', (e) => {
        const elementType = element.tagName.toLowerCase();
        const action = element.getAttribute('data-track-action') || 'click';
        const label = element.textContent.trim() || element.getAttribute('aria-label') || 'unnamed';
        
        this.trackUserInteraction(elementType, action, {
          label: label,
          id: element.id || 'no_id',
          class: element.className,
        });
      });
    });
  },
  
  // 私有方法：移除事件监听
  _removeEventListeners() {
    // 这里应该移除所有添加的事件监听器
    // 由于我们没有保存监听器引用，这里仅作提示
    console.log('📊 移除事件监听器');
  },
  
  // 私有方法：启动事件发送定时器
  _startEventSender() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.state.lastSendTime >= this.config.sendInterval) {
        this._sendEvents();
      }
    }, this.config.sendInterval);
  },
  
  // 私有方法：发送事件数据
  _sendEvents() {
    if (this.state.events.length === 0) return;
    
    try {
      const eventsToSend = [...this.state.events];
      this.state.events = [];
      this.state.lastSendTime = Date.now();
      
      // 构建发送数据
      const payload = {
        session_id: this.state.sessionId,
        user_data: this.state.userData,
        events: eventsToSend,
        timestamp: Date.now(),
      };
      
      if (this.config.debug) {
        console.log('📊 发送事件数据:', payload);
      }
      
      // 模拟发送数据到服务器
      // 在实际应用中，这里应该使用fetch或XMLHttpRequest发送到你的分析服务器
      this._mockSendToServer(payload);
    } catch (error) {
      console.error('❌ 事件发送失败:', error);
      // 发送失败时，将事件放回队列
      this.state.events = [...eventsToSend, ...this.state.events];
    }
  },
  
  // 私有方法：模拟发送数据到服务器
  _mockSendToServer(payload) {
    // 这里只是模拟，实际应用中应该发送到真实的服务器端点
    console.log('📊 模拟发送数据到分析服务器:', payload);
    
    // 可以将数据存储到localStorage以便后续处理
    try {
      localStorage.setItem('analytics_backup', JSON.stringify(this.state.events));
    } catch (e) {
      console.warn('❌ 无法存储分析数据到localStorage');
    }
  },
  
  // 私有方法：节流函数
  _throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
};

export default analyticsModule;
