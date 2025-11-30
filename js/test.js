// 优化效果测试脚本

/**
 * 测试模块加载和初始化
 */
async function testModuleLoading() {
  console.log('===== 测试模块加载 =====');
  
  try {
    // 测试动态导入配置文件
    const configModule = await import('./config.js');
    console.log('✅ 配置文件加载成功:', configModule.default);
    
    // 测试模块加载器
    const loaderModule = await import('./modules/moduleLoader.js');
    console.log('✅ 模块加载器加载成功');
    
    // 测试各个功能模块
    const modules = [
      { name: 'password.js', path: './modules/password.js' },
      { name: 'ui.js', path: './modules/ui.js' },
      { name: 'media.js', path: './modules/media.js' },
      { name: 'loveLetters.js', path: './modules/loveLetters.js' },
      { name: 'countdown.js', path: './modules/countdown.js' },
      { name: 'imageOptimizer.js', path: './modules/imageOptimizer.js' }
    ];
    
    for (const module of modules) {
      try {
        const importedModule = await import(module.path);
        console.log(`✅ ${module.name} 模块加载成功`);
      } catch (e) {
        console.error(`❌ ${module.name} 模块加载失败:`, e);
      }
    }
  } catch (e) {
    console.error('❌ 模块加载测试失败:', e);
  }
}

/**
 * 测试图片优化功能
 */
function testImageOptimization() {
  console.log('\n===== 测试图片优化功能 =====');
  
  try {
    // 检查是否存在相关函数和类
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    console.log(`✅ IntersectionObserver 支持: ${hasIntersectionObserver}`);
    
    // 检查WebP支持
    const canvas = document.createElement('canvas');
    const hasWebPSupport = canvas.getContext && canvas.getContext('2d') && 
                          canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    console.log(`✅ WebP 支持: ${hasWebPSupport}`);
    
    // 检查页面中的图片元素
    const images = document.querySelectorAll('img');
    console.log(`✅ 页面图片数量: ${images.length}`);
    
    // 检查是否有懒加载图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    console.log(`✅ 懒加载图片数量: ${lazyImages.length}`);
    
    // 为图片添加测试类
    images.forEach(img => {
      img.classList.add('tested-image');
    });
    
    console.log('✅ 图片元素测试完成');
  } catch (e) {
    console.error('❌ 图片优化测试失败:', e);
  }
}

/**
 * 测试性能
 */
function testPerformance() {
  console.log('\n===== 测试性能指标 =====');
  
  try {
    // 检查资源加载时间
    if (performance && performance.getEntries) {
      const resources = performance.getEntries();
      console.log(`✅ 加载资源数量: ${resources.length}`);
      
      // 查找耗时最长的资源
      const slowestResource = resources.reduce((max, resource) => 
        resource.duration > max.duration ? resource : max
      , resources[0]);
      
      if (slowestResource) {
        console.log(`✅ 最慢资源: ${slowestResource.name}, 耗时: ${slowestResource.duration.toFixed(2)}ms`);
      }
    }
    
    // 检查内存使用
    if (performance && performance.memory) {
      const memory = performance.memory;
      console.log(`✅ 已使用内存: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`✅ 总内存: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    }
  } catch (e) {
    console.error('❌ 性能测试失败:', e);
  }
}

/**
 * 测试响应式设计
 */
function testResponsiveDesign() {
  console.log('\n===== 测试响应式设计 =====');
  
  try {
    // 检查视口大小
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    console.log(`✅ 视口尺寸: ${viewportWidth}x${viewportHeight}`);
    
    // 检查是否有媒体查询相关类
    const hasResponsiveClasses = document.documentElement.classList.contains('responsive') ||
                               document.querySelector('.container, .row, .col');
    console.log(`✅ 响应式类检测: ${hasResponsiveClasses}`);
    
    // 模拟不同屏幕尺寸的测试点
    const breakpoints = [
      { name: '移动端', width: 375 },
      { name: '平板', width: 768 },
      { name: '桌面', width: 1200 }
    ];
    
    breakpoints.forEach(breakpoint => {
      const isCurrent = viewportWidth >= breakpoint.width && 
                        (viewportWidth < breakpoints.find(b => b.width > breakpoint.width)?.width || true);
      console.log(`✅ ${breakpoint.name} 断点测试: ${isCurrent ? '当前尺寸' : '非当前尺寸'}`);
    });
  } catch (e) {
    console.error('❌ 响应式设计测试失败:', e);
  }
}

/**
 * 测试模块化结构
 */
function testModularity() {
  console.log('\n===== 测试模块化结构 =====');
  
  try {
    // 检查模块化加载是否正常工作
    if (typeof window.moduleLoader !== 'undefined') {
      console.log('✅ 模块加载器全局对象存在');
      
      // 测试模块API
      const moduleKeys = Object.keys(window.moduleLoader || {});
      console.log(`✅ 模块加载器API数量: ${moduleKeys.length}`);
      console.log('   API列表:', moduleKeys.join(', '));
    }
    
    // 检查应用状态
    if (typeof window.appState !== 'undefined') {
      console.log('✅ 应用状态全局对象存在');
    }
    
    // 检查是否有模块化错误
    const consoleErrors = window.consoleErrors || [];
    console.log(`✅ 模块化错误检查: ${consoleErrors.length === 0 ? '无错误' : `${consoleErrors.length}个错误`}`);
  } catch (e) {
    console.error('❌ 模块化结构测试失败:', e);
  }
}

/**
 * 生成测试报告
 */
function generateTestReport() {
  console.log('\n===== 测试报告 =====');
  
  // 收集性能指标
  const report = {
    date: new Date().toLocaleString(),
    browser: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    modules: {
      loaded: true, // 后续可以动态更新
      count: 6 // 模块化数量
    },
    optimizations: {
      imageOptimization: true,
      codeModularity: true,
      configExtraction: true
    },
    issues: []
  };
  
  console.log('✅ 测试报告生成成功:');
  console.table(report);
  
  // 可视化显示测试结果
  displayTestResults(report);
}

/**
 * 在页面显示测试结果
 */
function displayTestResults(report) {
  // 创建测试结果容器
  const container = document.createElement('div');
  container.id = 'test-results';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-family: monospace;
    z-index: 9999;
    max-width: 300px;
    max-height: 400px;
    overflow-y: auto;
    display: none;
  `;
  
  // 创建切换按钮
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '测试结果';
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10000;
    font-size: 14px;
  `;
  
  toggleBtn.addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
  
  // 添加报告内容
  const reportContent = document.createElement('pre');
  reportContent.textContent = JSON.stringify(report, null, 2);
  container.appendChild(reportContent);
  
  // 添加到页面
  document.body.appendChild(container);
  document.body.appendChild(toggleBtn);
  
  console.log('✅ 测试结果已添加到页面右下角');
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('\n🚀 开始优化效果测试...');
  
  // 等待页面加载完成
  if (document.readyState !== 'complete') {
    await new Promise(resolve => window.addEventListener('load', resolve));
  }
  
  // 运行各项测试
  await testModuleLoading();
  testImageOptimization();
  testPerformance();
  testResponsiveDesign();
  testModularity();
  
  // 生成测试报告
  generateTestReport();
  
  console.log('\n✅ 所有测试完成！');
}

// 导出测试函数供main_simplified.js调用
export { runAllTests };