// 环境配置 - 缓存版本：2024-02-02-1
const isProduction = true; // 生产环境标志

// 应用状态管理
const appState = {
  isAuthenticated: false,
  currentPage: 'home',
  isMusicPlaying: false,
  loadedImages: new Set(),
  // 添加markPhotoAsLoaded方法以支持现有代码
  markPhotoAsLoaded: function(fileName) {
    this.loadedImages.add(fileName);
  }
};

// 网站配置
const CONFIG = {
  site: {
    anniversaryDate: '11-16', // 纪念日日期
    firstAnniversaryYear: '2024' // 第一个纪念日年份
  },
  music: {
    mainTheme: {
      src: 'music/流星雨.ogg', // 使用ogg格式音乐文件
      name: '流星雨'
    },
    volume: 0.3,
    autoPlay: false
  }
};

// 照片元数据缓存
const photoMetadataCache = new Map();

// 照片元数据配置
// 使用与实际文件匹配的元数据
const photoMetadata = [
  { filename: '2024-06-02 101407.jpg', date: '2024-06-02', location: '旅行记忆' },
  { filename: '2024-07-08 182110.jpg', date: '2024-07-08', location: '约会时光' },
  { filename: '2024-07-21 192151.jpg', date: '2024-07-21', location: '浪漫晚餐' },
  { filename: '2024-07-23 023743.jpg', date: '2024-07-23', location: '星空下' },
  { filename: '2024-07-29 080728.jpg', date: '2024-07-29', location: '周末旅行' },
  { filename: '2024-11-16 183146.jpg', date: '2024-11-16', location: '周年纪念' },
  { filename: '2024-12-01 162950.png', date: '2024-12-01', location: '冬日漫步' },
  { filename: '2024-12-20 175031.png', date: '2024-12-20', location: '圣诞节前' },
  { filename: '2024-12-31 140928.jpg', date: '2024-12-31', location: '跨年' },
  { filename: '2025-01-30 234953.jpg', date: '2025-01-30', location: '生日庆祝' },
  { filename: '2025-02-01 222615.jpg', date: '2025-02-01', location: '情人节预热' },
  { filename: '2025-02-02 184935.jpg', date: '2025-02-02', location: '美好瞬间' }
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

// 初始化首页全屏背景图片
function initHomePhoto() {
  // 获取背景容器
  const backgroundContainer = document.getElementById('home-background-container');
  if (!backgroundContainer) {
    console.log('🔍 未找到首页背景容器');
    return;
  }
  
  // 使用固定的背景图片路径
  const photoPath = "images/1/IMG_20241208_110014.jpg";
  
  console.log(`🏠 正在加载首页背景图片: ${photoPath}`);
  
  // 确保容器样式正确
  backgroundContainer.style.position = 'absolute';
  backgroundContainer.style.top = '0';
  backgroundContainer.style.left = '0';
  backgroundContainer.style.right = '0';
  backgroundContainer.style.bottom = '0';
  backgroundContainer.style.width = '100%';
  backgroundContainer.style.height = '100%';
  backgroundContainer.style.overflow = 'hidden';
  backgroundContainer.style.zIndex = '-20';
  
  // 创建背景图片元素
  const img = document.createElement('img');
  img.src = photoPath;
  img.alt = '我们的照片背景';
  img.className = 'w-full h-full object-cover';
  img.style.transition = 'opacity 1.5s ease-in-out';
  img.style.opacity = '0';
  img.style.display = 'block';
  
  // 图片加载完成后显示
  img.onload = () => {
    console.log(`✅ 首页背景图片加载成功: IMG_20241208_110014.jpg`);
    img.style.opacity = '1';
    backgroundContainer.setAttribute('aria-label', '首页背景图片已加载');
  };
  
  img.onerror = () => {
    console.error(`❌ 首页背景图片加载失败: ${photoPath}`);
    // 设置备选背景颜色和背景图
    backgroundContainer.style.backgroundColor = '#fecdd3';
    backgroundContainer.style.backgroundImage = 'url("https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=romantic%20couple%20background%20blur&image_size=landscape_16_9")';
    backgroundContainer.style.backgroundSize = 'cover';
    backgroundContainer.style.backgroundPosition = 'center';
  };
  
  // 清空容器并添加背景图片
  backgroundContainer.innerHTML = '';
  backgroundContainer.appendChild(img);
  
  // 为了兼容性，也为旧的照片容器设置一个备用内容
  const oldContainer = document.getElementById('home-photo-container');
  if (oldContainer) {
    oldContainer.innerHTML = '<div class="hidden">照片已移至背景</div>';
  }
}

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
        <button class="mt-6 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:scale-105 transform mx-auto block" onclick="document.getElementById('photo-gallery').scrollIntoView({ behavior: 'smooth' })">
          <i class="fas fa-images mr-2"></i>浏览照片墙
        </button>
        <div id="photo-gallery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12"></div>
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
  
  console.log('开始加载照片，总共:', photoMetadata.length, '张');
  
  // 加载照片
  photoMetadata.forEach((photo, index) => {
    // 使用正确的相对路径引用图片
    const photoPath = `images/2/${photo.filename}`;
    
    const photoCard = document.createElement('div');
    photoCard.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
    
    photoCard.innerHTML = `
      <div class="w-full h-64 bg-gray-100 relative">
        <img src="${photoPath}" alt="照片" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" onerror="handleImageError(event, '${photoPath}')">
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
    
    // 预加载图片以提高用户体验
    const img = new Image();
    img.src = photoPath;
    img.onload = () => {
      console.log(`✅ 图片加载成功: ${photo.filename}, 路径: ${photoPath}`);
    };
    img.onerror = () => {
      console.error(`❌ 图片加载失败: ${photo.filename}, 路径: ${photoPath}`);
    };
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

// loadPhotos函数在文件后面的371行有完整实现

// handleImageError函数在文件后面的506行有正确的定义

// 主网站初始化函数
function initMainWebsite() {
  console.log('🚀 开始初始化主网站功能...');
  
  // 初始化首页照片
  if (typeof initHomePhoto === 'function') {
    console.log('🏠 初始化首页照片');
    initHomePhoto();
  }
  
  // 初始化照片墙
  if (typeof initPhotoWall === 'function') {
    console.log('🖼️  初始化照片墙功能');
    initPhotoWall();
  }
  
  // 初始化音乐播放器
  if (typeof initMusicPlayer === 'function') {
    console.log('🎵 初始化音乐播放器');
    initMusicPlayer();
  }
  
  // 初始化导航
  if (typeof initNavigation === 'function') {
    console.log('🧭 初始化导航功能');
    initNavigation();
  }
  
  // 初始化平滑滚动
  if (typeof initSmoothScroll === 'function') {
    console.log('📜 初始化平滑滚动');
    initSmoothScroll();
  }
  
  // 初始化滚动监听
  if (typeof initScrollSpy === 'function') {
    console.log('👀 初始化滚动监听');
    initScrollSpy();
  }
  
  // 初始化滚动动画
  if (typeof initScrollAnimations === 'function') {
    console.log('✨ 初始化滚动动画');
    initScrollAnimations();
  }
  
  // 初始化懒加载
  if (typeof lazyLoadImages === 'function') {
    console.log('⏳ 初始化图片懒加载');
    lazyLoadImages();
  }
  
  console.log('✅ 主网站功能初始化完成');
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
    const loadedImages = document.querySelectorAll('#photo-gallery img[data-loaded="true"]');
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
  // 直接在函数内部定义必要的值
  const anniversaryDate = '11-16';
  const firstAnniversaryYear = '2024';
  
  const startDate = new Date(`${firstAnniversaryYear}-${anniversaryDate}`);
  const today = new Date();
  
  // 设置时间为同一天的开始，避免时间部分影响计算
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // 计算毫秒差并转换为天数（在一起的天数）
  const timeDiff = today - startDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  // 计算下次纪念日
  const [month, day] = anniversaryDate.split('-');
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

// 简单直接的修复方案：检查当前页面是否为letters.html
// 直接在DOMContentLoaded事件中判断页面类型，避免全局变量问题
document.addEventListener('DOMContentLoaded', function() {
  // 获取当前页面的完整路径
  const currentPath = window.location.pathname;
  console.log('🔄 页面加载完成，开始初始化...');
  console.log(`📄 当前页面路径: ${currentPath}`);
  
  // 检查是否为情书信箱页面
  const isLettersPage = currentPath.includes('letters.html');
  console.log(`🔍 是否为情书信箱页面: ${isLettersPage}`);
  
  if (isLettersPage) {
    // 情书信箱页面 - 只加载必要的功能
    console.log('📋 情书信箱页面模式：只加载信件相关功能');
    
    try {
      // 只初始化导航功能
      if (typeof initNavigation === 'function') {
        console.log('🔧 初始化导航功能');
        initNavigation();
      }
      
      // 初始化情书信箱功能
      if (typeof initLoveLetters === 'function') {
        console.log('💌 初始化情书信箱功能');
        initLoveLetters();
      }
    } catch (error) {
      console.log('ℹ️  情书信箱功能初始化时出现问题，但不影响基本浏览');
    }
  } else {
    // 主页面 - 加载所有功能
    console.log('🏠 主页面模式：加载完整功能');
    
    // 初始化倒计时功能
    if (typeof initAnniversaryCountdown === 'function') {
      console.log('⏰ 初始化倒计时功能');
      initAnniversaryCountdown();
    }
    
    // 计算在一起的天数
    if (typeof calculateDaysTogether === 'function') {
      console.log('📅 计算在一起的天数');
      try {
        calculateDaysTogether();
      } catch (error) {
        console.error('计算天数时出错:', error);
        // 即使出错也继续执行其他功能
      }
    }
    
    // 初始化密码保护
    if (typeof initPasswordProtection === 'function') {
      console.log('🔒 初始化密码保护功能');
      initPasswordProtection();
    }
    
    // 初始化主网站功能
    if (typeof initMainWebsite === 'function') {
      console.log('🌐 初始化主网站功能');
      initMainWebsite();
    }
  }
});

// 部署测试脚本引用 - 仅在非生产环境或手动测试时加载
// 正式部署时注释或移除这一行
if (!isProduction || window.location.search.includes('test=true')) {
  try {
    // 动态加载部署测试脚本
    const script = document.createElement('script');
    script.src = '/deploy-test.js';
    script.async = true;
    script.onload = () => {
      console.log('部署测试脚本已加载');
    };
    script.onerror = (error) => {
      console.error('部署测试脚本加载失败:', error);
    };
    document.head.appendChild(script);
  } catch (e) {
    console.error('加载部署测试脚本时出错:', e);
  }
}


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
    // 确保letter对象结构正确
    if (!letter || !letter.title || !letter.date) {
      console.error('❌ 情书数据格式错误:', letter);
      return;
    }
    
    // 随机选择背景图，如果配置不可用则使用默认值
    let backgroundImg = '/images/letter-bg.jpg'; // 默认背景图
    if (CONFIG && CONFIG.letters && CONFIG.letters.backgrounds && CONFIG.letters.backgrounds.length > 0) {
      backgroundImg = CONFIG.letters.backgrounds[index % CONFIG.letters.backgrounds.length];
    }
    
    const letterCard = document.createElement('div');
    letterCard.className = 'group relative cursor-pointer perspective-1000';
    letterCard.dataset.letterTitle = letter.title;
    letterCard.dataset.letterDate = letter.date;
    
    letterCard.innerHTML = `
      <div class="relative w-full aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 group-hover:rotate-y-10">
        <img src="${backgroundImg}" alt="情书背景" class="absolute inset-0 w-full h-full object-cover opacity-30">
        <div class="absolute inset-0 bg-gradient-to-b from-rose-500/20 via-purple-500/10 to-transparent"></div>
        <div class="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
          <div class="text-2xl font-bold text-rose-600 mb-2 letter-title">${letter.title}</div>
          <div class="text-gray-700 letter-date">${formatDate(letter.date)}</div>
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
    console.log(`💌 添加情书卡片: ${letter.title} (${letter.date})`);
  });
  
  // 添加样式确保标题正确显示
  const style = document.createElement('style');
  style.textContent = `
    .letter-title {
      font-size: 1.5rem !important;
      line-height: 1.3;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      word-break: break-word;
      white-space: normal;
    }
    .letter-date {
      font-size: 0.9rem !important;
    }
  `;
  document.head.appendChild(style);
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
    '20241229.txt': '亲爱的，<br><br>今天是2024年的最后几天，我想告诉你，这一年有你的陪伴really幸福。<br><br>我们一起经历了许多美好的时光，也一起面对了各种挑战。每一次的争吵，每一次的和解，都让我们的感情更加深厚。<br><br>未来的日子，我希望能一直牵着你的手，一起看日出日落，一起走过春夏秋冬。<br><br>永远爱你的人',
    '20241120.txt': '亲爱的宝贝，<br><br>冬天来了，天气变冷了，记得多穿点衣服。<br><br>虽然我们现在不能每天见面，但我的心一直都在你边。每当想起你温暖的笑容，我的心里就充满了力量。<br><br>期待着我们下次见面的日子，我会给你一个大大的拥抱。<br><br>想的人',
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

// 初始化音乐播放器功能
function initMusicPlayer() {
  console.log('🎵 开始初始化音乐播放器...');
  
  // 创建音乐播放器元素
  const musicPlayer = document.createElement('div');
  musicPlayer.id = 'music-player';
  musicPlayer.className = 'fixed bottom-4 right-4 z-40 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110';
  
  // 创建播放/暂停按钮
  const playBtn = document.createElement('button');
  playBtn.id = 'music-play-btn';
  playBtn.className = 'w-12 h-12 rounded-full flex items-center justify-center text-gray-800 hover:text-rose-500 transition-colors';
  playBtn.innerHTML = '<i class="fas fa-music text-xl"></i>';
  playBtn.title = '播放/暂停音乐';
  
  // 创建隐藏的音频元素
  const audio = document.createElement('audio');
  audio.id = 'background-music';
  audio.loop = true;
  audio.volume = CONFIG.music.volume || 0.3;
  
  // 设置音乐源
  if (CONFIG && CONFIG.music && CONFIG.music.mainTheme && CONFIG.music.mainTheme.src) {
    audio.src = CONFIG.music.mainTheme.src;
    console.log('🎶 已设置音乐源:', CONFIG.music.mainTheme.src);
  } else {
    console.warn('⚠️ 音乐配置未找到，使用默认音乐');
    // 默认使用ogg格式音乐
    audio.src = 'music/流星雨.ogg';
  }
  
  // 添加到页面
  musicPlayer.appendChild(playBtn);
  document.body.appendChild(musicPlayer);
  document.body.appendChild(audio);
  
  // 添加加载完成事件监听
  audio.addEventListener('loadedmetadata', () => {
    console.log('🎵 音乐文件已加载完成');
  });
  
  // 添加错误事件监听
  audio.addEventListener('error', (err) => {
    console.error('🎵 音乐加载失败:', err);
    // 可以添加用户提示
    playBtn.title = '音乐加载失败，请检查文件路径';
  });
  
  // 播放状态管理
  let isPlaying = false;
  
  // 播放/暂停功能
  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playBtn.innerHTML = '<i class="fas fa-music text-xl"></i>';
      appState.isMusicPlaying = false;
      console.log('⏸️  音乐已暂停');
    } else {
      audio.play().then(() => {
        playBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
        appState.isMusicPlaying = true;
        console.log('▶️  音乐已开始播放');
      }).catch(err => {
        console.error('❌ 音乐播放失败:', err);
        alert('音乐播放失败，请点击播放按钮重试');
      });
    }
    isPlaying = !isPlaying;
  });
  
  // 添加键盘快捷键（M键）
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      playBtn.click();
    }
  });
  
  console.log('✅ 音乐播放器初始化完成');
  return true;
}

