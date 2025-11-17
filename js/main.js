// 密码验证功能
function initPasswordProtection() {
  const correctPassword = 'love520'; // 可以修改为您想要的密码
  const passwordOverlay = document.getElementById('password-overlay');
  const mainContent = document.getElementById('main-content');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  
  // 检查是否已经验证过密码
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
  
  if (isAuthenticated) {
    showMainContent();
    return;
  }
  
  // 密码表单提交
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === correctPassword) {
      // 密码正确
      sessionStorage.setItem('authenticated', 'true');
      passwordError.classList.add('hidden');
      showMainContent();
    } else {
      // 密码错误
      passwordError.classList.remove('hidden');
      passwordInput.value = '';
      passwordInput.focus();
      
      // 添加震动效果
      passwordForm.classList.add('animate-shake');
      setTimeout(() => {
        passwordForm.classList.remove('animate-shake');
      }, 500);
    }
  });
  
  // 显示主内容
  function showMainContent() {
    passwordOverlay.style.opacity = '0';
    passwordOverlay.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      passwordOverlay.classList.add('hidden');
      mainContent.classList.remove('hidden');
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.5s ease-in';
      
      setTimeout(() => {
        mainContent.style.opacity = '1';
        // 初始化主网站功能
        initMainWebsite();
      }, 100);
    }, 500);
  }
}

// 主网站初始化函数
function initMainWebsite() {
  // 初始化图片懒加载
  lazyLoadImages();
  
  // 加载照片墙
  loadPhotoGallery();
  
  // 初始化粒子背景
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ff8096" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#994dff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 1 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
  
  // 添加滚动监听，防止图片闪烁
  setupScrollListener();
}

// 设置滚动监听，防止图片闪烁
function setupScrollListener() {
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    // 防抖处理
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // 确保所有已加载的图片保持显示
      const loadedImages = document.querySelectorAll('#photo-gallery img[data-loaded="true"]');
      loadedImages.forEach(img => {
        if (img.style.display === 'none' || img.style.opacity === '0') {
          console.log('🔧 修复滚动导致的图片隐藏:', img.alt);
          img.style.display = 'block';
          img.style.opacity = '1';
          img.style.visibility = 'visible';
        }
      });
      
      // 移除任何残留的占位符
      const placeholders = document.querySelectorAll('#photo-gallery .loading-placeholder');
      placeholders.forEach(placeholder => {
        const img = placeholder.nextElementSibling;
        if (img && img.dataset.loaded === 'true') {
          placeholder.remove();
        }
      });
    }, 100); // 100ms防抖
  }, { passive: true });
}

