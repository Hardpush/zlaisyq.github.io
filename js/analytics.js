// 数据分析模块 - 用于监控用户行为和性能指标
const analytics = (() => {
  // 配置项
  let config = {
    enabled: false,
    debug: false,
    sessionTimeout: 30 * 60 * 1000, // 默认30分钟会话超时
    eventBatchSize: 10,
    sendInterval: 5000, // 默认5秒发送间隔
    apiEndpoint: '/analytics' // 模拟API端点
  };
  
  // 内部状态
  let isInitialized = false;
  let sessionId = null;
  let sessionStartTime = null;
  let eventQueue = [];
  let sendTimer = null;
  let lastEventTime = null;
  let pageViewStartTime = null;
  
  // 存储的事件类型列表
  const VALID_EVENT_TYPES = [
    'page_view',
    'click',
    'hover',
    'scroll',
    'play',
    'pause',
    'error',
    'performance',
    'interaction'
  ];
  
  // 初始化模块
  function init(options = {}) {
    // 合并配置
    config = { ...config, ...options };
    
    if (!config.enabled) {
      log('数据分析已禁用');
      return;
    }
    
    // 生成会话ID
    sessionId = generateSessionId();
    sessionStartTime = Date.now();
    lastEventTime = Date.now();
    
    // 记录页面加载时间
    if (typeof window !== 'undefined' && window.performance) {
      const navigationEntry = window.performance.getEntriesByType('navigation')[0];
      if (navigationEntry) {
        trackPerformance({
          type: 'page_load',
          duration: navigationEntry.duration,
          domInteractive: navigationEntry.domInteractive,
          domComplete: navigationEntry.domComplete,
          loadEventEnd: navigationEntry.loadEventEnd
        });
      }
    }
    
    // 跟踪初始页面浏览
    trackPageView();
    
    // 启动事件发送定时器
    startSendTimer();
    
    // 设置会话超时处理
    setupSessionTimeout();
    
    // 添加页面卸载事件，确保事件被发送
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    
    isInitialized = true;
    log('数据分析模块已初始化');
    
    return true;
  }
  
  // 生成会话ID
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // 跟踪事件
  function trackEvent(eventData) {
    if (!config.enabled || !isInitialized) return false;
    
    // 验证事件数据
    if (!eventData || !eventData.type) {
      logError('事件必须包含type字段');
      return false;
    }
    
    // 验证事件类型
    if (!VALID_EVENT_TYPES.includes(eventData.type)) {
      logError(`无效的事件类型: ${eventData.type}`);
      return false;
    }
    
    const event = {
      sessionId,
      timestamp: Date.now(),
      type: eventData.type,
      category: eventData.category || 'general',
      action: eventData.action || 'click',
      label: eventData.label || '',
      value: eventData.value || 0,
      meta: eventData.meta || {},
      // 添加额外的上下文信息
      context: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
        url: typeof window !== 'undefined' ? window.location.href : ''
      }
    };
    
    // 添加到事件队列
    eventQueue.push(event);
    lastEventTime = Date.now();
    
    // 如果队列达到批处理大小，立即发送
    if (eventQueue.length >= config.eventBatchSize) {
      flushEvents();
    }
    
    log(`事件已添加到队列: ${event.type}`, event);
    return true;
  }
  
  // 跟踪页面浏览
  function trackPageView(pageInfo = {}) {
    const pageData = {
      title: typeof document !== 'undefined' ? document.title : 'Unknown Page',
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      ...pageInfo
    };
    
    pageViewStartTime = Date.now();
    
    return trackEvent({
      type: 'page_view',
      action: 'view',
      label: pageData.title,
      meta: pageData
    });
  }
  
  // 跟踪错误
  function trackError(errorData) {
    if (!errorData) return false;
    
    const errorEvent = {
      type: 'error',
      action: 'error',
      label: errorData.name || 'Unknown Error',
      value: 1,
      meta: {
        message: errorData.message || '',
        stack: errorData.stack || '',
        filename: errorData.filename || '',
        lineno: errorData.lineno || 0,
        colno: errorData.colno || 0,
        context: errorData.context || {}
      }
    };
    
    // 错误事件优先发送
    const result = trackEvent(errorEvent);
    flushEvents(); // 立即发送错误事件
    return result;
  }
  
  // 跟踪性能
  function trackPerformance(performanceData) {
    if (!performanceData || !performanceData.type) return false;
    
    return trackEvent({
      type: 'performance',
      action: 'measure',
      label: performanceData.type,
      value: performanceData.duration || 0,
      meta: performanceData
    });
  }
  
  // 获取会话信息
  function getSessionInfo() {
    return {
      sessionId,
      startTime: sessionStartTime,
      duration: Date.now() - sessionStartTime,
      eventCount: eventQueue.length
    };
  }
  
  // 发送事件队列中的所有事件
  function flushEvents() {
    if (eventQueue.length === 0 || !config.enabled) return Promise.resolve([]);
    
    const eventsToSend = [...eventQueue];
    eventQueue = [];
    
    log(`发送 ${eventsToSend.length} 个事件到分析服务器`);
    
    // 模拟API调用
    return new Promise((resolve) => {
      // 在真实环境中，这里应该是一个fetch或XMLHttpRequest
      setTimeout(() => {
        // 模拟成功响应
        log('事件发送成功');
        resolve(eventsToSend);
      }, 100);
    });
  }
  
  // 启动发送定时器
  function startSendTimer() {
    // 清除现有定时器
    if (sendTimer) {
      clearInterval(sendTimer);
    }
    
    // 设置新定时器
    sendTimer = setInterval(() => {
      if (eventQueue.length > 0) {
        flushEvents();
      }
    }, config.sendInterval);
  }
  
  // 设置会话超时
  function setupSessionTimeout() {
    if (typeof window !== 'undefined') {
      // 定期检查会话是否超时
      setInterval(() => {
        if (Date.now() - lastEventTime > config.sessionTimeout) {
          log('会话超时，创建新会话');
          // 发送当前会话的事件
          flushEvents().then(() => {
            // 重置会话
            sessionId = generateSessionId();
            sessionStartTime = Date.now();
            lastEventTime = Date.now();
            // 跟踪新会话的页面浏览
            trackPageView();
          });
        }
      }, 60000); // 每分钟检查一次
    }
  }
  
  // 处理页面卸载
  function handleBeforeUnload() {
    // 尝试发送剩余事件
    // 注意：由于浏览器限制，这可能不会总是成功
    flushEvents();
  }
  
  // 清理资源
  function cleanup() {
    log('清理数据分析资源...');
    
    // 清除定时器
    if (sendTimer) {
      clearInterval(sendTimer);
      sendTimer = null;
    }
    
    // 移除事件监听器
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    
    // 尝试发送剩余的事件
    flushEvents();
    
    // 重置状态
    isInitialized = false;
    eventQueue = [];
    
    log('数据分析资源清理完成');
  }
  
  // 日志工具
  function log(message, data = null) {
    if (config.debug) {
      console.log(`[Analytics] ${message}`, data);
    }
  }
  
  function logError(message, data = null) {
    console.error(`[Analytics Error] ${message}`, data);
  }
  
  // 模块暴露的方法和属性
  return {
    init,
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    getSessionInfo,
    flushEvents,
    isInitialized,
    cleanup
  };
})();

// 导出模块
export default analytics;