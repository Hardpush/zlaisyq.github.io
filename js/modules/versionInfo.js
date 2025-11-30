/**
 * 版本信息模块
 * 用于管理网站的版本号、构建信息和更新日志
 */
const versionInfo = {
  // 版本号
  version: '1.2.0',
  
  // 构建日期
  buildDate: new Date().toISOString().split('T')[0],
  
  // 构建时间戳
  buildTimestamp: Date.now(),
  
  // 环境类型
  environment: process.env.NODE_ENV || 'development',
  
  // 更新日志
  changelog: [
    { version: '1.2.0', date: '2024-03-20', changes: ['添加移动端适配', '优化错误处理', '增强无障碍支持'] },
    { version: '1.1.0', date: '2024-02-15', changes: ['优化图片加载性能', '改进用户界面交互'] },
    { version: '1.0.0', date: '2024-01-01', changes: ['初始版本发布', '基础功能实现'] }
  ],
  
  /**
   * 获取完整版本信息
   * @returns {Object} 版本信息对象
   */
  getVersionInfo() {
    return {
      version: this.version,
      buildDate: this.buildDate,
      buildTimestamp: this.buildTimestamp,
      environment: this.environment,
      lastUpdated: this.changelog[0]?.date || this.buildDate
    };
  },
  
  /**
   * 获取版本号字符串
   * @returns {string} 格式化的版本号
   */
  getVersionString() {
    return `${this.version} (${this.environment}) - ${this.buildDate}`;
  },
  
  /**
   * 获取最新更新日志
   * @param {number} limit - 返回的更新日志条目数量
   * @returns {Array} 更新日志条目数组
   */
  getRecentChanges(limit = 1) {
    return this.changelog.slice(0, limit);
  },
  
  /**
   * 比较版本号
   * @param {string} version - 要比较的版本号
   * @returns {number} -1: 当前版本更小, 0: 版本相同, 1: 当前版本更大
   */
  compareVersion(version) {
    const current = this.version.split('.').map(Number);
    const target = version.split('.').map(Number);
    
    for (let i = 0; i < current.length; i++) {
      if (current[i] > target[i]) return 1;
      if (current[i] < target[i]) return -1;
    }
    return 0;
  },
  
  /**
   * 检查是否需要显示更新提示
   * @param {string} lastSeenVersion - 上次看到的版本号
   * @returns {boolean} 是否需要显示更新提示
   */
  shouldShowUpdateNotice(lastSeenVersion) {
    if (!lastSeenVersion) return true;
    return this.compareVersion(lastSeenVersion) > 0;
  },
  
  /**
   * 显示版本信息在控制台
   */
  logVersionInfo() {
    console.log(`💖 爱情纪念网站 v${this.getVersionString()}`);
    console.log('📅 构建时间:', new Date(this.buildTimestamp).toLocaleString());
    
    if (this.changelog.length > 0) {
      console.log('🔄 最新更新:', this.changelog[0].changes.join(', '));
    }
    
    console.log('==================================');
  },
  
  /**
   * 生成缓存清除键
   * @returns {string} 缓存键
   */
  getCacheBustKey() {
    return `${this.version}-${this.buildTimestamp.toString().slice(-6)}`;
  },
  
  /**
   * 保存上次访问的版本号
   */
  saveLastVisit() {
    try {
      localStorage.setItem('lastVisitedVersion', this.version);
      localStorage.setItem('lastVisitedDate', new Date().toISOString());
    } catch (error) {
      console.warn('保存访问记录失败:', error);
    }
  },
  
  /**
   * 获取上次访问的版本号
   * @returns {string|null} 上次访问的版本号
   */
  getLastVisitedVersion() {
    try {
      return localStorage.getItem('lastVisitedVersion');
    } catch (error) {
      console.warn('获取访问记录失败:', error);
      return null;
    }
  }
};

export default versionInfo;
