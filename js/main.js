// 生产环境配置
const isProduction = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
const debugLog = isProduction ? () => {} : console.log;

// 网站配置
const CONFIG = {
  // 网站基本信息
  site: {
    title: '张乐与石云青的爱情空间',
    subtitle: '我们的爱情故事，时光见证',
    coupleName: '张乐 & 石云青',
    // 每年的纪念日日期
    anniversaryDate: '11-16',
    // 第一个纪念日年份
    firstAnniversaryYear: 2024,
  },
  
  // 音乐配置
  music: {
    // 音乐功能开关
    enable: true,
    // 是否自动播放
    autoPlay: false,
    // 首页背景音乐
    mainTheme: {
      title: '流星雨',
      src: '/music/流星雨.ogg',
    },
    // 情书信箱背景音乐配置文件路径
    bgmConfigPath: 'txt/bgm.xml',
    // 音乐API基础URL（已使用本地音乐文件）
    musicApiBase: ''
  },
  
  // 照片配置
  photos: {
    // 首页合照配置
    homePhoto: {
      folder: 'images/1/',
      fileName: 'IMG_20241208_110014.jpg',
      alt: '我们的合照',
    },
    // 照片墙配置
    gallery: {
      folder: 'images/2/',
    },
  },
  
  // 情书信箱配置
  letters: {
    folder: 'txt/',
    // 情书信封背景图配置
    backgrounds: [
      'https://picsum.photos/id/1000/400/600',
      'https://picsum.photos/id/1001/400/600',
      'https://picsum.photos/id/1002/400/600',
      'https://picsum.photos/id/1003/400/600',
      'https://picsum.photos/id/1004/400/600',
    ],
  },
  
  // 粒子背景配置
  particles: {
    color: '#ff8096',
    lineColor: '#994dff',
    particleCount: 80,
    speed: 1,
  },
  
  // 性能优化配置
  performance: {
    batchLoad: {
      priorityCount: 12,
      batchSize: 4,
      batchDelay: 200,
    },
  },
};

// 应用状态管理
const appState = {
  isMusicPlaying: false,
  currentLetterMusic: null,
  loadedLetters: {},
  loadedPhotos: new Set(),
  // 初始化状态
  init() {
    console.log('初始化应用状态');
  },
  
  // 设置音乐播放状态
  setMusicPlaying(playing) {
    this.isMusicPlaying = playing;
    console.log(`音乐播放状态: ${playing ? '播放中' : '已暂停'}`);
  },
  
  // 记录已加载的图片
  markPhotoAsLoaded(fileName) {
    this.loadedPhotos.add(fileName);
  },
  
  // 检查图片是否已加载
  isPhotoLoaded(fileName) {
    return this.loadedPhotos.has(fileName);
  },
};

// 初始化应用状态
appState.init();

// 密码验证功能
function initPasswordProtection() {
  // 检查Tailwind是否正确加载
  debugLog('🎨 检查Tailwind CSS状态:');
  const testElement = document.createElement('div');
  testElement.className = 'hidden';
  document.body.appendChild(testElement);
  const tailwindWorking = testElement.style.display === 'none' || window.getComputedStyle(testElement).display === 'none';
  document.body.removeChild(testElement);
  
  if (!tailwindWorking) {
    console.warn('⚠️ Tailwind CSS未正确加载，使用备用样式');
    // 强制应用备用样式
    document.body.classList.add('tailwind-fallback');
  } else {
    debugLog('✅ Tailwind CSS工作正常');
  }
  
  const correctPassword = '5201314'; // 可以修改为您想要的密码
  
  // 添加导航功能
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('hidden');
      navToggle.classList.toggle('active');
    });
  }
  
  // 添加平滑滚动功能
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  const passwordOverlay = document.getElementById('password-overlay');
  const mainContent = document.getElementById('main-content');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  
  console.log('🔍 密码验证初始化检查:');
  console.log('密码覆盖层:', passwordOverlay);
  console.log('主内容:', mainContent);
  console.log('密码表单:', passwordForm);
  console.log('密码输入框:', passwordInput);
  console.log('错误提示:', passwordError);
  
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
    console.log('🔐 密码验证尝试:', enteredPassword);
    console.log('🔑 正确密码:', correctPassword);
    console.log('📝 密码匹配:', enteredPassword === correctPassword);
    
    if (enteredPassword === correctPassword) {
      // 密码正确
      console.log('✅ 密码正确，开始显示主内容');
      sessionStorage.setItem('authenticated', 'true');
      passwordError.classList.add('hidden');
      showMainContent();
    } else {
      // 密码错误
      console.log('❌ 密码错误');
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
    console.log('🚀 开始显示主内容');
    passwordOverlay.style.opacity = '0';
    passwordOverlay.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      console.log('📦 隐藏密码覆盖层，显示主内容');
      passwordOverlay.classList.add('hidden');
      mainContent.classList.remove('hidden');
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.5s ease-in';
      
      setTimeout(() => {
        console.log('✨ 主内容显示完成，初始化网站功能');
        mainContent.style.opacity = '1';
        // 初始化主网站功能
        initMainWebsite();
      }, 100);
    }, 500);
  }
}

