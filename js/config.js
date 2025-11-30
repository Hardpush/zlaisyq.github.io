// 网站配置文件 - 集中管理所有常量和配置
const config = {
  // 网站基本信息
  siteInfo: {
    title: '我们的爱情故事',
    description: '记录我们相爱的每一天',
    author: '恋人',
    
  },
  
  // 调试模式
  debug: true,
  
  // 密码配置
  password: {
    // SHA-256哈希值（示例密码：'123456'）
    hash: '2c035b0699a84964e6d27c72e41426f4d8057dfc06a0a8e57793143f4a94d3aa',
    maxAttempts: 5,
    lockoutTime: 300000, // 5分钟锁定时间（毫秒）
  },
  
  // 纪念日配置
  anniversary: {
    date: '2022-01-20T00:00:00', // 起始日期
    
  },
  
  // 媒体配置
  media: {
    // 图片配置
    images: {
      basePath: '../images/',
      defaultImage: '../images/default.jpg',
      lazyLoading: true,
      placeholderColor: '#f3f4f6',
    },
    
    // 音乐配置
    music: {
      basePath: '../music/',
      backgroundTracks: [
        'music1.mp3',
        'music2.mp3',
        'music3.mp3'
      ],
      autoPlay: false, // 自动播放（受浏览器策略限制）
      volume: 0.3, // 默认音量（0-1）
    },
  },
  
  // 情书配置
  loveLetters: {
    basePath: '../txt/',
    limitPerPage: 6,
    autoPlayMusic: true,
    
  },
  
  // UI配置
  ui: {
    // 动画配置
    animations: {
      enable: true,
      duration: {
        short: 300,
        medium: 500,
        long: 800,
      },
    },
    
    // 响应式断点
    breakpoints: {
      mobile: 640,
      tablet: 768,
      desktop: 1024,
      largeDesktop: 1280,
    },
    
    // 主题颜色
    colors: {
      primary: '#f43f5e', // 玫瑰红
      secondary: '#8b5cf6', // 紫色
      background: '#ffffff',
      text: '#374151',
      textLight: '#9ca3af',
      
    },
  },
  
  // 性能配置
  performance: {
    imageCache: true,
    preloadCriticalImages: true,
    codeSplitting: true,
  },
  
  // 错误处理配置
  errorHandling: {
    showDetailedErrors: false, // 生产环境应设为false
    logErrors: true,
  },
};

// 导出配置对象
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  // Node.js环境
  module.exports = config;
} else {
  // 浏览器环境
  window.appConfig = config;
}