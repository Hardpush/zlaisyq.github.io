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
    console.log('检测到主机名:', hostname);
    
    if (hostname.includes('github.io')) {
      // GitHub Pages环境
      const pathParts = window.location.pathname.split('/');
      pathParts.pop(); // 移除文件名
      const baseUrl = window.location.origin + pathParts.join('/') + '/';
      console.log('GitHub Pages环境，基础URL:', baseUrl);
      return baseUrl;
    } else if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
      // 本地环境
      console.log('本地环境，使用相对路径');
      return './';
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
  const firstImageUrl = baseUrl + `images/${photoFiles[0]}`;
  console.log('第一张图片URL:', firstImageUrl);
  
  // 创建测试图片来验证路径
  const testImg = new Image();
  testImg.onload = function() {
    console.log('✅ 路径测试成功，图片可以正常加载');
  };
  testImg.onerror = function() {
    console.error('❌ 路径测试失败，请检查图片路径');
    console.error('尝试的URL:', this.src);
  };
  testImg.src = firstImageUrl;
  
  // 最简单的加载方式：直接创建所有图片元素
  photoFiles.forEach((fileName, index) => {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300';
    
    const img = document.createElement('img');
    const fullUrl = baseUrl + `images/${fileName}`;
    img.src = fullUrl;
    img.alt = `婚纱照 ${index + 1}`;
    img.className = 'w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110';
    // 移除懒加载，图片立即加载
    
    console.log(`创建图片 ${index + 1}: ${fullUrl}`);
    
    // 详细的成功和错误处理
    img.addEventListener('load', function() {
      console.log(`✅ 图片加载成功: ${fileName}`);
    });
    
    img.addEventListener('error', function() {
      console.error(`❌ 图片加载失败: ${fileName}`);
      console.error(`失败的URL: ${this.src}`);
      this.style.display = 'none';
      photoDiv.innerHTML = `<div class="w-full h-64 bg-red-100 flex flex-col items-center justify-center text-red-600">
        <div class="text-sm mb-2">加载失败</div>
        <div class="text-xs">${fileName}</div>
      </div>`;
    });
    
    photoDiv.appendChild(img);
    photoGallery.appendChild(photoDiv);
  });
  
  console.log('所有照片元素已创建完成');
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