// 初始化首页照片
function initHomePhoto() {
  const photoContainer = document.getElementById('home-photo-container');
  if (!photoContainer) {
    console.warn('首页照片容器不存在');
    return;
  }
  
  // 创建照片元素
  const img = document.createElement('img');
  const photoPath = `${CONFIG.photos.homePhoto.folder}${CONFIG.photos.homePhoto.fileName}`;
  img.src = photoPath;
  img.alt = CONFIG.photos.homePhoto.alt;
  img.className = 'w-full h-full object-cover';
  
  // 添加加载状态
  img.style.opacity = '0';
  img.style.transition = 'opacity 1s ease-in';
  
  // 加载完成后显示
  img.onload = function() {
    this.style.opacity = '1';
    console.log('✅ 首页照片加载成功');
  };
  
  // 处理加载错误
  img.onerror = function() {
    console.error('❌ 首页照片加载失败:', photoPath);
    // 显示占位符
    photoContainer.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
        <div class="text-center">
          <i class="fa fa-heart text-4xl text-rose-500 mb-2"></i>
          <div class="text-rose-600 font-medium">我们的合照</div>
        </div>
      </div>
    `;
  };
  
  // 添加到容器
  photoContainer.appendChild(img);
  console.log('🖼️  首页照片初始化完成');
}

// 初始化粒子背景
function initParticlesBackground() {
  if (typeof particlesJS !== 'undefined') {
    console.log('🚀 初始化粒子背景...');
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": CONFIG.particles.particleCount,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": CONFIG.particles.color
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true
        },
        "size": {
          "value": 3,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": CONFIG.particles.lineColor,
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": CONFIG.particles.speed,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
    console.log('✨ 粒子背景初始化完成');
  } else {
    console.warn('⚠️  particles.js 库未加载，粒子背景功能不可用');
  }
}

// 主网站初始化函数
function initMainWebsite() {
  console.log('🚀 开始初始化爱情空间网站...');
  
  // 初始化粒子背景
  initParticlesBackground();
  
  // 初始化首页照片
  initHomePhoto();
  
  // 初始化恋爱记录
  initLoveStory();
  
  // 初始化纪念日倒计时
  initAnniversaryCountdown();
  
  // 初始化照片墙
  initPhotoWall();
  
  // 初始化情书信箱
  initLoveLetters();
  
  // 初始化音乐播放器
  initMusicPlayer();
  
  // 初始化导航（包含页面切换功能）
  initNavigation();
  
  console.log('🎉 网站初始化完成！');
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

// 初始化恋爱记录
function initLoveStory() {
  const loveStorySection = document.getElementById('love-story');
  if (!loveStorySection) {
    // 如果没有恋爱记录区域，则创建它
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    const section = document.createElement('section');
    section.id = 'love-story';
    section.className = 'py-20 bg-gradient-to-b from-rose-50 to-purple-50';
    section.innerHTML = `
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4 text-rose-600">我们的故事</h2>
        <p class="text-xl text-center mb-12 text-gray-600">从这里开始……</p>
        <div id="love-story-timeline" class="relative">
          <!-- 时间轴将在这里动态生成 -->
        </div>
      </div>
    `;
    
    // 插入到合适的位置
    const homeSection = document.getElementById('home');
    if (homeSection) {
      mainContent.insertBefore(section, homeSection.nextSibling);
    } else {
      mainContent.appendChild(section);
    }
  }
  
  // 使用统一的恋爱记录数据
  // 渲染时间轴
  renderLoveStoryTimeline(loveStoryData);
  
  console.log('💖 恋爱记录初始化完成');
}

// 渲染恋爱记录时间轴
function renderLoveStoryTimeline(data) {
  const timelineContainer = document.getElementById('love-story-timeline');
  if (!timelineContainer) return;
  
  // 清空容器
  timelineContainer.innerHTML = '';
  
  // 添加时间轴线
  const timelineLine = document.createElement('div');
  timelineLine.className = 'absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-rose-300';
  timelineContainer.appendChild(timelineLine);
  
  // 遍历数据，创建时间轴项
  data.forEach((item, index) => {
    const isEven = index % 2 === 0;
    
    const timelineItem = document.createElement('div');
    timelineItem.className = `relative mb-12 flex ${isEven ? 'justify-end' : 'justify-start'}`;
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = `w-5/12 ${isEven ? 'mr-8' : 'ml-8'}`;
    
    // 时间轴节点
    const timelineDot = document.createElement('div');
    timelineDot.className = 'absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-rose-500 shadow-lg z-10';
    
    // 时间轴内容卡片
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl';
    
    // 卡片内容
    card.innerHTML = `
      <div class="p-6">
        <div class="text-sm font-semibold text-rose-500 mb-2">${item.date}</div>
        <h3 class="text-2xl font-bold mb-3 text-gray-800">${item.title}</h3>
        <p class="text-gray-600 mb-4">${item.content}</p>
        ${item.photo ? `
          <div class="mt-4 overflow-hidden rounded-lg">
            <img src="${item.photo}" alt="${item.title}" class="w-full h-48 object-cover hover:scale-110 transition-transform duration-700">
          </div>
        ` : ''}
      </div>
    `;
    
    contentWrapper.appendChild(card);
    timelineItem.appendChild(contentWrapper);
    timelineItem.appendChild(timelineDot);
    
    // 添加动画延迟
    card.style.opacity = '0';
    card.style.transform = isEven ? 'translateX(20px)' : 'translateX(-20px)';
    
    timelineContainer.appendChild(timelineItem);
    
    // 添加滚动监听，实现滚动显示动画
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, index * 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(timelineItem);
  });
}

// 重写纪念日倒计时功能，使用更简单可靠的实现
function initAnniversaryCountdown() {
  console.log('🔍 开始初始化纪念日倒计时功能...');
  
  // 获取页面中已有的纪念日倒计时容器
  const countdownContainer = document.getElementById('countdown-container');
  if (!countdownContainer) {
    console.error('❌ 无法找到倒计时容器元素');
    return;
  }
  
  // 创建倒计时显示内容
  countdownContainer.innerHTML = `
    <div class="glassmorphism rounded-2xl p-8 max-w-2xl mx-auto">
      <!-- 倒计时显示区域 -->
      <div class="text-4xl md:text-5xl font-bold text-rose-600 my-8">
        <span id="days-count">123</span> 天 
        <span id="hours-count">45</span> 时 
        <span id="minutes-count">30</span> 分 
        <span id="seconds-count">15</span> 秒
      </div>
      
      <!-- 纪念日信息 -->
      <div class="mt-8 text-gray-600">
        <p>我们的纪念日: <span class="font-semibold text-rose-500">${CONFIG.site.anniversaryDate}</span></p>
        <p class="mt-2">第一个纪念日: <span class="font-semibold text-rose-500">${CONFIG.site.firstAnniversaryYear}年</span></p>
      </div>
    </div>
  `;
  
  console.log('✅ 纪念日倒计时内容已添加到页面');
  
  // 直接更新时间
  updateCountdownSimple();
  
  // 每秒更新一次
  setInterval(updateCountdownSimple, 1000);
  console.log('⏰ 纪念日倒计时功能初始化完成');
}

// 简单版本的更新倒计时函数
function updateCountdownSimple() {
  console.log('⏰ updateCountdownSimple函数被调用');
  
  // 计算从2024年11月16日到今天的时间差
  const startDate = new Date('2024-11-16');
  const today = new Date();
  
  // 计算时间差（毫秒）
  const timeDiff = today - startDate;
  
  // 转换为天数、小时、分钟和秒
  const totalSeconds = Math.floor(timeDiff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  
  console.log('⏰ 倒计时计算结果:', days, '天', hours, '时', minutes, '分', seconds, '秒');
  
  // 直接更新各个元素
  const daysElement = document.getElementById('days-count');
  const hoursElement = document.getElementById('hours-count');
  const minutesElement = document.getElementById('minutes-count');
  const secondsElement = document.getElementById('seconds-count');
  
  if (daysElement) daysElement.textContent = days;
  if (hoursElement) hoursElement.textContent = hours;
  if (minutesElement) minutesElement.textContent = minutes;
  if (secondsElement) secondsElement.textContent = seconds;
  
  console.log('✅ 倒计时数字已更新');
}

// 倒计时功能已经在initMainWebsite中被调用，不再需要单独的DOMContentLoaded事件监听器
console.log('✅ 倒计时功能已准备就绪，将在网站初始化时被调用');

// 加载照片墙
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
  const loadPhoto = (fileName, index, isPriority = false) => {
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
      
      // 简化：直接让浏览器加载，不添加额外机制
    }
    
    // 添加点击放大功能
    photoDiv.addEventListener('click', function() {
      const fullUrl = baseUrl.includes('images/') ? baseUrl + fileName : baseUrl + `images/${fileName}`;
      openImageModal(fullUrl, fileName, index + 1);
    });
    
    photoGallery.appendChild(photoDiv);
    return photoDiv; // 返回photoDiv供懒加载使用
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
      return errorDiv;
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
  
  // 真正的懒加载观察器
  const observeImage = (photoDiv, fileName, index) => {
    const img = photoDiv.querySelector('img');
    if (!img) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src || img.src;
          
          if (src && !img.complete) {
            // 开始加载图片
            img.loading = 'lazy';
            img.src = src;
            
            img.addEventListener('load', () => {
              img.classList.add('loaded');
              imageCache.markAsLoaded(fileName);
              updateProgress();
              imageObserver.unobserve(img);
            }, { once: true });
            
            img.addEventListener('error', () => {
              imageCache.recordLoadError();
              updateProgress();
              imageObserver.unobserve(img);
            }, { once: true });
          }
        }
      });
    }, {
      rootMargin: '100px', // 提前100px开始加载
      threshold: 0.1
    });
    
    imageObserver.observe(img);
    return imageObserver;
  };
  
  // 注册Service Worker
  registerServiceWorker();
  
  // 优化的分批加载策略
  console.log(`🚀 开始分批加载${photoFiles.length}张图片`);
  
  // 首屏优先加载（前12张）
  const priorityCount = 12;
  const batchSize = 4; // 每批加载4张
  
  const loadBatch = (startIndex, isPriority = false) => {
    const endIndex = Math.min(startIndex + batchSize, photoFiles.length);
    
    for (let i = startIndex; i < endIndex; i++) {
      try {
        const photoDiv = loadPhoto(photoFiles[i], i, isPriority);
        if (photoDiv) {
          // 使用Intersection Observer实现真正的懒加载
          if (!isPriority && i >= priorityCount) {
            observeImage(photoDiv, photoFiles[i], i);
          }
        }
      } catch (error) {
        console.error(`❌ 加载图片失败 ${i + 1}: ${photoFiles[i]}`, error);
      }
    }
    
    // 继续加载下一批（非优先级图片）
    if (!isPriority && endIndex < photoFiles.length) {
      setTimeout(() => loadBatch(endIndex), 200); // 200ms间隔
    }
  };
  
  // 立即加载首屏图片
  loadBatch(0, true);
  
  // 延迟加载其余图片
  setTimeout(() => loadBatch(priorityCount), 500);
  
  console.log(`✅ 分批加载策略已启动`);
  
  // 简单的进度监控
  setTimeout(() => {
    const currentCount = document.querySelectorAll('#photo-gallery > div').length;
    const imageCount = document.querySelectorAll('#photo-gallery img').length;
    const loadedCount = document.querySelectorAll('#photo-gallery img[data-loaded="true"]').length;
    
    console.log(`📊 进度检查：容器 ${currentCount}/${photoFiles.length}, 图片 ${imageCount}, 已加载 ${loadedCount}`);
    
    if (currentCount < photoFiles.length) {
      console.warn(`⚠️ 还有 ${photoFiles.length - currentCount} 个图片容器未创建`);
    }
  }, 3000); // 3秒后简单检查一次
}

// 照片元数据缓存
const photoMetadataCache = new Map();

// 照片元数据配置
const photoMetadata = [
  { filename: '20240101.jpg', date: '2024-01-01', location: '北京' },
  { filename: '20240214.jpg', date: '2024-02-14', location: '上海' },
  { filename: '20240320.jpg', date: '2024-03-20', location: '杭州' },
  { filename: '20240405.jpg', date: '2024-04-05', location: '苏州' },
  { filename: '20240510.jpg', date: '2024-05-10', location: '南京' },
  { filename: '20240615.jpg', date: '2024-06-15', location: '广州' },
  { filename: '20240720.jpg', date: '2024-07-20', location: '深圳' },
  { filename: '20240801.jpg', date: '2024-08-01', location: '成都' },
  { filename: '20240905.jpg', date: '2024-09-05', location: '重庆' },
  { filename: '20241010.jpg', date: '2024-10-10', location: '西安' },
  { filename: '20241115.jpg', date: '2024-11-15', location: '武汉' },
  { filename: '20241229.jpg', date: '2024-12-29', location: '三亚' }
];

// 恋爱记录数据
const loveStoryData = [
  {
    id: 1,
    date: '2020-03-15',
    title: '初次相遇',
    content: '那天，我们在图书馆偶然相遇，你的笑容如阳光般温暖，从那一刻起，我知道你就是我要找的人。',
    image: 'images/1/20200315.jpg',
    mood: '甜蜜'
  },
  {
    id: 2,
    date: '2020-05-20',
    title: '第一次约会',
    content: '我们一起去看了电影，吃了晚餐，聊了很多很多，感觉时间过得特别快。',
    image: 'images/1/20200520.jpg',
    mood: '兴奋'
  },
  {
    id: 3,
    date: '2021-02-14',
    title: '确定关系',
    content: '在情人节这天，我们正式确定了恋爱关系，从此，我们的生命中有了彼此的陪伴。',
    image: 'images/1/20210214.jpg',
    mood: '幸福'
  },
  {
    id: 4,
    date: '2021-09-30',
    title: '第一次旅行',
    content: '我们一起去了海边，看日出日落，听海浪声音，那是我最难忘的时光。',
    image: 'images/1/20210930.jpg',
    mood: '浪漫'
  },
  {
    id: 5,
    date: '2022-05-01',
    title: '小争执',
    content: '我们也会有争吵，但每次争吵后，我们的关系反而更加亲密了，因为我们学会了理解和包容。',
    image: 'images/1/20220501.jpg',
    mood: '理解'
  },
  {
    id: 6,
    date: '2023-10-01',
    title: '求婚成功',
    content: '在国庆这天，我向你求婚了，你答应了，那一刻，我觉得自己是世界上最幸福的人。',
    image: 'images/1/20231001.jpg',
    mood: '激动'
  },
  {
    id: 7,
    date: '2024-12-29',
    title: '我们结婚了',
    content: '这一天，我们终于成为了夫妻，从此，我们将携手共度余生，无论风雨，无论晴天。',
    image: 'images/1/20241229.jpg',
    mood: '感动'
  }
];

// 初始化照片墙
function initPhotoWall() {
  const gallerySection = document.getElementById('photo-wall');
  if (!gallerySection) {
    // 创建照片墙区域
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    const section = document.createElement('section');
    section.id = 'photo-wall';
    section.className = 'py-20 bg-gradient-to-b from-white to-purple-50';
    section.innerHTML = `
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4 text-rose-600">我们的照片墙</h2>
        <p class="text-xl text-center mb-12 text-gray-600">记录美好瞬间</p>
        <div id="photo-gallery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div>
      </div>
    `;
    
    // 插入到纪念日倒计时之后
    const countdownSection = document.getElementById('anniversary-countdown');
    if (countdownSection) {
      mainContent.insertBefore(section, countdownSection.nextSibling);
    } else {
      mainContent.appendChild(section);
    }
  }
  
  // 使用统一的照片元数据配置
  const photoGallery = document.getElementById('photo-gallery');
  if (!photoGallery) return;
  
  // 清空现有内容
  photoGallery.innerHTML = '';
  
  // 加载照片
  photoMetadata.forEach((photo, index) => {
    const photoPath = `images/2/${photo.filename}`;
    const photoCard = document.createElement('div');
    photoCard.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
    
    photoCard.innerHTML = `
      <div class="w-full h-64 bg-gray-100">
        <img src="${photoPath}" alt="照片" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div class="text-white text-sm">${formatDate(photo.date)}</div>
        <div class="text-white font-medium">${photo.location}</div>
      </div>
    `;
    
    photoGallery.appendChild(photoCard);
    
    // 点击放大功能
    photoCard.addEventListener('click', () => {
      openImageModal(photoPath, photo.filename, index + 1);
    });
  });
  
  console.log('🖼️  照片墙初始化完成');
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

// 加载照片函数
function loadPhotos(photosData) {
  const photoGallery = document.getElementById('photo-gallery');
  if (!photoGallery) return;
  
  photoData.forEach(photo => {
    // 这里可以使用之前的loadPhoto函数或自定义新的加载逻辑
    // 将照片元数据存入缓存
    photoMetadataCache.set(photo.fileName, photo);
    
    // 调用现有的loadPhoto函数或自定义加载逻辑
    // loadPhoto(photo.fileName, index, true);
  });
}

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

// 加载照片
function loadPhotos(photosData) {
  const gallery = document.getElementById('photo-gallery');
  if (!gallery || !photosData.length) return;
  
  // 清空画廊
  gallery.innerHTML = '';
  
  // 批量加载配置
  const { priorityCount, batchSize, batchDelay } = CONFIG.performance.batchLoad;
  
  // 优先加载前几张照片
  const priorityPhotos = photosData.slice(0, priorityCount);
  const remainingPhotos = photosData.slice(priorityCount);
  
  // 创建照片项的函数
  const createPhotoItem = (photoData) => {
    const photoPath = `${CONFIG.photos.gallery.folder}${photoData.fileName}`;
    
    const photoContainer = document.createElement('div');
    photoContainer.className = 'group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1';
    
    // 照片卡片内容
    photoContainer.innerHTML = `
      <div class="aspect-w-4 aspect-h-3 bg-gray-200 relative overflow-hidden">
        <img 
          src="${photoPath}" 
          alt="${photoData.description || photoData.fileName}" 
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div class="text-white">
            <div class="font-bold text-lg">${formatDate(photoData.date)}</div>
            <div class="flex items-center mt-1">
              <i class="fas fa-map-marker-alt mr-1"></i>
              <span>${photoData.location}</span>
            </div>
            ${photoData.description ? `<div class="mt-2 text-sm">${photoData.description}</div>` : ''}
          </div>
        </div>
      </div>
    `;
    
    // 添加点击事件，打开大图
    const img = photoContainer.querySelector('img');
    img.addEventListener('click', () => openImageModal(photoPath, {
      description: photoData.description,
      date: photoData.date,
      location: photoData.location
    }));
    
    // 处理图片加载错误
    img.addEventListener('error', (e) => handleImageError(e, photoPath));
    
    // 添加加载状态
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    img.onload = function() {
      this.style.opacity = '1';
      appState.markPhotoAsLoaded(photoData.fileName);
    };
    
    return photoContainer;
  };
  
  // 优先加载的照片立即添加
  priorityPhotos.forEach(photoData => {
    const photoItem = createPhotoItem(photoData);
    gallery.appendChild(photoItem);
  });
  
  // 分批加载剩余照片
  const loadBatch = (batch, delay) => {
    setTimeout(() => {
      batch.forEach(photoData => {
        const photoItem = createPhotoItem(photoData);
        gallery.appendChild(photoItem);
      });
    }, delay);
  };
  
  // 分批处理剩余照片
  for (let i = 0; i < remainingPhotos.length; i += batchSize) {
    const batch = remainingPhotos.slice(i, i + batchSize);
    const delay = Math.ceil(i / batchSize) * batchDelay;
    loadBatch(batch, delay);
  }
}

// 格式化日期显示
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 处理图片加载错误
function handleImageError(event, imagePath) {
  const img = event.target;
  console.error('图片加载失败:', imagePath);
  
  // 显示错误占位符
  img.style.background = '#f8f8f8';
  img.style.display = 'flex';
  img.style.alignItems = 'center';
  img.style.justifyContent = 'center';
  
  // 创建错误提示元素
  const errorDiv = document.createElement('div');
  errorDiv.className = 'text-center text-gray-500 p-4';
  errorDiv.innerHTML = `
    <i class="fas fa-image-slash text-2xl mb-2"></i>
    <div>图片加载失败</div>
  `;
  
  // 将错误元素添加到图片容器中
  const container = img.parentElement;
  container.appendChild(errorDiv);
  
  // 重试逻辑
  errorDiv.addEventListener('click', () => {
    errorDiv.remove();
    img.src = imagePath + '?retry=' + Date.now();
  });
}



// 页面加载完成后执行
// 计算从特定日期到今天的天数和下次纪念日倒计时
function calculateDaysTogether() {
  const startDate = new Date(`${CONFIG.site.firstAnniversaryYear}-${CONFIG.site.anniversaryDate}`);
  const today = new Date();
  
  // 设置时间为同一天的开始，避免时间部分影响计算
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // 计算毫秒差并转换为天数（在一起的天数）
  const timeDiff = today - startDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // 计算下次纪念日
  const [month, day] = CONFIG.site.anniversaryDate.split('-');
  let nextAnniversaryYear = today.getFullYear();
  let nextAnniversary = new Date(nextAnniversaryYear, month - 1, day);
  nextAnniversary.setHours(0, 0, 0, 0);
  
  // 如果今年的纪念日已过，则计算明年的
  if (today > nextAnniversary) {
    nextAnniversaryYear += 1;
    nextAnniversary = new Date(nextAnniversaryYear, month - 1, day);
    nextAnniversary.setHours(0, 0, 0, 0);
  }
  
  // 计算到下次纪念日的天数
  const daysUntilNext = Math.ceil((nextAnniversary - today) / (1000 * 3600 * 24));
  
  // 找到显示元素并更新文本
  const infoElement = document.getElementById('anniversary-info');
  if (infoElement) {
    infoElement.textContent = `我们的纪念日: 11-16，第一个纪念日: 2024年，已经在一起 ${daysDiff} 天，距离下次纪念日还有 ${daysUntilNext} 天`;
  }
  
  return { daysTogether: daysDiff, daysUntilNext: daysUntilNext };
}

document.addEventListener('DOMContentLoaded', function() {
  // 重置全局缓存（防止刷新页面时状态残留）
  imageCache.loadedImages.clear();
  console.log('🔄 全局缓存已清空，开始新的会话');
  
  // 直接初始化纪念日倒计时功能，不依赖于密码验证
  console.log('🎯 直接初始化纪念日倒计时功能');
  initAnniversaryCountdown();
  
  // 计算并显示在一起的天数
  calculateDaysTogether();
  
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
  // 确保模态框不会超出视口
  modal.style.maxHeight = '100vh';
  modal.style.maxWidth = '100vw';
  modal.style.overflow = 'hidden';
  
  // 检查图片是否已缓存
  const isCached = imageCache.isLoaded(fileName);
  const loadingIndicator = isCached ? '' : '<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"><div class="text-white text-xl animate-pulse">加载中...</div></div>';
  
  modal.innerHTML = `
    <div class="relative w-full h-full">
      ${loadingIndicator}
      
      <!-- 图片容器 - 居中显示 -->
      <div class="flex items-center justify-center w-full h-full p-8">
        <!-- 图片包装器 - 用于定位关闭按钮 -->
        <div class="relative inline-block">
          <!-- 关闭按钮 - 相对于图片定位在右上角 -->
          <button class="modal-close-btn absolute -top-3 -right-3 px-3 py-1 bg-white bg-opacity-95 hover:bg-opacity-100 text-gray-800 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium" style="z-index: 9999 !important;" title="关闭 (ESC)">
            关闭
          </button>
          
          <img src="${imageSrc}" alt="婚纱照 ${imageNumber}" class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl block" style="${isCached ? '' : 'opacity: 0; transition: opacity 0.3s;'}">
        </div>
      </div>
      
      <!-- 备用关闭按钮 - 固定在屏幕左上角 -->
      <button class="modal-close-btn-alt fixed top-4 left-4 bg-black bg-opacity-60 hover:bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 backdrop-blur-sm" style="z-index: 9998 !important;" title="关闭">
        ✕ 关闭
      </button>
      
      <!-- 图片信息 - 固定在底部 -->
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm z-30">
        婚纱照 ${imageNumber} - ${fileName} ${isCached ? '⚡' : ''}
      </div>
      
      <!-- 操作提示 - 调整位置避免与关闭按钮重叠 -->
      <div class="fixed top-20 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm z-30">
        ESC 或双击关闭
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // 淡入效果
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 10);
  
  const img = modal.querySelector('img');
  
  // 图片加载完成后的处理
  const handleImageLoad = function() {
    // 隐藏加载指示器，显示图片
    const loadingDiv = modal.querySelector('.absolute.inset-0');
    if (loadingDiv) {
      loadingDiv.remove();
    }
    this.style.opacity = '1';
    imageCache.markAsLoaded(fileName);
    
    // 检查图片尺寸，确保不超出视口
    setTimeout(() => {
      const imgRect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // 如果图片太大，调整图片尺寸
      if (imgRect.height > viewportHeight * 0.8 || imgRect.width > viewportWidth * 0.9) {
        console.log('调整图片尺寸以适应视口');
        this.style.maxHeight = '80vh';
        this.style.maxWidth = '90vw';
      }
      
      // 关闭按钮使用绝对定位，会自动跟随图片容器
    }, 100);
  };
  
  // 如果图片未缓存，监听加载完成
  if (!isCached) {
    img.addEventListener('load', handleImageLoad);
    
    img.addEventListener('error', function() {
      const loadingDiv = modal.querySelector('.absolute.inset-0');
      if (loadingDiv) {
        loadingDiv.innerHTML = '<div class="text-white text-xl">😔 加载失败</div>';
      }
    });
  } else {
    // 已缓存的图片也要检查尺寸
    img.addEventListener('load', handleImageLoad);
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
    // 点击背景或任何关闭按钮都关闭模态框
    if (e.target === modal || 
        e.target.closest('.modal-close-btn') || 
        e.target.closest('.modal-close-btn-alt') ||
        e.target.textContent.includes('关闭')) {
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
  
  // 双击图片也可以关闭
  img.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    closeModal();
  });
  
  // 确保关闭按钮始终可见
  setTimeout(() => {
    const mainCloseBtn = modal.querySelector('.modal-close-btn');
    const altCloseBtn = modal.querySelector('.modal-close-btn-alt');
    
    if (mainCloseBtn) {
      mainCloseBtn.style.zIndex = '9999';
      mainCloseBtn.style.position = 'absolute';
      mainCloseBtn.style.top = '-12px';
      mainCloseBtn.style.right = '-12px';
      mainCloseBtn.style.display = 'flex';
      mainCloseBtn.style.opacity = '1';
      mainCloseBtn.style.visibility = 'visible';
      console.log('主关闭按钮已设置 - 图片右上角');
    }
    
    if (altCloseBtn) {
      altCloseBtn.style.zIndex = '9998';
      altCloseBtn.style.position = 'fixed';
      altCloseBtn.style.display = 'flex';
      altCloseBtn.style.opacity = '1';
      altCloseBtn.style.visibility = 'visible';
      console.log('备用关闭按钮已设置');
    }
  }, 200);
}

