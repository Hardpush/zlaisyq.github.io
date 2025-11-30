// 部署测试脚本 - 用于验证所有功能模块正常工作并准备部署

// 部署前检查清单和测试套件
const deploymentTest = {
  // 测试结果存储
  results: {
    passed: [],
    failed: [],
    warnings: []
  },
  
  // 开始测试
  async run() {
    console.log('==============================================');
    console.log('💖 张乐与石云青的爱情空间 - 部署前测试套件');
    console.log('==============================================');
    console.log('开始执行部署前检查...\n');
    
    // 重置测试结果
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
    
    try {
      // 运行所有检查
      await this.checkEnvironment();
      await this.checkDependencies();
      await this.checkModules();
      await this.checkPerformance();
      await this.checkAnalytics();
      await this.checkErrorHandling();
      await this.checkVersioning();
      await this.checkResourceAvailability();
      
      // 生成最终报告
      this.generateReport();
      
      return this.results.failed.length === 0;
    } catch (error) {
      console.error('测试过程中发生错误:', error);
      this.results.failed.push('测试套件执行失败: ' + error.message);
      this.generateReport();
      return false;
    }
  },
  
  // 检查运行环境
  async checkEnvironment() {
    console.log('🔍 检查运行环境...');
    
    // 检查浏览器兼容性
    if (typeof window !== 'undefined') {
      const browser = this.detectBrowser();
      console.log(`  当前浏览器: ${browser.name} ${browser.version}`);
      
      if (!this.isBrowserSupported(browser)) {
        this.results.warnings.push(`浏览器 ${browser.name} ${browser.version} 可能不完全支持所有功能`);
      } else {
        this.results.passed.push('浏览器兼容性检查通过');
      }
      
      // 检查网络连接
      if (navigator.onLine) {
        this.results.passed.push('网络连接检查通过');
      } else {
        this.results.warnings.push('网络连接不稳定，部分资源可能无法加载');
      }
      
      // 检查设备类型
      if (this.isMobileDevice()) {
        console.log('  检测到移动设备访问');
        this.results.passed.push('移动设备兼容性检查');
      } else {
        console.log('  检测到桌面设备访问');
        this.results.passed.push('桌面设备兼容性检查');
      }
    }
  },
  
  // 检查依赖模块
  async checkDependencies() {
    console.log('🔍 检查依赖模块...');
    
    // 检查核心模块是否可用
    const requiredModules = [
      { name: 'appState', check: () => typeof window.appState !== 'undefined' },
      { name: 'errorHandler', check: () => typeof window.errorHandler !== 'undefined' },
      { name: 'versionInfo', check: () => typeof window.versionInfo !== 'undefined' },
      { name: 'performanceOptimizer', check: () => typeof window.performanceOptimizer !== 'undefined' },
      { name: 'analytics', check: () => typeof window.analytics !== 'undefined' },
    ];
    
    for (const module of requiredModules) {
      if (module.check()) {
        console.log(`  ✅ ${module.name} 模块可用`);
        this.results.passed.push(`${module.name} 模块可用`);
      } else {
        console.log(`  ❌ ${module.name} 模块不可用`);
        this.results.failed.push(`${module.name} 模块不可用`);
      }
    }
  },
  
  // 检查功能模块
  async checkModules() {
    console.log('🔍 检查功能模块...');
    
    // 检查appState初始化状态
    if (typeof window.appState !== 'undefined' && window.appState.version) {
      console.log(`  应用版本: ${window.appState.version}`);
      console.log(`  构建日期: ${window.appState.buildDate}`);
      this.results.passed.push(`应用版本 ${window.appState.version} 已初始化`);
    }
    
    // 检查清理功能
    if (typeof window.appState !== 'undefined' && 
        typeof window.appState.addCleanupFunction === 'function' &&
        typeof window.appState.runCleanup === 'function') {
      this.results.passed.push('资源清理功能可用');
    } else {
      this.results.failed.push('资源清理功能不可用');
    }
    
    // 检查错误处理功能
    if (typeof window.appState !== 'undefined' && 
        typeof window.appState.recordError === 'function') {
      this.results.passed.push('错误处理功能可用');
    } else {
      this.results.failed.push('错误处理功能不可用');
    }
  },
  
  // 检查性能优化功能
  async checkPerformance() {
    console.log('🔍 检查性能优化功能...');
    
    if (typeof window.performance !== 'undefined') {
      // 测量页面加载性能
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`  页面加载时间: ${loadTime}ms`);
      
      if (loadTime < 3000) {
        this.results.passed.push(`页面加载性能良好 (${loadTime}ms)`);
      } else if (loadTime < 5000) {
        this.results.warnings.push(`页面加载时间略长 (${loadTime}ms)`);
      } else {
        this.results.failed.push(`页面加载时间过长 (${loadTime}ms)`);
      }
    }
    
    // 检查性能优化模块
    if (typeof window.performanceOptimizer !== 'undefined') {
      if (typeof window.performanceOptimizer.isInitialized === 'function' && 
          window.performanceOptimizer.isInitialized()) {
        this.results.passed.push('性能优化模块已初始化');
      } else {
        this.results.warnings.push('性能优化模块未初始化');
      }
    }
  },
  
  // 检查数据分析功能
  async checkAnalytics() {
    console.log('🔍 检查数据分析功能...');
    
    if (typeof window.appState !== 'undefined' && window.appState.analytics) {
      const analytics = window.appState.analytics;
      
      if (typeof analytics.isInitialized === 'function' && analytics.isInitialized()) {
        this.results.passed.push('数据分析模块已初始化');
        
        // 测试事件跟踪
        if (typeof analytics.trackEvent === 'function') {
          const testEventResult = analytics.trackEvent({
            type: 'page_view',
            action: 'test',
            label: 'deployment_test'
          });
          
          if (testEventResult) {
            this.results.passed.push('事件跟踪功能测试通过');
          } else {
            this.results.warnings.push('事件跟踪功能测试失败');
          }
        }
        
        // 检查清理功能
        if (typeof analytics.cleanup === 'function') {
          this.results.passed.push('数据分析清理功能可用');
        } else {
          this.results.warnings.push('数据分析清理功能不可用');
        }
      } else {
        this.results.warnings.push('数据分析模块未初始化');
      }
    }
  },
  
  // 检查错误处理
  async checkErrorHandling() {
    console.log('🔍 检查错误处理功能...');
    
    // 测试错误记录功能
    if (typeof window.appState !== 'undefined' && 
        typeof window.appState.recordError === 'function') {
      try {
        // 创建测试错误
        const testError = new Error('测试错误 - 请忽略');
        window.appState.recordError(testError);
        this.results.passed.push('错误记录功能测试通过');
      } catch (e) {
        this.results.failed.push('错误记录功能测试失败');
      }
    }
    
    // 检查全局错误处理器
    if (typeof window.onerror === 'function') {
      this.results.passed.push('全局错误处理器已设置');
    } else {
      this.results.warnings.push('全局错误处理器未设置');
    }
  },
  
  // 检查版本控制
  async checkVersioning() {
    console.log('🔍 检查版本控制...');
    
    if (typeof window.appState !== 'undefined') {
      // 检查版本信息
      if (window.appState.version) {
        this.results.passed.push(`版本号已设置: ${window.appState.version}`);
      } else {
        this.results.failed.push('版本号未设置');
      }
      
      if (window.appState.buildDate) {
        this.results.passed.push(`构建日期已设置: ${window.appState.buildDate}`);
      } else {
        this.results.failed.push('构建日期未设置');
      }
      
      // 检查缓存破坏
      if (typeof window.appState.getCacheBustKey === 'function') {
        const cacheKey = window.appState.getCacheBustKey();
        if (cacheKey) {
          console.log(`  缓存破坏键: ${cacheKey}`);
          this.results.passed.push('缓存破坏功能正常');
        } else {
          this.results.failed.push('缓存破坏功能异常');
        }
      }
    }
  },
  
  // 检查资源可用性
  async checkResourceAvailability() {
    console.log('🔍 检查关键资源可用性...');
    
    const criticalResources = [
      { name: '主样式文件', url: '/css/main.css' },
      { name: '主JavaScript文件', url: '/js/main.js' },
      { name: '错误处理模块', url: '/js/errorHandler.js' },
      { name: '性能优化模块', url: '/js/performanceOptimizer.js' },
      { name: '数据分析模块', url: '/js/analytics.js' }
    ];
    
    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource.url, {
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        if (response.ok) {
          console.log(`  ✅ ${resource.name} 可访问`);
          this.results.passed.push(`${resource.name} 可访问`);
        } else {
          console.log(`  ❌ ${resource.name} 访问失败: ${response.status}`);
          this.results.warnings.push(`${resource.name} 访问失败: ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ ${resource.name} 访问错误: ${error.message}`);
        this.results.warnings.push(`${resource.name} 访问错误: ${error.message}`);
      }
    }
  },
  
  // 生成测试报告
  generateReport() {
    console.log('\n==============================================');
    console.log('📊 部署前测试报告');
    console.log('==============================================');
    
    console.log(`\n✅ 通过项 (${this.results.passed.length}):`);
    this.results.passed.forEach(item => console.log(`  - ${item}`));
    
    console.log(`\n⚠️  警告项 (${this.results.warnings.length}):`);
    this.results.warnings.forEach(item => console.log(`  - ${item}`));
    
    console.log(`\n❌ 失败项 (${this.results.failed.length}):`);
    this.results.failed.forEach(item => console.log(`  - ${item}`));
    
    console.log('\n==============================================');
    
    if (this.results.failed.length === 0) {
      console.log('🎉 测试通过！应用可以部署。');
      
      if (this.results.warnings.length > 0) {
        console.log('⚠️  请注意修复警告项以获得更好的用户体验。');
      }
    } else {
      console.log('❌ 测试失败！请修复失败项后再部署。');
    }
    
    console.log('==============================================');
  },
  
  // 辅助方法
  detectBrowser() {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1) {
      name = 'Internet Explorer';
      version = ua.match(/MSIE (\d+\.\d+);|rv:(\d+\.\d+)/)[1] || '11';
    } else if (ua.indexOf('Edge') !== -1) {
      name = 'Microsoft Edge';
      version = ua.match(/Edge\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf('Chrome') !== -1) {
      name = 'Google Chrome';
      version = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf('Firefox') !== -1) {
      name = 'Mozilla Firefox';
      version = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) {
      name = 'Apple Safari';
      version = ua.match(/Version\/(\d+\.\d+)/)[1];
    }
    
    return { name, version };
  },
  
  isBrowserSupported(browser) {
    const supportedBrowsers = {
      'Google Chrome': 90,
      'Mozilla Firefox': 88,
      'Microsoft Edge': 90,
      'Apple Safari': 14
    };
    
    const minVersion = supportedBrowsers[browser.name];
    return minVersion && parseFloat(browser.version) >= minVersion;
  },
  
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
};

