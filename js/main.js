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

  // 导航栏滚动效果
  window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('py-2', 'shadow-md');
      navbar.classList.remove('py-3', 'shadow-sm');
    } else {
      navbar.classList.add('py-3', 'shadow-sm');
      navbar.classList.remove('py-2', 'shadow-md');
    }
  });

  // 移动端菜单切换
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
  });

  // 倒计时功能
  function updateCountdown() {
    const anniversaryDate = new Date('2025-11-16T00:00:00');
    const now = new Date();
    const diff = anniversaryDate - now;
    
    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  // 初始化倒计时并每秒更新
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 爱情数据图表
  const ctx = document.getElementById('love-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
      datasets: [{
        label: '幸福指数',
        data: [70, 75, 82, 88, 92, 95, 96, 97, 98],
        borderColor: '#994dff',
        backgroundColor: 'rgba(153, 77, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 50,
          max: 100
        }
      }
    }
  });

  // 照片模态框功能
  const photoModal = document.getElementById('photo-modal');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelPhotoBtn = document.getElementById('cancel-photo-btn');
  const browsePhotoBtn = document.getElementById('browse-photo-btn');
  const photoUpload = document.getElementById('photo-upload');
  const photoPreview = document.getElementById('photo-preview');
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  const removePhotoBtn = document.getElementById('remove-photo-btn');
  const savePhotoBtn = document.getElementById('save-photo-btn');

  // 打开模态框
  addPhotoBtn.addEventListener('click', function() {
    photoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  // 关闭模态框
  function closeModal() {
    photoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeModalBtn.addEventListener('click', closeModal);
  cancelPhotoBtn.addEventListener('click', closeModal);

  // 照片预览
  browsePhotoBtn.addEventListener('click', function() {
    photoUpload.click();
  });

  photoUpload.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreviewContainer.classList.remove('hidden');
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // 移除照片
  removePhotoBtn.addEventListener('click', function() {
    photoPreview.src = '';
    photoPreviewContainer.classList.add('hidden');
    photoUpload.value = '';
  });

  // 保存照片（这里只是模拟，实际项目需要后端支持）
  savePhotoBtn.addEventListener('click', function() {
    alert('照片保存功能需要后端支持，此处为模拟');
    closeModal();
  });

  // 祝福表单提交
  const messageForm = document.getElementById('message-form');
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('祝福提交功能需要后端支持，此处为模拟');
    messageForm.reset();
  });

  // 加载更多祝福
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.addEventListener('click', function() {
    alert('加载更多祝福功能需要后端支持，此处为模拟');
  });
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

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化密码保护
  initPasswordProtection();
  // 导航栏滚动效果
  window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('py-2', 'shadow-md');
      navbar.classList.remove('py-3', 'shadow-sm');
    } else {
      navbar.classList.add('py-3', 'shadow-sm');
      navbar.classList.remove('py-2', 'shadow-md');
    }
  });

  // 移动端菜单切换
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
  });

  // 倒计时功能
  function updateCountdown() {
    const anniversaryDate = new Date('2025-11-16T00:00:00');
    const now = new Date();
    const diff = anniversaryDate - now;
    
    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  // 初始化倒计时并每秒更新
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 爱情数据图表
  const ctx = document.getElementById('love-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
      datasets: [{
        label: '幸福指数',
        data: [70, 75, 82, 88, 92, 95, 96, 97, 98],
        borderColor: '#994dff',
        backgroundColor: 'rgba(153, 77, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 50,
          max: 100
        }
      }
    }
  });

  // 照片模态框功能
  const photoModal = document.getElementById('photo-modal');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelPhotoBtn = document.getElementById('cancel-photo-btn');
  const browsePhotoBtn = document.getElementById('browse-photo-btn');
  const photoUpload = document.getElementById('photo-upload');
  const photoPreview = document.getElementById('photo-preview');
  const photoPreviewContainer = document.getElementById('photo-preview-container');
  const removePhotoBtn = document.getElementById('remove-photo-btn');
  const savePhotoBtn = document.getElementById('save-photo-btn');

  // 打开模态框
  addPhotoBtn.addEventListener('click', function() {
    photoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  // 关闭模态框
  function closeModal() {
    photoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeModalBtn.addEventListener('click', closeModal);
  cancelPhotoBtn.addEventListener('click', closeModal);

  // 照片预览
  browsePhotoBtn.addEventListener('click', function() {
    photoUpload.click();
  });

  photoUpload.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.src = e.target.result;
        photoPreviewContainer.classList.remove('hidden');
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // 移除照片
  removePhotoBtn.addEventListener('click', function() {
    photoPreview.src = '';
    photoPreviewContainer.classList.add('hidden');
    photoUpload.value = '';
  });

  // 保存照片（这里只是模拟，实际项目需要后端支持）
  savePhotoBtn.addEventListener('click', function() {
    alert('照片保存功能需要后端支持，此处为模拟');
    closeModal();
  });

  // 祝福表单提交
  const messageForm = document.getElementById('message-form');
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('祝福提交功能需要后端支持，此处为模拟');
    messageForm.reset();
  });

  // 加载更多祝福
  const loadMoreBtn = document.getElementById('load-more-btn');
  loadMoreBtn.addEventListener('click', function() {
    alert('加载更多祝福功能需要后端支持，此处为模拟');
  });
});