// 修复版密码验证功能
console.log('🔒 加载修复版密码验证功能');

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM加载完成，初始化修复版密码验证');
  
  // 获取密码相关元素
  const passwordOverlay = document.getElementById('password-overlay');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  const mainContent = document.getElementById('main-content');
  
  // 检查所有必要元素是否存在
  console.log('🔍 检查密码相关元素:');
  console.log('- 密码覆盖层:', !!passwordOverlay);
  console.log('- 密码表单:', !!passwordForm);
  console.log('- 密码输入框:', !!passwordInput);
  console.log('- 错误提示:', !!passwordError);
  console.log('- 主内容区域:', !!mainContent);
  
  // 如果任何必要元素不存在，记录错误并退出
  if (!passwordOverlay || !passwordForm || !passwordInput || !passwordError || !mainContent) {
    console.error('❌ 缺少必要的密码验证元素，无法初始化密码验证功能');
    return;
  }
  
  // 正确密码
  const correctPassword = '5201314';
  console.log('🔑 正确密码已设置');
  
  // 检查是否已经验证过密码
  const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
  console.log('📋 已验证状态:', isAuthenticated);
  
  // 如果已经验证过，直接显示主内容
  if (isAuthenticated) {
    console.log('✅ 已经验证过密码，直接显示主内容');
    showMainContent();
    return;
  }
  
  // 密码表单提交处理
  passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('📝 表单提交事件触发');
    
    const enteredPassword = passwordInput.value.trim();
    console.log('🔐 输入的密码:', enteredPassword);
    console.log('🔍 密码匹配检查:', enteredPassword === correctPassword);
    
    if (enteredPassword === correctPassword) {
      // 密码正确
      console.log('✅ 密码正确！');
      sessionStorage.setItem('authenticated', 'true');
      passwordError.classList.add('hidden');
      showMainContent();
    } else {
      // 密码错误
      console.log('❌ 密码错误！');
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
  
  console.log('✅ 密码验证事件监听器已设置');
  
  // 显示主内容函数
  function showMainContent() {
    console.log('🚀 开始显示主内容');
    
    try {
      // 淡出密码覆盖层
      passwordOverlay.style.opacity = '0';
      passwordOverlay.style.transition = 'opacity 0.5s ease-out';
      
      setTimeout(() => {
        console.log('📦 隐藏密码覆盖层');
        passwordOverlay.classList.add('hidden');
        
        console.log('📋 显示主内容区域');
        mainContent.classList.remove('hidden');
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
          console.log('✨ 主内容完全显示');
          mainContent.style.opacity = '1';
          
          // 尝试初始化其他网站功能
          try {
            if (typeof initMainWebsite === 'function') {
              console.log('🌐 尝试初始化主网站功能');
              initMainWebsite();
            }
          } catch (error) {
            console.log('ℹ️  初始化其他功能时出现问题，但不影响页面访问:', error);
          }
        }, 100);
      }, 500);
    } catch (error) {
      console.error('❌ 显示主内容时发生错误:', error);
      // 即使出错，也尝试直接显示主内容
      passwordOverlay.style.display = 'none';
      mainContent.style.display = 'block';
    }
  }
});