// 加载照片墙功能
function loadPhotoGallery() {
  const photoGallery = document.getElementById('photo-gallery');
  if (!photoGallery) return;

  // 清空现有内容
  photoGallery.innerHTML = '';
  
  // 重置进度显示（防止刷新页面时状态残留）
  const existingProgress = document.getElementById('loading-progress');
  if (existingProgress) {
    existingProgress.remove();
  }
  console.log('🔄 已清理旧的进度显示');

  // 照片文件列表
  const photoFiles = [
    'DSC09096.jpg', 'DSC09099.jpg', 'DSC09122.jpg', 'DSC09125.jpg',
    'DSC09147.jpg', 'DSC09150.jpg', 'DSC09155.jpg', 'DSC09175.jpg',
    'DSC09200.jpg', 'DSC09218.jpg', 'DSC09224.jpg', 'DSC09230.jpg',
    'DSC09241.jpg', 'DSC09259.jpg', 'DSC09261.jpg', 'DSC09262.jpg',
    'DSC09268.jpg', 'DSC09271.jpg', 'DSC09317.jpg', 'DSC09330.jpg',
    'DSC09345.jpg', 'DSC09361.jpg', 'DSC09371.jpg', 'DSC09387.jpg',
    'YJ616911.jpg', 'YJ616939.jpg', 'YJ616940.jpg', 'YJ616942.jpg',
    'YJ616955.jpg', 'YJ617036.jpg', 'YJ617040.jpg', 'YJ617043.jpg',
    'YJ617044.jpg', 'YJ617049.jpg', 'YJ617073.jpg', 'YJ617078.jpg',
    'YJ617111.jpg', 'YJ617285.jpg', 'YJ617294.jpg', 'YJ617303.jpg'
  ];

  // 获取当前路径的基础URL，确保在GitHub Pages上正常工作
  const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    const pathname = window.location.pathname;
    
    console.log('=== 环境检测 ===');
    console.log('协议:', protocol);
    console.log('主机名:', hostname);
    console.log('端口:', port);
    console.log('路径:', pathname);
    
    if (hostname.includes('github.io')) {
      // GitHub Pages环境
      const pathParts = pathname.split('/');
      pathParts.pop(); // 移除文件名
      const baseUrl = window.location.origin + pathParts.join('/') + '/';
      console.log('GitHub Pages环境，基础URL:', baseUrl);
      return baseUrl;
    } else if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.') || hostname === '') {
      // 本地环境 - 使用绝对路径确保正确
      const baseUrl = window.location.origin + pathname.replace(/\/[^\/]*$/, '/') + 'images/';
      console.log('本地环境，基础URL:', baseUrl);
      return baseUrl;
    } else {
      // 生产环境（自定义域名）
      console.log('生产环境，使用根路径');
      return './';
    }
  };

  const baseUrl = getBaseUrl();

  console.log('=== 照片墙调试信息 ===');
  console.log('当前域名:', window.location.hostname);
  console.log('当前路径:', window.location.pathname);
  console.log('基础URL:', baseUrl);
  console.log('开始加载照片，共', photoFiles.length, '张');
  console.log('📋 photoFiles数组长度:', photoFiles.length);
  console.log('📋 photoFiles数组内容:', photoFiles);
  console.log('📋 实际图片文件数量验证:', photoFiles.filter(name => name.endsWith('.jpg')).length);
  
  // 测试第一张图片的完整路径
  const firstImageUrl = baseUrl.includes('images/') ? baseUrl + photoFiles[0] : baseUrl + `images/${photoFiles[0]}`;
  console.log('第一张图片URL:', firstImageUrl);
  
  // 专门测试第5张图片
  const fifthImageName = photoFiles[4]; // 第5张图片（索引4）
  const fifthImageUrl = baseUrl.includes('images/') ? baseUrl + fifthImageName : baseUrl + `images/${fifthImageName}`;
  console.log('=== 第5张图片专门测试 ===');
  console.log('第5张图片文件名:', fifthImageName);
  console.log('第5张图片URL:', fifthImageUrl);
  
  const testFifthImage = new Image();
  testFifthImage.onload = function() {
    console.log('✅ 第5张图片测试加载成功！');
  };
  testFifthImage.onerror = function() {
    console.error('❌ 第5张图片测试加载失败！');
  };
  testFifthImage.src = fifthImageUrl;
  
  // 直接测试几个可能的路径
  const possiblePaths = [
    `./images/${photoFiles[0]}`,
    `images/${photoFiles[0]}`,
    `${window.location.origin}${window.location.pathname.replace(/\/[^\/]*$/, '/')}images/${photoFiles[0]}`,
    firstImageUrl
  ];
  
  console.log('=== 测试可能的图片路径 ===');
  possiblePaths.forEach((path, index) => {
    const testImg = new Image();
    testImg.onload = function() {
      console.log(`✅ 路径 ${index + 1} 成功:`, path);
    };
    testImg.onerror = function() {
      console.error(`❌ 路径 ${index + 1} 失败:`, path);
    };
    testImg.src = path;
  });
  
  // 智能分批加载：优先加载前12张，其余延迟加载
  const loadPhoto = (fileName, index) => {
    try {
      console.log(`🔄 开始处理图片 ${index + 1}: ${fileName}`);
      
      const photoDiv = document.createElement('div');
    
    // 检查图片是否已经加载过
    const isAlreadyLoaded = imageCache.isLoaded(fileName);
    console.log(`📋 图片 ${index + 1} 缓存状态: ${isAlreadyLoaded ? '已缓存' : '未缓存'}`);
    
    // 生成WebP格式URL（如果支持）
    const getOptimizedImageUrl = (originalUrl) => {
      const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpUrl; // 假设同时有WebP版本
    };
    
    if (isAlreadyLoaded) {
      // 已加载过的图片，直接显示，不显示占位符
      photoDiv.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
      const img = document.createElement('img');
      const fullUrl = baseUrl.includes('images/') ? baseUrl + fileName : baseUrl + `images/${fileName}`;
      
      // 使用现代图片属性 - 优化加载速度，防止闪烁
      img.src = fullUrl;
      img.alt = `婚纱照 ${index + 1}`;
      img.className = 'w-full h-64 object-cover transition-all duration-500 group-hover:scale-110';
      img.loading = 'eager'; // 立即加载
      img.decoding = 'sync'; // 同步解码
      img.fetchPriority = 'high'; // 高优先级
      img.style.display = 'block';
      img.style.opacity = '1'; // 确保不透明
      img.style.visibility = 'visible'; // 确保可见
      img.style.willChange = 'transform'; // 优化渲染性能
      
      // 添加现代图片优化属性
      img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
      img.style.imageRendering = 'auto';
      
      photoDiv.appendChild(img);
      console.log(`⚡ 图片已缓存，直接显示: ${fileName}`);
      updateProgress(); // 即使是缓存图片也要更新进度
    } else {
      // 未加载的图片，显示占位符
    photoDiv.className = 'photo-container relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
    
    // 添加优化的加载占位符，显示图片预览信息
    const placeholder = document.createElement('div');
    placeholder.className = 'absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center';
    placeholder.innerHTML = `
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-love-500 mb-2"></div>
        <div class="text-xs text-gray-600">婚纱照 ${index + 1}</div>
        <div class="text-xs text-gray-400">加载中...</div>
      </div>
    `;
    photoDiv.appendChild(placeholder);
    
    const img = document.createElement('img');
    const fullUrl = baseUrl.includes('images/') ? baseUrl + fileName : baseUrl + `images/${fileName}`;
    img.src = fullUrl;
    img.alt = `婚纱照 ${index + 1}`;
    img.className = 'w-full h-64 object-cover transition-all duration-500 group-hover:scale-110';
    // 设置立即加载策略，移除懒加载
    img.loading = 'eager'; // 改为立即加载
    img.decoding = 'sync'; // 同步解码
    img.fetchPriority = 'high'; // 所有图片都高优先级
    img.style.display = 'none';
      
      if (index === 4) {
        console.log(`🚨 特别关注第5张图片创建: ${fileName}`);
        console.log(`🚨 第5张图片URL: ${fullUrl}`);
        console.log(`🚨 第5张图片优先级: ${img.fetchPriority}`);
      }
      console.log(`创建图片 ${index + 1}: ${fullUrl}`);
      
      // 成功加载时的处理
        img.addEventListener('load', function() {
          // 标记为已加载
          imageCache.markAsLoaded(fileName);
          
          if (index === 4) {
            console.log(`🎉 第5张图片加载成功！`);
          }
          console.log(`✅ 图片加载成功: ${fileName}`);
          
          // 彻底移除占位符，防止滚动时重新出现
          if (placeholder && placeholder.parentNode) {
            placeholder.remove();
          }
          
          // 确保图片稳定显示
          this.style.display = 'block';
          this.style.opacity = '1';
          this.style.visibility = 'visible';
          
          // 添加标记防止重新加载
          this.dataset.loaded = 'true';
          
          updateProgress(); // 直接更新进度
        });
      
      // 错误重试机制
      let retryCount = 0;
      const maxRetries = 3;
      
      const handleLoadError = () => {
        retryCount++;
        imageCache.recordLoadError();
        
        if (retryCount <= maxRetries) {
          console.warn(`🔄 图片加载失败，第${retryCount}次重试: ${fileName}`);
          setTimeout(() => {
            img.src = fullUrl + '?retry=' + retryCount; // 添加时间戳避免缓存
          }, 1000 * retryCount); // 递增延迟
        } else {
          console.error(`❌ 图片加载失败，已达最大重试次数: ${fileName}`);
          placeholder.innerHTML = `
            <div class="text-center text-red-600">
              <div class="text-lg mb-2">😔</div>
              <div class="text-sm">加载失败</div>
              <div class="text-xs mt-1">${fileName}</div>
              <button onclick="this.parentElement.parentElement.parentElement.remove()" class="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded">移除</button>
            </div>
          `;
          updateProgress(); // 即使失败也要更新进度
        }
      };
      
      // 加载失败时的处理
      img.addEventListener('error', handleLoadError);
      
      photoDiv.appendChild(img);
      
      // 强制触发图片加载，不等待浏览器懒加载
      if (img.src && !img.complete) {
        // 创建一个临时的Image对象来强制加载
        const forceLoader = new Image();
        forceLoader.onload = () => {
          console.log(`🚀 强制加载完成: ${fileName}`);
          img.src = img.src; // 触发显示
        };
        forceLoader.onerror = () => {
          console.warn(`⚠️ 强制加载失败: ${fileName}`);
        };
        forceLoader.src = img.src;
      }
    }
    
    // 添加点击放大功能
    photoDiv.addEventListener('click', function() {
      const fullUrl = baseUrl.includes('images/') ? baseUrl + fileName : baseUrl + `images/${fileName}`;
      openImageModal(fullUrl, fileName, index + 1);
    });
    
    photoGallery.appendChild(photoDiv);
    } catch (error) {
      console.error(`❌ 图片处理出错 ${index + 1}: ${fileName}`, error);
      // 即使出错也要更新进度，避免卡住
      updateProgress();
      
      // 创建错误占位符
      const errorDiv = document.createElement('div');
      errorDiv.className = 'relative group overflow-hidden rounded-lg shadow-md';
      errorDiv.innerHTML = `
        <div class="w-full h-64 bg-red-100 flex items-center justify-center">
          <div class="text-center text-red-600">
            <div class="text-lg mb-2">⚠️</div>
            <div class="text-sm">加载出错</div>
            <div class="text-xs mt-1">${fileName}</div>
          </div>
        </div>
      `;
      photoGallery.appendChild(errorDiv);
    }
  };
  
  // 添加性能监控面板
  const createPerformancePanel = () => {
    const panel = document.createElement('div');
    panel.id = 'performance-panel';
    panel.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 text-xs';
    panel.innerHTML = `
      <div class="font-bold text-gray-700 mb-2">🚀 性能监控</div>
      <div class="space-y-1">
        <div>📊 加载进度: <span id="perf-progress">0/${photoFiles.length}</span></div>
        <div>⚡ 缓存命中: <span id="perf-cache-hits">0</span></div>
        <div>❌ 加载失败: <span id="perf-errors">0</span></div>
        <div>⏱️ 加载时间: <span id="perf-time">0s</span></div>
        <div>💾 缓存率: <span id="perf-cache-rate">0%</span></div>
      </div>
      <button onclick="this.parentElement.style.display='none'" class="mt-2 text-xs bg-gray-500 text-white px-2 py-1 rounded">隐藏</button>
    `;
    return panel;
  };
  
  const performancePanel = createPerformancePanel();
  document.body.appendChild(performancePanel);
  
  // 更新性能面板
  const updatePerformancePanel = () => {
    const stats = imageCache.getStats();
    const perfProgress = document.getElementById('perf-progress');
    const perfCacheHits = document.getElementById('perf-cache-hits');
    const perfErrors = document.getElementById('perf-errors');
    const perfTime = document.getElementById('perf-time');
    const perfCacheRate = document.getElementById('perf-cache-rate');
    
    if (perfProgress) perfProgress.textContent = `${loadedCount}/${photoFiles.length}`;
    if (perfCacheHits) perfCacheHits.textContent = stats.cacheHits;
    if (perfErrors) perfErrors.textContent = stats.loadErrors;
    if (perfTime) perfTime.textContent = `${stats.loadTime}s`;
    if (perfCacheRate) perfCacheRate.textContent = `${stats.cacheHitRate}%`;
  };
  
  // 添加加载进度显示
  const progressDiv = document.createElement('div');
  progressDiv.id = 'loading-progress';
  progressDiv.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50';
  progressDiv.innerHTML = `
    <div class="text-sm font-medium text-gray-700 mb-2">照片加载进度</div>
    <div class="w-48 bg-gray-200 rounded-full h-2">
      <div id="progress-bar" class="bg-gradient-love h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
    </div>
    <div id="progress-text" class="text-xs text-gray-500 mt-1">0/${photoFiles.length}</div>
  `;
  document.body.appendChild(progressDiv);
  
  // 更新加载进度
  let loadedCount = 0;
  console.log('📊 开始加载进度统计');
  
  const updateProgress = () => {
    loadedCount++;
    const percentage = (loadedCount / photoFiles.length) * 100;
    
    if (document.getElementById('progress-bar')) {
      document.getElementById('progress-bar').style.width = percentage + '%';
      document.getElementById('progress-text').textContent = `${loadedCount}/${photoFiles.length}`;
    }
    
    console.log(`📈 进度更新: ${loadedCount}/${photoFiles.length} (${percentage.toFixed(1)}%)`);
    console.log(`📊 当前缓存状态: ${imageCache.getLoadedCount()} 张图片已缓存`);
    console.log(`🔢 数学验证: ${loadedCount} ÷ ${photoFiles.length} × 100 = ${percentage.toFixed(1)}%`);
    
    // 检查是否有异常
    if (loadedCount > photoFiles.length) {
      console.error(`❌ 异常：loadedCount(${loadedCount}) > photoFiles.length(${photoFiles.length})`);
    }
    if (percentage > 100) {
      console.error(`❌ 异常：percentage(${percentage}%) > 100%`);
    }
    
    // 更新性能面板
    updatePerformancePanel();
    
    if (loadedCount === photoFiles.length) {
      console.log('🎉 所有图片加载完成！');
      console.log(`📊 最终缓存状态: ${imageCache.getLoadedCount()} 张图片已缓存`);
      
      const finalStats = imageCache.getStats();
      console.log(`📈 性能统计:`, finalStats);
      
      setTimeout(() => {
        if (progressDiv && progressDiv.parentNode) {
          progressDiv.style.opacity = '0';
          setTimeout(() => {
            if (progressDiv.parentNode) {
              progressDiv.parentNode.removeChild(progressDiv);
            }
          }, 300);
        }
      }, 1000);
    }
  };
  
  // Intersection Observer 优化懒加载
  const setupIntersectionObserver = () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src && !img.src) {
            img.src = src;
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            imageObserver.unobserve(img);
            console.log(`👁️ 图片进入视口开始加载: ${img.alt}`);
          }
        }
      });
    }, {
      rootMargin: '50px', // 提前50px开始加载
      threshold: 0.1
    });
    
    return imageObserver;
  };
  
  // 注册Service Worker
  registerServiceWorker();
  
  // 修复加载策略：更激进的并发加载，解决卡住问题
  console.log(`🚀 修复加载策略：开始加载${photoFiles.length}张图片`);
  
  const batchSize = 12; // 增加到每批并发加载12张
  const batchDelay = 50; // 减少到批次间延迟50ms
  
  // 立即开始加载第一批，不要等待
  console.log(`📦 立即加载第1批图片 (1-${Math.min(batchSize, photoFiles.length)})`);
  for (let i = 0; i < Math.min(batchSize, photoFiles.length); i++) {
    loadPhoto(photoFiles[i], i);
  }
  
  // 继续加载剩余批次
  for (let batch = 1; batch < Math.ceil(photoFiles.length / batchSize); batch++) {
    setTimeout(() => {
      const startIndex = batch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, photoFiles.length);
      
      console.log(`📦 加载第${batch + 1}批图片 (${startIndex + 1}-${endIndex})`);
      
      for (let i = startIndex; i < endIndex; i++) {
        loadPhoto(photoFiles[i], i);
      }
    }, batch * batchDelay);
  }
  
  // 添加强制加载检查，确保不会卡住
  let forceCheckCount = 0;
  const forceLoadInterval = setInterval(() => {
    forceCheckCount++;
    const currentImages = document.querySelectorAll('#photo-gallery img').length;
    const loadedImages = document.querySelectorAll('#photo-gallery img[data-loaded="true"]').length;
    
    console.log(`🔍 强制检查 ${forceCheckCount}: 已创建 ${currentImages}/${photoFiles.length}, 已加载 ${loadedImages}`);
    
    // 如果5次检查后进度还是很慢，强制触发所有图片
    if (forceCheckCount >= 5 && loadedImages < photoFiles.length * 0.3) {
      console.warn(`⚠️ 强制触发所有图片加载，当前进度太慢`);
      clearInterval(forceLoadInterval);
      
      // 强制加载所有未加载的图片
      document.querySelectorAll('#photo-gallery img:not([data-loaded="true"])').forEach((img, index) => {
        if (img.src && !img.complete) {
          const originalSrc = img.src;
          img.src = '';
          setTimeout(() => {
            img.src = originalSrc + '?force=' + Date.now();
          }, index * 100); // 错开加载时间
        }
      });
    }
    
    // 如果所有图片都已创建，停止检查
    if (currentImages >= photoFiles.length) {
      clearInterval(forceLoadInterval);
      console.log(`✅ 所有图片元素已创建完成`);
    }
  }, 3000); // 每3秒检查一次
  
  console.log('所有照片元素已创建完成');
  
  // 全局强制加载：确保所有图片立即开始加载
  setTimeout(() => {
    console.log('🚀 开始全局强制加载检查...');
    const allImages = document.querySelectorAll('#photo-gallery img');
    
    allImages.forEach((img, index) => {
      if (img.src && !img.complete && !img.dataset.forceTriggered) {
        console.log(`🔥 强制触发图片 ${index + 1}: ${img.alt}`);
        img.dataset.forceTriggered = 'true';
        
        // 强制重新设置src来触发加载
        const originalSrc = img.src;
        img.src = '';
        setTimeout(() => {
          img.src = originalSrc;
        }, index * 50); // 错开50ms避免同时请求
      }
    });
    
    console.log(`✅ 全局强制加载完成，共处理 ${allImages.length} 张图片`);
  }, 2000); // 2秒后开始强制加载
  
  // 紧急恢复机制：确保所有图片都能被创建
  setTimeout(() => {
    const currentCount = document.querySelectorAll('#photo-gallery > div').length;
    console.log(`🔍 紧急检查：当前创建了 ${currentCount}/${photoFiles.length} 个图片容器`);
    
    if (currentCount < photoFiles.length) {
      console.warn(`⚠️ 紧急恢复：缺少 ${photoFiles.length - currentCount} 个图片容器，强制创建`);
      
      for (let i = currentCount; i < photoFiles.length; i++) {
        try {
          console.log(`🚨 紧急创建图片 ${i + 1}: ${photoFiles[i]}`);
          loadPhoto(photoFiles[i], i);
        } catch (error) {
          console.error(`❌ 紧急创建失败 ${i + 1}: ${photoFiles[i]}`, error);
        }
      }
    }
  }, 5000); // 5秒后检查
}