// 显示情书列表
function displayLettersList(lettersData) {
  const container = document.getElementById('letters-container');
  if (!container) return;
  
  // 清空容器
  container.innerHTML = '';
  
  lettersData.forEach((letter, index) => {
    // 随机选择背景图
    const backgroundImg = CONFIG.letters.backgrounds[index % CONFIG.letters.backgrounds.length];
    
    const letterCard = document.createElement('div');
    letterCard.className = 'group relative cursor-pointer perspective-1000';
    letterCard.innerHTML = `
      <div class="relative w-full aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 group-hover:rotate-y-10">
        <img src="${backgroundImg}" alt="情书背景" class="absolute inset-0 w-full h-full object-cover opacity-30">
        <div class="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-purple-500/10 to-transparent"></div>
        <div class="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
          <div class="text-2xl font-bold text-rose-600 mb-2">${letter.title}</div>
          <div class="text-gray-700">${formatDate(letter.date)}</div>
          <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <i class="fas fa-envelope-open text-4xl text-rose-500"></i>
          </div>
        </div>
      </div>
    `;
    
    // 添加点击事件，打开情书内容
    letterCard.addEventListener('click', () => {
      openLoveLetter(letter);
    });
    
    container.appendChild(letterCard);
  });
}

// 打开情书内容
function openLoveLetter(letter) {
  // 创建情书模态框
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto';
  
  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold text-rose-600">${letter.title}</h3>
        <button id="close-letter" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="text-gray-600 mb-4">${formatDate(letter.date)}</div>
      <div id="letter-content" class="prose max-w-none text-gray-700">
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      </div>
      <div id="letter-music" class="mt-6 text-center hidden">
        <audio id="letter-audio" controls></audio>
      </div>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // 关闭按钮事件
  const closeBtn = modal.querySelector('#close-letter');
  closeBtn.addEventListener('click', () => {
    closeLoveLetterModal();
  });
  
  // ESC键关闭
  document.addEventListener('keydown', handleEscapeKey);
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLoveLetterModal();
    }
  });
  
  // 加载情书内容
  loadLetterContent(letter);
  
  // 加载背景音乐
  loadLetterMusic(letter.fileName);
}

