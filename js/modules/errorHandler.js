// 统一错误处理模块 - 提供一致的错误处理和用户提示
const errorHandlerModule = {
  // 错误级别
  ERROR_LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 3,
    CRITICAL: 4
  },
  
  // 默认配置
  config: {
    errorLevel: 1, // 默认显示INFO及以上级别
    enableNotifications: true,
    enableLogging: true,
    showDetailedErrors: false
  },
  
  // 通知元素
  notificationElement: null,
  
  // 初始化错误处理模块
  init(appState, config = {}) {
    this.appState = appState;
    this.config = { ...this.config, ...config };
    
    // 创建通知元素
    this.createNotificationElement();
    
    // 设置全局错误处理
    this.setupGlobalErrorHandlers();
    
    console.log('✅ 错误处理模块初始化完成');
  },
  
  // 创建通知元素
  createNotificationElement() {
    if (this.notificationElement) return;
    
    this.notificationElement = document.createElement('div');
    this.notificationElement.id = 'error-notification';
    this.notificationElement.className = 'fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg transform transition-all duration-300 translate-y-[-100px] opacity-0';
    this.notificationElement.style.pointerEvents = 'none';
    
    // 添加通知内容结构
    this.notificationElement.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-3" id="notification-icon"></div>
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white" id="notification-title"></h3>
            <div class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="notification-message"></div>
          </div>
          <button type="button" class="flex-shrink-0 ml-4 bg-gray-100 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" id="notification-close">
            <span class="sr-only">关闭</span>
            <i class="fas fa-times text-gray-500 dark:text-gray-300"></i>
          </button>
        </div>
      </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(this.notificationElement);
    
    // 添加关闭按钮事件
    this.notificationElement.querySelector('#notification-close').addEventListener('click', () => {
      this.hideNotification();
    });
  },
  
  // 设置全局错误处理
  setupGlobalErrorHandlers() {
    // 全局错误处理
    window.addEventListener('error', (event) => {
      this.handleError('全局JavaScript错误', event.error);
    });
    
    // 未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('未处理的Promise拒绝', event.reason);
    });
  },
  
  // 处理错误
  handleError(title, error, level = this.ERROR_LEVELS.ERROR, showNotification = true) {
    // 检查错误级别是否应该被处理
    if (level < this.config.errorLevel) return;
    
    // 记录错误
    if (this.config.enableLogging) {
      this.logError(title, error, level);
    }
    
    // 显示通知
    if (showNotification && this.config.enableNotifications) {
      const message = this.formatErrorMessage(error);
      this.showNotification(title, message, this.getLevelType(level));
    }
    
    // 可以在这里添加其他处理逻辑，如发送错误报告等
  },
  
  // 记录错误
  logError(title, error, level) {
    const levelName = this.getLevelName(level);
    const timestamp = new Date().toISOString();
    
    if (level >= this.ERROR_LEVELS.ERROR) {
      console.error(`[${timestamp}] [${levelName}] ${title}:`, error);
    } else if (level >= this.ERROR_LEVELS.WARNING) {
      console.warn(`[${timestamp}] [${levelName}] ${title}:`, error);
    } else if (level >= this.ERROR_LEVELS.INFO) {
      console.info(`[${timestamp}] [${levelName}] ${title}`);
    } else {
      console.log(`[${timestamp}] [${levelName}] ${title}:`, error);
    }
  },
  
  // 格式化错误消息
  formatErrorMessage(error) {
    if (!error) return '未知错误';
    
    if (typeof error === 'string') {
      return error;
    }
    
    let message = '';
    
    if (error.message) {
      message = error.message;
    } else if (error.toString) {
      message = error.toString();
    } else {
      message = '未知错误';
    }
    
    // 如果配置允许，显示详细错误信息
    if (this.config.showDetailedErrors && error.stack) {
      message += '\n' + error.stack.split('\n').slice(0, 3).join('\n');
    }
    
    return message;
  },
  
  // 显示通知
  showNotification(title, message, type = 'error') {
    if (!this.notificationElement) {
      this.createNotificationElement();
    }
    
    // 设置通知内容
    this.notificationElement.querySelector('#notification-title').textContent = title;
    this.notificationElement.querySelector('#notification-message').textContent = message;
    
    // 设置通知图标和样式
    const iconElement = this.notificationElement.querySelector('#notification-icon');
    let iconClass = 'fas ';
    let bgColor = '';
    let textColor = '';
    
    switch (type) {
      case 'success':
        iconClass += 'fa-check-circle text-green-500';
        bgColor = 'bg-green-50 dark:bg-green-900/30';
        textColor = 'text-green-800 dark:text-green-300';
        break;
      case 'warning':
        iconClass += 'fa-exclamation-triangle text-yellow-500';
        bgColor = 'bg-yellow-50 dark:bg-yellow-900/30';
        textColor = 'text-yellow-800 dark:text-yellow-300';
        break;
      case 'info':
        iconClass += 'fa-info-circle text-blue-500';
        bgColor = 'bg-blue-50 dark:bg-blue-900/30';
        textColor = 'text-blue-800 dark:text-blue-300';
        break;
      default: // error
        iconClass += 'fa-exclamation-circle text-red-500';
        bgColor = 'bg-red-50 dark:bg-red-900/30';
        textColor = 'text-red-800 dark:text-red-300';
    }
    
    iconElement.className = iconClass;
    const contentElement = this.notificationElement.querySelector('div.p-4');
    contentElement.className = `p-4 ${bgColor} rounded-lg shadow-lg`;
    
    // 显示通知
    this.notificationElement.style.transform = 'translate(0)';
    this.notificationElement.style.opacity = '1';
    this.notificationElement.style.pointerEvents = 'auto';
    
    // 自动隐藏（除了错误通知）
    if (type !== 'error') {
      setTimeout(() => {
        this.hideNotification();
      }, 5000);
    }
  },
  
  // 隐藏通知
  hideNotification() {
    if (!this.notificationElement) return;
    
    this.notificationElement.style.transform = 'translateY(-100px)';
    this.notificationElement.style.opacity = '0';
    this.notificationElement.style.pointerEvents = 'none';
  },
  
  // 显示成功消息
  showSuccess(message, title = '操作成功') {
    this.showNotification(title, message, 'success');
  },
  
  // 显示警告消息
  showWarning(message, title = '警告') {
    this.showNotification(title, message, 'warning');
  },
  
  // 显示信息消息
  showInfo(message, title = '提示') {
    this.showNotification(title, message, 'info');
  },
  
  // 获取级别名称
  getLevelName(level) {
    const names = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    return names[level] || 'UNKNOWN';
  },
  
  // 获取级别类型（用于UI显示）
  getLevelType(level) {
    if (level >= this.ERROR_LEVELS.ERROR) return 'error';
    if (level >= this.ERROR_LEVELS.WARNING) return 'warning';
    if (level >= this.ERROR_LEVELS.INFO) return 'info';
    return 'success';
  },
  
  // 更新配置
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  },
  
  // 创建错误消息元素
  createErrorMessageElement(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message text-red-500 mb-4 p-3 bg-red-50 rounded border border-red-200';
    errorElement.textContent = message;
    return errorElement;
  },
  
  // 在指定元素中显示错误
  showErrorInElement(element, message) {
    // 清除之前的错误
    this.clearErrorFromElement(element);
    
    // 创建新的错误元素
    const errorElement = this.createErrorMessageElement(message);
    element.appendChild(errorElement);
    
    // 返回错误元素，以便稍后可以清除
    return errorElement;
  },
  
  // 清除元素中的错误
  clearErrorFromElement(element) {
    const existingError = element.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
};

export default errorHandlerModule;