// 全局图片缓存管理
const imageCache = {
  loadedImages: new Set(),
  
  markAsLoaded(fileName) {
    this.loadedImages.add(fileName);
    this.stats.totalLoaded++;
    console.log(`📝 图片已缓存: ${fileName}`);
  },
  
  isLoaded(fileName) {
    return this.loadedImages.has(fileName);
  },
  
  getLoadedCount() {
    return this.loadedImages.size;
  },
  
  // 添加性能统计
  stats: {
    totalLoaded: 0,
    cacheHits: 0,
    loadErrors: 0,
    startTime: Date.now()
  },
  
  recordCacheHit() {
    this.stats.cacheHits++;
  },
  
  recordLoadError() {
    this.stats.loadErrors++;
  },
  
  getStats() {
    const duration = Date.now() - this.stats.startTime;
    return {
      ...this.stats,
      loadTime: Math.round(duration / 1000),
      cacheHitRate: Math.round((this.stats.cacheHits / this.stats.totalLoaded) * 100)
    };
  }
};

// Service Worker 注册
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker 注册成功:', registration);
    } catch (error) {
      console.log('❌ Service Worker 注册失败:', error);
    }
  }
};

// 图片懒加载功能
function lazyLoadImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// 设置滚动监听，防止图片闪烁
function setupScrollListener() {
  // 创建Intersection Observer来监控图片
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const img = entry.target;
      if (entry.isIntersecting && img.dataset.loaded === 'true') {
        // 确保进入视口的已加载图片保持显示
        img.style.display = 'block';
        img.style.opacity = '1';
        img.style.visibility = 'visible';
      }
    });
  }, {
    rootMargin: '50px' // 提前50px开始处理
  });
  
  // 监控所有已加载的图片
  const observeLoadedImages = () => {
    const loadedImages = document.querySelectorAll('#photo-gallery img[data-loaded="true"]:not([data-observed])');
    loadedImages.forEach(img => {
      imageObserver.observe(img);
      img.dataset.observed = 'true';
    });
  };
  
  // 初始观察
  setTimeout(observeLoadedImages, 1000);
  
  // 滚动防抖处理
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // 确保所有已加载的图片保持显示
      const loadedImages = document.querySelectorAll('#photo-gallery img[data-loaded="true"]');
      loadedImages.forEach(img => {
        if (img.style.display === 'none' || img.style.opacity === '0') {
          console.log('🔧 修复滚动导致的图片隐藏:', img.alt);
          img.style.display = 'block';
          img.style.opacity = '1';
          img.style.visibility = 'visible';
        }
      });
      
      // 移除任何残留的占位符
      const placeholders = document.querySelectorAll('#photo-gallery .loading-placeholder');
      placeholders.forEach(placeholder => {
        const img = placeholder.nextElementSibling;
        if (img && img.dataset.loaded === 'true') {
          placeholder.remove();
        }
      });
      
      // 重新观察新加载的图片
      observeLoadedImages();
    }, 100); // 100ms防抖
  }, { passive: true });
}