// 关闭情书模态框
function closeLoveLetterModal() {
  const modal = document.querySelector('#love-letter-modal') || document.querySelector('.fixed.inset-0.bg-black\/70');
  if (modal) {
    // 停止音乐
    const audio = document.getElementById('letter-audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    modal.remove();
    
    // 移除事件监听
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

// 处理ESC键
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeLoveLetterModal();
  }
}

// 加载情书内容
function loadLetterContent(letter) {
  const contentElement = document.getElementById('letter-content');
  if (!contentElement) return;
  
  // 模拟加载情书内容
  const mockContents = {
    '20241229.txt': '亲爱的，<br><br>今天是2024年的最后几天，我想告诉你，这一年有你的陪伴真的很幸福。<br><br>我们一起经历了许多美好的时光，也一起面对了各种挑战。每一次的争吵，每一次的和解，都让我们的感情更加深厚。<br><br>未来的日子，我希望能一直牵着你的手，一起看日出日落，一起走过春夏秋冬。<br><br>永远爱你的人',
    '20241120.txt': '亲爱的宝贝，<br><br>冬天来了，天气变冷了，记得多穿点衣服。<br><br>虽然我们现在不能每天见面，但我的心一直都在你身边。每当想起你温暖的笑容，我的心里就充满了力量。<br><br>期待着我们下次见面的日子，我会给你一个大大的拥抱。<br><br>想你的人',
    '20241015.txt': '亲爱的，<br><br>秋天的风很温柔，就像你的手轻轻拂过我的脸颊。<br><br>今天走在路上，看到满树的落叶，突然想起去年秋天我们一起去看枫叶的情景。那时候的你，笑得像个孩子，眼睛里闪烁着光芒。<br><br>谢谢你出现在我的生命里，让我的每一天都变得如此美好。<br><br>爱你的人',
    '20240909.txt': '我最亲爱的，<br><br>今天是9月9日，长长久久的一天。我想在这个特别的日子里告诉你，我希望我们的爱情能够长长久久，永不分离。<br><br>谢谢你一直以来对我的包容和理解，谢谢你在我困难的时候给我支持和鼓励。<br><br>我会珍惜我们在一起的每一天，用我的一生去爱你、呵护你。<br><br>永远爱你的人',
    '20240815.txt': '亲爱的，<br><br>七夕快乐！虽然我们不能一起度过这个浪漫的节日，但我的心始终与你同在。<br><br>希望牛郎织女能够听到我们的心声，保佑我们的爱情能够像他们一样，跨越一切障碍，永远在一起。<br><br>期待着与你相聚的那一天。<br><br>爱你的人',
    '20240707.txt': '亲爱的宝贝，<br><br>夏天的风很热情，就像我对你的爱一样。<br><br>这个夏天，我们一起去了海边，一起看了日落，一起吃了冰淇淋。这些美好的回忆，我会永远珍藏在心里。<br><br>谢谢你让我的夏天变得如此难忘。<br><br>爱你的人',
    '20240601.txt': '亲爱的，<br><br>儿童节快乐！虽然我们都已经长大了，但在我心里，你永远是那个需要我呵护的孩子。<br><br>希望我们能够永远保持一颗童心，永远对生活充满热情和好奇。<br><br>谢谢你带给我的快乐和幸福。<br><br>爱你的人',
    '20240520.txt': '我最爱的人，<br><br>520，我爱你！在这个特别的日子里，我想大声告诉你，我爱你，很爱很爱你！<br><br>从我们相遇的那一刻起，我就知道，你是我今生唯一的挚爱。谢谢你选择了我，谢谢你愿意和我一起走过人生的旅程。<br><br>我会用我的一生去爱你，去珍惜你，去保护你。<br><br>永远爱你的人'
  };
  
  // 模拟延迟加载
  setTimeout(() => {
    const content = mockContents[letter.fileName] || '<p>情书内容加载中...</p>';
    contentElement.innerHTML = `<p>${content}</p>`;
  }, 500);
}

// 加载情书背景音乐
function loadLetterMusic(fileName) {
  const musicElement = document.getElementById('letter-music');
  const audioElement = document.getElementById('letter-audio');
  
  if (!musicElement || !audioElement) return;
  
  // 解析文件名中的日期
  const dateStr = fileName.replace('.txt', '');
  
  // 模拟从bgm.xml获取音乐信息
  const bgmMap = {
    '20241229': '流星雨',
    '20250214': '偏向'
  };
  
  const musicName = bgmMap[dateStr] || '流星雨';
  
  // 模拟音乐URL（实际应用中应该根据musicName获取真实的音乐URL）
  const musicUrl = CONFIG.music.mainTheme.src; // 这里简化处理，实际应该根据musicName获取
  
  audioElement.src = musicUrl;
  audioElement.title = musicName;
  
  // 显示音乐播放器
  musicElement.classList.remove('hidden');
  
  // 自动播放（注意：浏览器可能会阻止自动播放）
  try {
    audioElement.play().catch(err => {
      console.log('无法自动播放音乐，请用户手动点击播放:', err);
    });
  } catch (error) {
    console.error('音乐播放错误:', error);
  }
}

// 初始化音乐播放器
function initMusicPlayer() {
  // 检查音乐功能是否启用
  if (!CONFIG.music.enable) {
    console.log('🎵 音乐功能已禁用');
    return;
  }
  // 创建音乐播放器组件
  const player = document.createElement('div');
  player.id = 'music-player';
  player.className = 'fixed bottom-4 right-4 z-50 bg-rose-500/80 hover:bg-rose-600/80 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110';
  
  player.innerHTML = `
    <div class="flex items-center gap-3">
      <button id="music-toggle" class="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors">
        <i id="music-icon" class="fas fa-play"></i>
      </button>
      <div id="music-info" class="max-w-[150px] overflow-hidden">
        <div class="text-sm font-medium text-white truncate">${CONFIG.music.mainTheme.title}</div>
      </div>
    </div>
    <audio id="background-music" loop>
      <source src="${CONFIG.music.mainTheme.src}" type="audio/ogg">
    </audio>
  `;
  
  // 确保主内容加载后再添加播放器
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    // 确保主内容显示后再添加播放器
    if (mainContent.style.display !== 'none') {
      document.body.appendChild(player);
    } else {
      // 监听主内容显示事件
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mainContent.style.display !== 'none') {
            document.body.appendChild(player);
            observer.disconnect();
          }
        });
      });
      observer.observe(mainContent, { attributes: true, attributeFilter: ['style'] });
    }
  } else {
    document.body.appendChild(player);
  }
  
  const audio = document.getElementById('background-music');
  const toggleBtn = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  
  // 播放/暂停控制
  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        appState.setMusicPlaying(true);
        musicIcon.className = 'fas fa-pause';
      }).catch(err => {
        console.log('无法播放音乐:', err);
        // 添加提示信息
        alert('音乐播放需要您的授权，请点击播放按钮开始音乐');
      });
    } else {
      audio.pause();
      appState.setMusicPlaying(false);
      musicIcon.className = 'fas fa-play';
    }
  });
  
  // 根据配置决定是否自动尝试播放
  if (CONFIG.music.autoPlay) {
    setTimeout(() => {
      audio.play().then(() => {
        appState.setMusicPlaying(true);
        musicIcon.className = 'fas fa-pause';
      }).catch(err => {
        console.log('自动播放失败，请手动点击播放按钮:', err);
      });
    }, 3000);
  }
  
  console.log('🎵 音乐播放器初始化完成');
}

