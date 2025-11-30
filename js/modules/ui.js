// 用户界面模块
const uiModule = {
  // 初始化UI模块
  init(appState, config) {
    this.appState = appState;
    this.config = config;
    this.initNavigation();
    this.initScrollAnimations();
    this.setupScrollListener();
  },
  
  // 初始化导航功能
    initNavigation() {
      try {
        // 使用性能优化模块的任务调度
        const scheduleTask = window.performanceOptimizer?.scheduleTask || ((fn) => fn());
        
        scheduleTask(() => {
          const navLinks = document.querySelectorAll('nav a');
          const mobileMenuBtn = document.getElementById('mobile-menu-button') || document.getElementById('mobile-menu-btn');
          const mobileMenu = document.getElementById('mobile-menu');
          let currentPageIndex = 0;
          
          // 定义所有页面
          const pages = ['#home', '#love-story', '#anniversary-countdown', '#photo-wall', '#love-letters'];
          
          // 移动端菜单切换 - 使用事件委托优化
          if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
              // 使用性能优化模块的DOM操作批处理
              window.performanceOptimizer?.batchDOMUpdates?.(() => {
                mobileMenu.classList.toggle('hidden');
                mobileMenuBtn.classList.toggle('active');
              });
            });
          }
          
          // 导航链接点击事件
          navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
              e.preventDefault();
              
              // 关闭移动端菜单
              if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                window.performanceOptimizer?.batchDOMUpdates?.(() => {
                  mobileMenu.classList.add('hidden');
                  if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                });
              }
              
              // 获取目标页面索引
              const targetId = link.getAttribute('href');
              const targetIndex = pages.indexOf(targetId);
              
              if (targetIndex !== -1) {
                this.navigateToPage(targetIndex, pages);
              }
            });
          });
          
          // 键盘导航 - 使用防抖优化
          const debouncedKeyNavigation = window.performanceOptimizer?.debounce?.(() => {
            // 键盘导航处理逻辑已移至navigateToPage方法
          }, 100);
          
          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
              this.navigateToPage(currentPageIndex + 1, pages);
            } else if (e.key === 'ArrowUp') {
              this.navigateToPage(currentPageIndex - 1, pages);
            }
          });
          
          console.log('✅ 导航功能初始化成功 (已优化)');
        });
      } catch (error) {
        const errorMessage = '导航功能初始化失败';
        console.error(`❌ ${errorMessage}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.handleError(errorMessage, error);
        }
      }
    },
  
  // 页面切换函数
    navigateToPage(index, pages) {
      try {
        if (index < 0 || index >= pages.length) {
          console.warn('页面索引超出范围');
          return;
        }
      
        // 使用性能优化模块的任务调度
        window.performanceOptimizer?.scheduleTask?.(() => {
          // 直接滚动到目标页面 - 使用性能优化的滚动方法
          const targetElement = document.querySelector(pages[index]);
          if (targetElement) {
            // 使用requestAnimationFrame优化滚动性能
            window.requestAnimationFrame(() => {
              targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            });
          } else {
            const errorMessage = `目标页面 ${pages[index]} 未找到`;
            console.error(errorMessage);
            
            if (window.errorHandler) {
              window.errorHandler.showWarning(errorMessage, '导航错误');
            }
            return;
          }
        });
      
        // 更新活动导航项 - 使用批处理更新
        window.performanceOptimizer?.batchDOMUpdates?.(() => {
          this.updateActiveNavItem(pages[index]);
        });
      } catch (error) {
        const errorMessage = '页面导航过程中发生错误';
        console.error(`${errorMessage}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.handleError(errorMessage, error);
        }
      }
    },
  
  // 更新活动导航项
  updateActiveNavItem(activeId) {
    const navLinks = document.querySelectorAll('nav a');
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
  },
  
  // 初始化滚动动画
    initScrollAnimations() {
      try {
        // 使用性能优化模块进行任务调度
        window.performanceOptimizer?.scheduleTask?.(() => {
          const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          };
          
          // 使用性能优化模块的节流函数处理IntersectionObserver回调
          const throttledCallback = window.performanceOptimizer?.throttle?.(entries => {
            // 使用批处理DOM更新优化性能
            window.performanceOptimizer?.batchDOMUpdates?.(() => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                  // 动画完成后取消观察，减少不必要的计算
                  observer.unobserve(entry.target);
                }
              });
            });
          }, 100);
          
          const observer = new IntersectionObserver(throttledCallback, observerOptions);
          
          // 使用requestAnimationFrame优化初始样式设置
          window.requestAnimationFrame(() => {
            // 观察所有需要动画的元素
            const animatedElements = document.querySelectorAll('.animate-fade-in');
            
            // 使用分片处理大量元素
            const processBatch = (startIndex) => {
              const batchSize = 50;
              const endIndex = Math.min(startIndex + batchSize, animatedElements.length);
              
              for (let i = startIndex; i < endIndex; i++) {
                const el = animatedElements[i];
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
              }
              
              if (endIndex < animatedElements.length) {
                // 延迟处理下一批元素，避免阻塞主线程
                setTimeout(() => processBatch(endIndex), 50);
              }
            };
            
            processBatch(0);
          });
          
          console.log('✅ 滚动动画初始化成功 (已优化)');
        });
      } catch (error) {
        const errorMessage = '初始化滚动动画时发生错误';
        console.error(`${errorMessage}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.showWarning('滚动动画可能无法正常工作', '动画初始化问题');
        }
      }
    },
  
  // 设置滚动监听
    setupScrollListener() {
      try {
        // 使用性能优化模块的节流函数优化滚动监听
        const throttledScrollHandler = window.performanceOptimizer?.throttle?.(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          this.handleScrollEffects(scrollTop);
        }, 100); // 100ms节流，减少性能消耗
        
        // 使用捕获模式并优化事件监听
        window.addEventListener('scroll', throttledScrollHandler, {
          passive: true, // 告诉浏览器此事件监听器不会阻止默认滚动行为
          capture: false
        });
        
        // 添加事件监听器清理逻辑
        if (this.appState) {
          this.appState.addCleanupFunction(() => {
            window.removeEventListener('scroll', throttledScrollHandler);
          });
        }
        
        console.log('✅ 滚动监听已设置并优化');
      } catch (error) {
        const errorMessage = '设置滚动监听时发生错误';
        console.error(`${errorMessage}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.handleError(errorMessage, error);
        }
      }
    },
  
  // 处理滚动效果
  handleScrollEffects(scrollTop) {
    // 在这里可以添加滚动时的各种效果
    // 例如：导航栏透明度变化、元素淡入淡出等
  },
  
  // 添加区域进入按钮
    addSectionEnterButton(sectionId, buttonText) {
      try {
        // 使用性能优化模块的任务调度
        window.performanceOptimizer?.scheduleTask?.(() => {
          const section = document.getElementById(sectionId);
          if (!section) {
            const errorMessage = `添加按钮失败：区域 ${sectionId} 未找到`;
            console.warn(errorMessage);
            
            if (window.errorHandler) {
              window.errorHandler.showWarning(errorMessage, 'UI组件错误');
            }
            return;
          }
        
          // 使用文档片段减少DOM操作次数
          const fragment = document.createDocumentFragment();
          
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'flex justify-center mt-8';
        
          const button = document.createElement('a');
          button.href = `#${sectionId}`;
          button.className = 'px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all duration-300 transform hover:scale-105';
          button.textContent = buttonText || '查看详情';
          
          // 优化点击事件 - 使用事件委托
          button.addEventListener('click', (e) => {
            e.preventDefault();
            // 使用性能优化的滚动方法
            window.performanceOptimizer?.smoothScrollTo?.(sectionId);
          });
        
          buttonContainer.appendChild(button);
          fragment.appendChild(buttonContainer);
          
          const container = section.querySelector('.container');
          if (container) {
            // 使用批处理DOM更新
            window.performanceOptimizer?.batchDOMUpdates?.(() => {
              container.appendChild(fragment);
            });
          } else {
            console.warn(`添加按钮失败：区域 ${sectionId} 中未找到.container元素`);
          }
        });
      } catch (error) {
        const errorMessage = '添加区域进入按钮时发生错误';
        console.error(`${errorMessage}:`, error);
        
        if (window.errorHandler) {
          window.errorHandler.handleError(errorMessage, error);
        }
      }
    }
};

export default uiModule;