// Tailwind配置
tailwind.config = {
  theme: {
    extend: {
      colors: {
        love: {
          100: '#ffe6ea',
          200: '#ffccd5',
          300: '#ffb3c0',
          400: '#ff99ab',
          500: '#ff8096',
          600: '#ff6681',
          700: '#ff4d6d',
          800: '#ff3358',
          900: '#ff1a43',
        },
        romance: {
          100: '#f0e6ff',
          200: '#e1ccff',
          300: '#d3b3ff',
          400: '#c499ff',
          500: '#b680ff',
          600: '#a766ff',
          700: '#994dff',
          800: '#8a33ff',
          900: '#7c1aff',
        }
      },
      fontFamily: {
        romantic: ['Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 重置全局缓存（防止刷新页面时状态残留）
  imageCache.loadedImages.clear();
  console.log('🔄 全局缓存已清空，开始新的会话');
  
  // 初始化密码保护
  initPasswordProtection();
});


// 图片放大模态框功能
function openImageModal(imageSrc, fileName, imageNumber) {
  // 创建模态框
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.3s ease';
  
  // 检查图片是否已缓存
  const isCached = imageCache.isLoaded(fileName);
  const loadingIndicator = isCached ? '' : '<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"><div class="text-white text-xl animate-pulse">加载中...</div></div>';
  
  modal.innerHTML = `
    <div class="relative max-w-4xl max-h-full">
      ${loadingIndicator}
      <img src="${imageSrc}" alt="婚纱照 ${imageNumber}" class="max-w-full max-h-full object-contain rounded-lg" style="${isCached ? '' : 'opacity: 0; transition: opacity 0.3s;'}">
      <div class="absolute top-4 right-4 flex gap-2">
        <button class="bg-white text-black px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition">❌ 关闭</button>
      </div>
      <div class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        婚纱照 ${imageNumber} - ${fileName} ${isCached ? '⚡' : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 淡入效果
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
  
  const img = modal.querySelector('img');
  
  // 如果图片未缓存，监听加载完成
  if (!isCached) {
    img.addEventListener('load', function() {
      // 隐藏加载指示器，显示图片
      const loadingDiv = modal.querySelector('.absolute.inset-0');
      if (loadingDiv) {
        loadingDiv.remove();
      }
      this.style.opacity = '1';
      imageCache.markAsLoaded(fileName);
    });
    
    img.addEventListener('error', function() {
      const loadingDiv = modal.querySelector('.absolute.inset-0');
      if (loadingDiv) {
        loadingDiv.innerHTML = '<div class="text-white text-xl">😔 加载失败</div>';
      }
    });
  }
  
  // 关闭功能
  const closeModal = () => {
    modal.style.opacity = '0';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.textContent.includes('关闭')) {
      closeModal();
    }
  });
  
  // ESC键关闭
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}