// 初始化导航功能（包含页面切换）
function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const mobileMenuBtn = document.getElementById('mobile-menu-button') || document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mainContent = document.getElementById('main-content');
  let currentPageIndex = 0;
  let isProgrammaticScroll = false; // 标记是否为程序触发的滚动
  
  // 定义所有页面（修正首页ID）
  const pages = ['#home', '#love-story', '#anniversary-countdown', '#photo-wall', '#love-letters'];
  
  // 移动端菜单切换
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (mobileMenuBtn.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
      } else {
        mobileMenuBtn.classList.add('active');
      }
    });
  }
  
  // 导航链接点击事件
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 关闭移动端菜单
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      }
      
      // 获取目标页面索引
      const targetId = link.getAttribute('href');
      const targetIndex = pages.indexOf(targetId);
      
      if (targetIndex !== -1) {
        navigateToPage(targetIndex);
      }
    });
  });
  
  // 页面切换函数
  function navigateToPage(index) {
    if (index < 0 || index >= pages.length) return;
    
    isProgrammaticScroll = true; // 标记为程序触发的滚动
    
    // 直接滚动到目标页面，而不是使用transform
    const targetElement = document.querySelector(pages[index]);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    currentPageIndex = index;
    
    // 更新活动导航项
    updateActiveNavItem(pages[index]);
    
    // 记录当前页面到appState
    appState.currentPage = pages[index];
    
    // 重置标记，允许用户滚动再次触发更新
    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 1000); // 给平滑滚动足够的时间完成
  }
  
  // 监听用户滚动事件，更新页面状态
  let lastScrollPosition = 0;
  let scrollTimeout;
  
  function handleUserScroll() {
    // 如果是程序触发的滚动，则不处理
    if (isProgrammaticScroll) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 计算当前页面索引
      const newIndex = Math.max(0, Math.min(Math.round(scrollPosition / windowHeight), pages.length - 1));
      
      if (newIndex !== currentPageIndex) {
        // 更新页面状态，但不使用transform（让自然滚动保持）
        currentPageIndex = newIndex;
        updateActiveNavItem(pages[newIndex]);
        appState.currentPage = pages[newIndex];
        
        // 可选：如果希望在用户滚动后自动对齐到页面顶部
        // isProgrammaticScroll = true;
        // window.scrollTo({ top: newIndex * windowHeight, behavior: 'smooth' });
        // setTimeout(() => { isProgrammaticScroll = false; }, 1000);
      }
      
      lastScrollPosition = scrollPosition;
    }, 150);
  }
  
  // 添加滚动事件监听器
  window.addEventListener('scroll', handleUserScroll);
  
  // 更新活动导航项
  function updateActiveNavItem(activeId) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === activeId) {
        link.classList.add('text-rose-500');
        link.classList.remove('text-gray-700');
        if (link.classList.contains('nav-link')) {
          link.classList.add('active');
        }
      } else {
        link.classList.remove('text-rose-500');
        link.classList.add('text-gray-700');
        if (link.classList.contains('nav-link')) {
          link.classList.remove('active');
        }
      }
    });
  }
  
  // 添加键盘导航
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      navigateToPage(currentPageIndex + 1);
    } else if (e.key === 'ArrowUp') {
      navigateToPage(currentPageIndex - 1);
    }
  });
  
  // 初始设置第一个导航项为活动状态
  if (navLinks.length > 0) {
    updateActiveNavItem(pages[0]);
  }
  
  console.log('🚀 页面切换导航初始化完成');
}