// 初始化导航功能（包含页面切换）
function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const mobileMenuBtn = document.getElementById('mobile-menu-button') || document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mainContent = document.getElementById('main-content');
  let currentPageIndex = 0;
  let isProgrammaticScroll = false; // 标记是否为程序触发的滚动
  
  console.log('🔍 导航初始化检查:');
  console.log('- mobileMenuBtn 元素存在:', !!mobileMenuBtn);
  console.log('- mobileMenu 元素存在:', !!mobileMenu);
  
  // 定义所有页面（修正首页ID）
  const pages = ['#home', '#love-story', '#anniversary-countdown', '#photo-wall', '#love-letters'];
  
  // 移动端菜单切换 - 增强版
  if (mobileMenuBtn && mobileMenu) {
    // 移除可能存在的旧监听器
    const newBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
    
    // 重新获取引用
    const updatedMobileMenuBtn = document.getElementById('mobile-menu-button');
    
    // 添加新的点击事件监听器
    updatedMobileMenuBtn.addEventListener('click', (e) => {
      console.log('📱 移动端菜单按钮被点击');
      e.stopPropagation(); // 阻止事件冒泡
      
      // 直接设置显示/隐藏状态，不使用toggle以确保可靠性
      const isHidden = mobileMenu.classList.contains('hidden');
      
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        updatedMobileMenuBtn.classList.add('active');
        updatedMobileMenuBtn.setAttribute('aria-expanded', 'true');
        console.log('✅ 菜单已显示');
      } else {
        mobileMenu.classList.add('hidden');
        updatedMobileMenuBtn.classList.remove('active');
        updatedMobileMenuBtn.setAttribute('aria-expanded', 'false');
        console.log('✅ 菜单已隐藏');
      }
    });
    
    // 添加点击页面其他区域关闭菜单的功能
    document.addEventListener('click', (e) => {
      if (updatedMobileMenuBtn && 
          !mobileMenu.classList.contains('hidden') && 
          !updatedMobileMenuBtn.contains(e.target) && 
          !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        updatedMobileMenuBtn.classList.remove('active');
        updatedMobileMenuBtn.setAttribute('aria-expanded', 'false');
        console.log('✅ 点击页面其他区域关闭菜单');
      }
    });
    
  } else {
    console.error('❌ 移动端菜单元素未找到，无法初始化菜单功能');
  }
  
  // 导航链接点击事件
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡
      
      console.log('🔗 导航链接被点击:', link.getAttribute('href'));
      
      // 关闭移动端菜单
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const btn = document.getElementById('mobile-menu-button');
        if (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
        console.log('✅ 导航链接点击后关闭菜单');
      }
      
      // 获取目标页面索引
      const targetId = link.getAttribute('href');
      const targetIndex = pages.indexOf(targetId);
      
      if (targetIndex !== -1) {
        console.log('🔄 导航到页面索引:', targetIndex);
        navigateToPage(targetIndex);
      } else {
        console.log('⚠️ 未找到目标页面索引:', targetId);
        // 直接滚动到锚点
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          console.log('🎯 直接滚动到锚点元素');
          window.scrollTo({
            top: targetElement.offsetTop - 80, // 考虑导航栏高度
            behavior: 'smooth'
          });
        }
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