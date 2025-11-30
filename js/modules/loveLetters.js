// 情书模块 - 处理情书相关功能
const loveLettersModule = {
  // 初始化情书模块
  init(appState, config) {
    this.appState = appState;
    this.config = config;
    this.letterData = [];
    this.letterAudio = null;
    this.displayLettersList();
    this.setupEventListeners();
  },
  
  // 显示情书列表
  displayLettersList() {
    const lettersContainer = document.getElementById('letters-container');
    if (!lettersContainer) {
      console.error('❌ 情书容器未找到');
      return;
    }
    
    // 模拟情书数据
    this.letterData = this.getMockLetterData();
    
    // 清空容器
    lettersContainer.innerHTML = '';
    
    // 创建情书卡片
    this.letterData.forEach((letter, index) => {
      const card = this.createLetterCard(letter, index);
      lettersContainer.appendChild(card);
    });
  },
  
  // 获取模拟情书数据
  getMockLetterData() {
    return [
      { id: 'letter1', title: '致我最爱的人', date: '2024-01-15', author: '恋人A', preview: '亲爱的，今天是我们在一起的第...' },
      { id: 'letter2', title: '冬日的温暖回忆', date: '2024-01-10', author: '恋人B', preview: '记得那个下雪的夜晚，我们一起...' },
      { id: 'letter3', title: '一封未寄出的信', date: '2024-01-05', author: '恋人A', preview: '有时候，有些话想说却又说不出口...' },
      { id: 'letter4', title: '谢谢你的陪伴', date: '2023-12-25', author: '恋人B', preview: '在过去的一年里，感谢有你的陪伴...' },
      { id: 'letter5', title: '新年的期许', date: '2023-12-31', author: '恋人A', preview: '新的一年，我希望我们能够...' },
      { id: 'letter6', title: '回忆我们的相遇', date: '2023-11-20', author: '恋人B', preview: '还记得我们第一次见面的场景吗？...' }
    ];
  },
  
  // 创建情书卡片
  createLetterCard(letter, index) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 letter-card';
    card.setAttribute('data-letter-id', letter.id);
    
    // 随机选择背景图
    const backgrounds = [
      'bg-gradient-to-br from-pink-50 to-rose-100',
      'bg-gradient-to-br from-blue-50 to-purple-100',
      'bg-gradient-to-br from-yellow-50 to-orange-100'
    ];
    const backgroundClass = backgrounds[index % backgrounds.length];
    
    card.innerHTML = `
      <div class="${backgroundClass} p-6 h-full flex flex-col">
        <h3 class="text-xl font-bold text-gray-800 mb-2">${letter.title}</h3>
        <p class="text-gray-600 text-sm mb-3">${letter.date} · ${letter.author}</p>
        <p class="text-gray-700 flex-grow">${letter.preview}</p>
        <button class="mt-4 px-4 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors view-letter-btn">
          阅读情书
        </button>
      </div>
    `;
    
    // 添加点击事件
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-letter-btn') || card.classList.contains('letter-card')) {
        this.openLetterModal(letter.id);
      }
    });
    
    return card;
  },
  
  // 设置事件监听器
  setupEventListeners() {
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeLetterModal();
      }
    });
  },
  
  // 打开情书模态框
  openLetterModal(letterId) {
    // 停止当前播放的音乐
    this.stopLetterMusic();
    
    // 创建模态框
    const modal = this.createLetterModal();
    document.body.appendChild(modal);
    
    // 加载情书内容
    this.loadLetterContent(letterId, modal);
    
    // 播放情书背景音乐
    this.letterAudio = this.loadLetterMusic(letterId);
    this.letterAudio.play().catch(error => {
      console.warn('⚠️ 情书音乐播放被阻止:', error);
    });
  },
  
  // 创建情书模态框
  createLetterModal() {
    const modal = document.createElement('div');
    modal.id = 'letter-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 letter-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'letter-title');
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6 relative animate-zoom-in">
        <button id="close-letter-modal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl focus:outline-none" aria-label="关闭">
          ×
        </button>
        <div id="letter-content" class="mt-4">
          <div class="loading-spinner text-center py-10">
            <div class="inline-block w-10 h-10 border-4 border-gray-200 border-t-4 border-rose-500 rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-600">正在加载情书内容...</p>
          </div>
        </div>
      </div>
    `;
    
    // 关闭按钮事件
    const closeBtn = modal.querySelector('#close-letter-modal');
    closeBtn.addEventListener('click', this.closeLetterModal.bind(this));
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeLetterModal();
      }
    });
    
    return modal;
  },
  
  // 加载情书内容
  loadLetterContent(letterId, modal) {
    const contentContainer = modal.querySelector('#letter-content');
    
    // 模拟加载延迟
    setTimeout(() => {
      // 模拟情书内容
      const letter = this.letterData.find(l => l.id === letterId);
      
      if (letter) {
        const content = this.getMockLetterContent(letter);
        contentContainer.innerHTML = `
          <h2 id="letter-title" class="text-2xl font-bold text-rose-600 text-center mb-4">${letter.title}</h2>
          <p class="text-gray-500 text-center text-sm mb-6">${letter.date} · ${letter.author}</p>
          <div class="prose prose-rose max-w-none">
            ${content}
          </div>
        `;
      } else {
        contentContainer.innerHTML = `
          <div class="text-center text-gray-600">
            <p>情书内容不存在</p>
          </div>
        `;
      }
    }, 800);
  },
  
  // 获取模拟情书内容
  getMockLetterContent(letter) {
    const contents = {
      'letter1': `
        <p>亲爱的，</p>
        <p>今天是我们在一起的第365天，时间过得真快。回想起我们相识的点点滴滴，心中充满了感激和幸福。</p>
        <p>记得那天在咖啡厅，你不小心撞到了我，咖啡洒在我的衬衫上。你紧张得不知所措，一直道歉，那样子真的很可爱。也就是从那天开始，我们的故事拉开了序幕。</p>
        <p>这一年来，我们一起经历了很多：一起看日出日落，一起旅行，一起度过那些平凡却温馨的日子。有欢笑，也有泪水，但每一刻都让我更加确定，你就是我想要共度一生的人。</p>
        <p>谢谢你一直以来的陪伴和包容，谢谢你在我失落时给予鼓励，在我开心时与我分享。我爱你，不只是今天，而是每一天。</p>
        <p>永远爱你的，<br>恋人A</p>
      `,
      'letter2': `
        <p>最亲爱的，</p>
        <p>窗外飘着鹅毛大雪，我坐在温暖的房间里，想起了那个下雪的夜晚。</p>
        <p>那天我们一起在雪地里漫步，你兴奋得像个孩子，一会儿堆雪人，一会儿打雪仗。你的脸颊被冻得通红，但笑容却比任何时候都灿烂。我们在雪地上写下彼此的名字，约定永远不分开。</p>
        <p>虽然已经过去很久，但那个夜晚的每一个细节我都记得清清楚楚。雪花落在你的睫毛上，你呼出的白气，还有我们踩在雪地上发出的咯吱声，这一切都仿佛发生在昨天。</p>
        <p>这个冬天，因为有你，变得格外温暖。</p>
        <p>爱你的，<br>恋人B</p>
      `,
      'letter3': `
        <p>亲爱的，</p>
        <p>有时候，有些话想说却又说不出口，只能写在信里。</p>
        <p>我知道最近我们之间有些小矛盾，我也知道这让你感到不开心。其实我心里也很难过，但每次想要道歉，却又不知道该如何开口。</p>
        <p>我想告诉你，我很珍惜我们之间的感情，也很感谢你一直以来的付出。我知道我有很多缺点，谢谢你的包容和理解。我会努力变得更好，为了你，也为了我们的未来。</p>
        <p>希望你能明白我的心意，希望我们能够像以前一样，携手面对一切。</p>
        <p>永远爱你的，<br>恋人A</p>
      `,
      'letter4': `
        <p>亲爱的，</p>
        <p>在过去的一年里，感谢有你的陪伴。这一年，我们一起经历了许多难忘的时刻，也一起成长了许多。</p>
        <p>记得我们一起度过的第一个生日，你为我准备了惊喜派对，那是我过得最开心的一个生日。还有我们一起去海边旅行，看日出日落，那些美好的回忆我会永远珍藏。</p>
        <p>谢谢你在我遇到困难时给予支持和鼓励，谢谢你在我生病时细心照顾，谢谢你的爱和包容。因为有你，我的生活变得更加丰富多彩，也让我明白了什么是真正的幸福。</p>
        <p>新的一年，我希望我们能够继续携手前行，共同创造更多美好的回忆。</p>
        <p>爱你的，<br>恋人B</p>
      `,
      'letter5': `
        <p>亲爱的，</p>
        <p>新的一年即将到来，我有很多期许想要和你分享。</p>
        <p>我希望我们能够更加珍惜彼此，学会更好地沟通和理解。我希望我们能够一起去更多的地方旅行，看更多的风景，体验更多的文化。我希望我们能够共同成长，共同进步，为了我们的未来而努力。</p>
        <p>最重要的是，我希望我们的感情能够一直这样甜蜜幸福，无论遇到什么困难，都能一起面对，一起克服。</p>
        <p>新的一年，新的开始，让我们一起迎接美好的未来吧！</p>
        <p>永远爱你的，<br>恋人A</p>
      `,
      'letter6': `
        <p>亲爱的，</p>
        <p>还记得我们第一次见面的场景吗？那天你穿着一件浅蓝色的连衣裙，笑容如花，一下子就吸引了我的目光。</p>
        <p>我们的相识是那么的偶然，却又是那么的必然。从那一刻起，我就知道你是一个特别的人，值得我用一生去珍惜。</p>
        <p>回忆起我们在一起的点点滴滴，心中充满了感激。谢谢你走进我的生活，让我的生命变得更加完整和美好。</p>
        <p>我会永远记得那个让我心动的瞬间，也会永远记得我们一起走过的每一段路程。</p>
        <p>爱你的，<br>恋人B</p>
      `
    };
    
    return contents[letter.id] || '<p>这是一封充满爱的信...</p>';
  },
  
  // 关闭情书模态框
  closeLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) {
      // 停止播放音乐
      this.stopLetterMusic();
      
      // 添加淡出动画
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  },
  
  // 停止情书音乐
  stopLetterMusic() {
    if (this.letterAudio) {
      this.letterAudio.pause();
      this.letterAudio = null;
    }
  }
};

export default loveLettersModule;