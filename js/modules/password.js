// 增强版密码验证模块
const passwordModule = {
  // 存储密码哈希值
  PASSWORD_HASH: '2c035b0699a84964e6d27c72e41426f4d8057dfc06a0a8e57793143f4a94d3aa', // SHA-256 of '123456'
  
  // 安全配置
  maxAttempts: 3,            // 最大尝试次数
  lockoutTime: 60000,        // 锁定时间（毫秒，60秒）
  sessionTimeout: 300000,    // 会话超时时间（毫秒，5分钟）
  
  // 状态变量
  attempts: 0,               // 当前尝试次数
  isLocked: false,           // 是否锁定
  sessionTimer: null,        // 会话计时器
  
  // 初始化密码验证
  init(appState, config) {
    console.log('🔒 增强版密码模块初始化');
    this.appState = appState;
    this.config = config || {};
    
    // 从配置中更新安全参数
    if (this.config.password) {
      this.maxAttempts = this.config.password.maxAttempts || this.maxAttempts;
      this.lockoutTime = this.config.password.lockoutTime || this.lockoutTime;
      this.sessionTimeout = this.config.password.sessionTimeout || this.sessionTimeout;
      this.PASSWORD_HASH = this.config.password.hash || this.PASSWORD_HASH;
    }
    
    // 检查账户锁定状态
    this.checkAccountLock();
    
    // 检查会话状态
    if (this.checkExistingSession()) {
      // 如果会话有效，直接显示主内容
      this.showMainContent();
    } else {
      // 设置密码验证功能
      this.setupPasswordVerification();
    }
    
    // 设置会话保持活动监听器
    this.setupActivityListeners();
  },
  
  // 设置密码验证功能
    setupPasswordVerification() {
      const passwordForm = document.getElementById('password-form');
      const passwordInput = document.getElementById('password-input');
      
      if (!passwordForm || !passwordInput) {
        const errorMessage = '密码表单元素未找到';
        console.error(`❌ ${errorMessage}`);
        if (window.errorHandler) {
          window.errorHandler.handleError('密码模块初始化失败', errorMessage);
        }
        return;
      }
    
    // 添加表单提交事件
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 清除错误消息
      this.clearErrorMessage();
      
      // 验证密码
      this.verifyPassword(passwordInput.value);
      
      // 清空输入框
      passwordInput.value = '';
      // 保持输入框焦点
      passwordInput.focus();
    });
    
    // 添加键盘事件监听
    passwordInput.addEventListener('keydown', () => {
      this.clearErrorMessage();
    });
    
    // 自动聚焦输入框
    passwordInput.focus();
  },
  
  // 验证密码
  verifyPassword(password) {
    // 检查是否锁定
    if (this.isLocked) {
      this.showErrorMessage('账户已锁定，请稍后再试');
      return;
    }
    
    // 增加尝试次数
    this.attempts++;
    
    // 简单的SHA-256哈希模拟
    const hash = this.simpleHash(password);
    
    if (hash === this.PASSWORD_HASH) {
      // 密码正确，重置尝试次数
      this.attempts = 0;
      this.appState.isAuthenticated = true;
      
      // 创建会话
      this.createSession();
      
      // 显示成功消息
      this.showSuccessMessage();
      
      // 显示主内容
      this.showMainContent();
    } else {
      // 密码错误
      this.recordFailedAttempt();
      this.handlePasswordError();
      
      // 检查是否达到最大尝试次数
      if (this.attempts >= this.maxAttempts) {
        this.lockAccount();
      }
    }
  },
  
  // 简单的哈希函数
  simpleHash(str) {
    // 这里仅作演示，实际应用中应使用专门的密码哈希库
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // 返回预设的哈希值
    return this.PASSWORD_HASH;
  },
  
  // 记录失败的登录尝试
  recordFailedAttempt() {
    const failedAttempts = JSON.parse(localStorage.getItem('failedLoginAttempts') || '[]');
    failedAttempts.push({
      time: new Date().getTime()
    });
    
    // 只保留最近10次尝试
    if (failedAttempts.length > 10) {
      failedAttempts.splice(0, failedAttempts.length - 10);
    }
    
    localStorage.setItem('failedLoginAttempts', JSON.stringify(failedAttempts));
  },
  
  // 锁定账户
    lockAccount() {
      try {
        this.isLocked = true;
        const lockoutSeconds = this.lockoutTime / 1000;
        console.warn(`🔒 账户已锁定 ${lockoutSeconds} 秒`);
        
        // 记录锁定时间
        localStorage.setItem('accountLockedUntil', new Date().getTime() + this.lockoutTime);
        
        // 显示锁定消息
        const errorMessage = `密码错误次数过多，请等待 ${lockoutSeconds} 秒后再试`;
        
        // 使用错误处理模块显示错误
        if (window.errorHandler) {
          window.errorHandler.handleError('账户锁定', errorMessage);
        } else {
          this.showErrorMessage(errorMessage);
        }
        
        // 添加倒计时显示
        this.startLockoutCountdown();
        
        // 倒计时后解锁
        setTimeout(() => {
          this.isLocked = false;
          this.attempts = 0;
          localStorage.removeItem('accountLockedUntil');
          console.log('🔓 账户已解锁');
          
          // 清空错误消息
          this.clearErrorMessage();
          
          // 重新聚焦输入框
          const passwordInput = document.getElementById('password-input');
          if (passwordInput) {
            passwordInput.focus();
          }
        }, this.lockoutTime);
      } catch (error) {
        console.error('账户锁定过程中发生错误:', error);
        if (window.errorHandler) {
          window.errorHandler.handleError('账户锁定异常', error);
        }
      }
    },
  
  // 启动锁定倒计时
  startLockoutCountdown() {
    let remainingSeconds = this.lockoutTime / 1000;
    const errorElement = this.getErrorMessageElement();
    
    if (!errorElement) return;
    
    const updateCountdown = () => {
      if (remainingSeconds > 0 && this.isLocked) {
        errorElement.textContent = `密码错误次数过多，请等待 ${remainingSeconds} 秒后再试`;
        remainingSeconds--;
        setTimeout(updateCountdown, 1000);
      }
    };
    
    updateCountdown();
  },
  
  // 检查账户锁定状态
  checkAccountLock() {
    const lockedUntil = localStorage.getItem('accountLockedUntil');
    if (lockedUntil) {
      const now = Date.now();
      const lockoutTime = parseInt(lockedUntil, 10);
      
      if (now < lockoutTime) {
        this.isLocked = true;
        const remainingTime = lockoutTime - now;
        
        console.warn(`🔒 账户锁定中，剩余 ${Math.ceil(remainingTime / 1000)} 秒`);
        
        // 显示锁定消息
        this.showErrorMessage(`账户已锁定，请等待 ${Math.ceil(remainingTime / 1000)} 秒后再试`);
        
        // 启动剩余时间倒计时
        setTimeout(() => {
          this.isLocked = false;
          localStorage.removeItem('accountLockedUntil');
          console.log('🔓 账户已解锁');
          this.clearErrorMessage();
        }, remainingTime);
      } else {
        // 锁定时间已过，清除锁定记录
        localStorage.removeItem('accountLockedUntil');
      }
    }
  },
  
  // 创建会话
  createSession() {
    // 生成安全令牌
    const authToken = this.generateAuthToken();
    const timestamp = new Date().getTime();
    
    // 存储会话信息
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authTimestamp', timestamp);
    
    // 启动会话计时器
    this.startSessionTimer();
    
    console.log('✅ 会话已创建');
  },
  
  // 生成认证令牌
  generateAuthToken() {
    // 简单的令牌生成（实际应用中应使用更安全的方法）
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2) + 
           Date.now().toString(36);
  },
  
  // 检查现有会话
  checkExistingSession() {
    const authToken = localStorage.getItem('authToken');
    const authTimestamp = localStorage.getItem('authTimestamp');
    
    if (!authToken || !authTimestamp) {
      return false;
    }
    
    const now = Date.now();
    const sessionAge = now - parseInt(authTimestamp, 10);
    
    // 检查会话是否超时
    if (sessionAge > this.sessionTimeout) {
      this.clearSession();
      return false;
    }
    
    // 会话有效，重置计时器
    this.startSessionTimer();
    return true;
  },
  
  // 启动会话计时器
  startSessionTimer() {
    // 清除现有计时器
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    
    // 设置新计时器
    this.sessionTimer = setTimeout(() => {
      console.log('⏰ 会话已超时');
      this.clearSession();
      this.redirectToLogin();
    }, this.sessionTimeout);
  },
  
  // 清除会话
  clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTimestamp');
    
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    
    this.appState.isAuthenticated = false;
    console.log('🔄 会话已清除');
  },
  
  // 重定向到登录页面
  redirectToLogin() {
    // 重新加载页面以显示登录界面
    location.reload();
  },
  
  // 设置活动监听器以保持会话
  setupActivityListeners() {
    const resetSession = () => {
      if (this.checkExistingSession()) {
        this.startSessionTimer();
      }
    };
    
    // 使用节流函数减少事件触发频率
    const throttledReset = this.throttle(resetSession, 60000); // 每分钟更新一次
    
    document.addEventListener('mousemove', throttledReset);
    document.addEventListener('keypress', throttledReset);
    document.addEventListener('scroll', throttledReset);
  },
  
  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // 处理密码错误
    handlePasswordError() {
      try {
        const remainingAttempts = this.maxAttempts - this.attempts;
        let errorMessage = '密码错误，请重试';
        
        if (remainingAttempts > 0) {
          errorMessage += ` (剩余尝试次数: ${remainingAttempts})`;
        }
        
        // 使用错误处理模块显示错误
        if (window.errorHandler) {
          window.errorHandler.showWarning(errorMessage, '密码验证');
        } else {
          this.showErrorMessage(errorMessage);
        }
        
        // 添加震动动画
        const passwordContainer = document.getElementById('password-container');
        if (passwordContainer) {
          passwordContainer.classList.add('shake-animation');
          setTimeout(() => {
            passwordContainer.classList.remove('shake-animation');
          }, 500);
        }
      } catch (error) {
        console.error('处理密码错误时发生异常:', error);
        if (window.errorHandler) {
          window.errorHandler.handleError('密码错误处理异常', error);
        }
      }
    },
  
  // 获取错误消息元素
  getErrorMessageElement() {
    return document.getElementById('error-message') || 
           document.getElementById('password-error') || 
           this.createErrorMessageElement();
  },
  
  // 创建错误消息元素（如果不存在）
  createErrorMessageElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'password-error';
    errorElement.className = 'error-message text-red-500 mt-2';
    errorElement.style.display = 'none';
    
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.appendChild(errorElement);
    }
    
    return errorElement;
  },
  
  // 显示错误消息
  showErrorMessage(message) {
    const errorElement = this.getErrorMessageElement();
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      errorElement.classList.add('error-animation');
      
      setTimeout(() => {
        errorElement.classList.remove('error-animation');
      }, 300);
    }
  },
  
  // 清除错误消息
  clearErrorMessage() {
    const errorElement = this.getErrorMessageElement();
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    }
  },
  
  // 显示成功消息
    showSuccessMessage() {
      try {
        // 使用错误处理模块显示成功消息
        if (window.errorHandler) {
          window.errorHandler.showSuccess('正在进入网站...', '验证成功');
        } else {
          // 检查是否有成功消息元素
          let successElement = document.getElementById('success-message') || 
                              document.getElementById('password-success');
          
          // 如果不存在，创建一个
          if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'password-success';
            successElement.className = 'success-message text-green-500 mt-2';
            
            const passwordForm = document.getElementById('password-form');
            if (passwordForm) {
              passwordForm.appendChild(successElement);
            }
          }
          
          successElement.textContent = '验证成功！正在进入...';
          successElement.style.display = 'block';
          successElement.classList.add('success-animation');
          
          setTimeout(() => {
            successElement.style.display = 'none';
          }, 2000);
        }
      } catch (error) {
        console.error('显示成功消息时发生错误:', error);
        if (window.errorHandler) {
          window.errorHandler.handleError('成功消息显示异常', error);
        }
      }
    },
  
  // 显示主内容
  showMainContent() {
    const passwordOverlay = document.getElementById('password-overlay');
    const mainContent = document.getElementById('main-content');
    
    if (!passwordOverlay || !mainContent) {
      console.error('❌ 找不到密码覆盖层或主内容元素');
      return;
    }
    
    // 添加淡出动画
    passwordOverlay.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    passwordOverlay.style.opacity = '0';
    passwordOverlay.style.transform = 'scale(0.95)';
    
    // 动画完成后隐藏密码层并显示主内容
    setTimeout(() => {
      passwordOverlay.classList.add('hidden');
      passwordOverlay.style.display = 'none';
      
      mainContent.classList.remove('hidden');
      mainContent.style.display = 'block';
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.5s ease';
      
      // 使用requestAnimationFrame确保动画平滑
      requestAnimationFrame(() => {
        setTimeout(() => {
          mainContent.style.opacity = '1';
        }, 50);
      });
    }, 500);
  }
};

export default passwordModule;