// 初始化平滑滚动
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 初始化滚动监听
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // 初始化时调用一次
}

// 初始化滚动动画
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // 观察所有需要动画的元素
  const animatedElements = document.querySelectorAll('.animate-fade-in');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// 初始化情书信箱
function initLoveLetters() {
  const lettersSection = document.getElementById('love-letters');
  if (!lettersSection) {
    // 创建情书信箱区域
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    const section = document.createElement('section');
    section.id = 'love-letters';
    section.className = 'py-20 bg-gradient-to-b from-rose-50 to-white';
    section.innerHTML = `
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-4 text-rose-600">情书信箱</h2>
        <p class="text-xl text-center mb-12 text-gray-600">纸短情长，爱你的心</p>
        <div id="letters-container" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
      </div>
    `;
    
    // 插入到照片墙之后
    const photoWallSection = document.getElementById('photo-wall');
    if (photoWallSection) {
      mainContent.insertBefore(section, photoWallSection.nextSibling);
    } else {
      mainContent.appendChild(section);
    }
  }
  
  // 模拟情书数据
  const lettersData = [
    { fileName: '20241229.txt', title: '给亲爱的你', date: '2024-12-29' },
    { fileName: '20241120.txt', title: '冬日的思念', date: '2024-11-20' },
    { fileName: '20241015.txt', title: '秋日私语', date: '2024-10-15' },
    { fileName: '20240909.txt', title: '长长久久', date: '2024-09-09' },
    { fileName: '20240815.txt', title: '七夕快乐', date: '2024-08-15' },
    { fileName: '20240707.txt', title: '浪漫的夏天', date: '2024-07-07' },
    { fileName: '20240601.txt', title: '我们的儿童节', date: '2024-06-01' },
    { fileName: '20240520.txt', title: '520特别的爱', date: '2024-05-20' }
  ];
  
  // 按日期排序（最新的在前）
  lettersData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // 显示情书列表
  displayLettersList(lettersData);
  
  console.log('💌 情书信箱初始化完成');
}