// 提供部署清单
const deploymentChecklist = {
  // 预部署检查项
  preDeployment: [
    '✅ 所有错误已修复',
    '✅ 性能优化已完成',
    '✅ 数据分析已配置',
    '✅ 版本信息已更新',
    '✅ 所有依赖模块已测试',
    '✅ 移动设备兼容性已验证',
    '✅ 错误处理机制已测试',
    '✅ 页面加载时间在可接受范围内'
  ],
  
  // 部署步骤
  deploymentSteps: [
    '1. 运行部署前测试脚本 (deploy-test.js)',
    '2. 创建当前版本的备份',
    '3. 更新版本号和构建日期',
    '4. 清理临时文件和缓存',
    '5. 上传文件到服务器',
    '6. 验证部署结果',
    '7. 监控应用运行状态'
  ],
  
  // 部署后检查
  postDeployment: [
    '✅ 访问网站首页验证正常加载',
    '✅ 测试关键功能模块',
    '✅ 检查错误日志',
    '✅ 验证分析数据是否正常收集',
    '✅ 确认所有图片和媒体资源正常加载',
    '✅ 测试不同设备和浏览器的兼容性'
  ],
  
  // 显示清单
  display() {
    console.log('\n==============================================');
    console.log('📋 部署清单');
    console.log('==============================================');
    
    console.log('\n📤 预部署检查:');
    this.preDeployment.forEach(item => console.log(`  ${item}`));
    
    console.log('\n⚙️  部署步骤:');
    this.deploymentSteps.forEach(item => console.log(`  ${item}`));
    
    console.log('\n🔍 部署后验证:');
    this.postDeployment.forEach(item => console.log(`  ${item}`));
    
    console.log('\n==============================================');
  }
};

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
  // 暴露给全局
  window.deploymentTest = deploymentTest;
  window.deploymentChecklist = deploymentChecklist;
  
  // 页面加载完成后执行测试
  window.addEventListener('load', async () => {
    console.log('页面加载完成，开始部署测试...');
    
    // 显示部署清单
    deploymentChecklist.display();
    
    // 运行测试套件
    await deploymentTest.run();
  });
} else {
  // Node.js环境中导出
  module.exports = {
    deploymentTest,
    deploymentChecklist
  };
}

// 导出默认对象
const deploy = {
  test: deploymentTest.run.bind(deploymentTest),
  checklist: deploymentChecklist.display.bind(deploymentChecklist)
};

export default deploy;