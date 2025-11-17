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


}

// 加载照片墙功能
function loadPhotoGallery() {
  const photoGallery = document.getElementById('photo-gallery');
  if (!photoGallery) return;

  // 清空现有内容
  photoGallery.innerHTML = '';

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
  
  // 测试第一张图片的完整路径
  const firstImageUrl = baseUrl.includes('images/') ? baseUrl + photoFiles[0] : baseUrl + `images/${photoFiles[0]}`;
  console.log('第一张图片URL:', firstImageUrl);
  
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
    const photoDiv = document.createElement('div');
    photoDiv.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
    
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
    // 设置更激进的懒加载策略
    img.loading = 'lazy';
    img.decoding = 'async';
    img.fetchPriority = index < 4 ? 'high' : 'low'; // 前4张高优先级
    
    console.log(`创建图片 ${index + 1}: ${fullUrl}`);
    
    // 进度跟踪已在loadPhoto函数中处理，无需额外代码
    img.addEventListener('load', function() {
      console.log(`✅ 图片加载成功: ${fileName}`);
      placeholder.style.display = 'none';
      this.style.display = 'block';
      updateProgress(); // 直接更新进度
    });
    
    // 加载失败时的处理
    img.addEventListener('error', function() {
      console.error(`❌ 图片加载失败: ${fileName}`);
      placeholder.innerHTML = `
        <div class="text-center text-red-600">
          <div class="text-lg mb-2">😔</div>
          <div class="text-sm">加载失败</div>
          <div class="text-xs mt-1">${fileName}</div>
        </div>
      `;
      updateProgress(); // 即使失败也要更新进度
    });
    
    photoDiv.appendChild(img);
    photoGallery.appendChild(photoDiv);
  };
  
  // 立即加载前12张图片
  const priorityPhotos = photoFiles.slice(0, 12);
  const remainingPhotos = photoFiles.slice(12);
  
  console.log(`优先加载前${priorityPhotos.length}张图片，延迟加载其余${remainingPhotos.length}张`);
  
  // 加载优先图片
  priorityPhotos.forEach((fileName, index) => {
    loadPhoto(fileName, index);
  });
  
  // 延迟加载其余图片
  if (remainingPhotos.length > 0) {
    setTimeout(() => {
      console.log('开始加载剩余图片...');
      remainingPhotos.forEach((fileName, index) => {
        setTimeout(() => {
          loadPhoto(fileName, index + 12);
        }, index * 200); // 每200ms加载一张
      });
    }, 2000); // 2秒后开始加载剩余图片
  }
  
  console.log('所有照片元素已创建完成');
  
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
  const updateProgress = () => {
    loadedCount++;
    const percentage = (loadedCount / photoFiles.length) * 100;
    document.getElementById('progress-bar').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${loadedCount}/${photoFiles.length}`;
    
    if (loadedCount === photoFiles.length) {
      setTimeout(() => {
        progressDiv.style.opacity = '0';
        setTimeout(() => {
          if (progressDiv.parentNode) {
            progressDiv.parentNode.removeChild(progressDiv);
          }
        }, 300);
      }, 1000);
    }
  };
  
  // 创建进度更新函数，确保所有图片都计入进度
  const trackImageProgress = (img) => {
    if (img.complete) {
      updateProgress();
    } else {
      img.addEventListener('load', updateProgress);
      img.addEventListener('error', updateProgress);
    }
  };
  
  // 延迟检查图片元素，确保它们已经添加到DOM
  setTimeout(() => {
    const allImages = document.querySelectorAll('#photo-gallery img');
    console.log(`找到 ${allImages.length} 张图片，开始跟踪进度`);
    allImages.forEach(trackImageProgress);
  }, 100);
}

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
  // 初始化密码保护
  initPasswordProtection();
});