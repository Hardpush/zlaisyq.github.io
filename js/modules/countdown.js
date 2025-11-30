// 倒计时模块 - 处理纪念日倒计时功能
const countdownModule = {
  // 初始化倒计时模块
  init(appState, config) {
    this.appState = appState;
    this.config = config;
    this.startCountdown();
  },
  
  // 开始倒计时
  startCountdown() {
    // 设置纪念日日期（可以从配置中获取）
    const anniversaryDate = new Date('2022-01-20T00:00:00');
    const countdownElement = document.getElementById('countdown-container');
    
    if (!countdownElement) {
      console.warn('⚠️ 倒计时容器未找到');
      return;
    }
    
    // 立即更新一次
    this.updateCountdown(anniversaryDate, countdownElement);
    
    // 每分钟更新一次倒计时
    setInterval(() => {
      this.updateCountdown(anniversaryDate, countdownElement);
    }, 60000);
  },
  
  // 更新倒计时显示
  updateCountdown(targetDate, container) {
    // 计算时间差
    const now = new Date();
    const diff = now - targetDate;
    
    if (diff < 0) {
      container.innerHTML = '<p class="text-gray-600">即将开始...</p>';
      return;
    }
    
    // 计算年、月、日、小时、分钟
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    
    // 计算年数（假设每年365天）
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    
    // 计算月数（简化计算，每月30天）
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;
    
    // 计算小时、分钟、秒
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    
    // 更新UI
    this.renderCountdownUI(container, years, months, days, hours, minutes);
  },
  
  // 渲染倒计时UI
  renderCountdownUI(container, years, months, days, hours, minutes) {
    const countdownHTML = `
      <div class="countdown-cards grid grid-cols-3 md:grid-cols-6 gap-4">
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="countdown-number text-3xl font-bold text-rose-500">${years}</div>
          <div class="countdown-label text-sm text-gray-600">年</div>
        </div>
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="countdown-number text-3xl font-bold text-rose-500">${months}</div>
          <div class="countdown-label text-sm text-gray-600">月</div>
        </div>
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="countdown-number text-3xl font-bold text-rose-500">${days}</div>
          <div class="countdown-label text-sm text-gray-600">日</div>
        </div>
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="countdown-number text-3xl font-bold text-rose-500">${hours}</div>
          <div class="countdown-label text-sm text-gray-600">时</div>
        </div>
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center">
          <div class="countdown-number text-3xl font-bold text-rose-500">${minutes}</div>
          <div class="countdown-label text-sm text-gray-600">分</div>
        </div>
        <div class="countdown-card bg-white rounded-lg shadow-lg p-4 text-center relative">
          <div class="countdown-number text-3xl font-bold text-rose-500">❤</div>
          <div class="countdown-label text-sm text-gray-600">爱</div>
          <div class="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
        </div>
      </div>
      <div class="mt-4 text-center text-gray-700">
        <p>我们已经相爱 <span class="font-bold text-rose-600">${years}年${months}个月${days}天</span> 啦！</p>
      </div>
    `;
    
    container.innerHTML = countdownHTML;
    
    // 添加进入动画
    this.addCountdownAnimation();
  },
  
  // 添加倒计时动画
  addCountdownAnimation() {
    const cards = document.querySelectorAll('.countdown-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`;
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    });
  },
  
  // 计算准确的月数（更精确的计算方式）
  calculateExactMonths(startDate, endDate) {
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    
    // 调整天数差异
    if (endDate.getDate() < startDate.getDate()) {
      months--;
    }
    
    return months;
  }
};

export default countdownModule;