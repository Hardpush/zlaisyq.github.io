// 情书模块 - 处理情书相关功能
const loveLettersModule = {
  // 初始化情书模块
  init(appState, config) {
    this.appState = appState;
    this.config = config;
    this.letterData = [];
    this.letterAudio = null;
    this.scrollPosition = 0; // 添加滚动位置记忆
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
    // 直接保存当前滚动位置
    this.scrollPosition = window.scrollY;
    
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
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
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
        <p>这一年来，我们一起经历了很多：一起看日出日落，一起旅行，一起度过那些平凡却温馨的日子。有欢笑，也有泪水，但每一刻都让我更加确定，你就是我想要共度生命的人。</p>
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
        <p>圣诞节快乐！在这个特别的日子，我想对你说声谢谢。</p>
        <p>谢谢你在过去的一年里一直陪伴在我边，谢谢你的爱和关怀。有你的日子，每一天都充满了阳光和温暖。</p>
        <p>记得去年的圣诞节，我们一起装饰圣诞树，一起做了一顿丰盛的晚餐。虽然很简单，但却充满了幸福的味道。</p>
        <p>新的一年就要来了，我希望我们能够继续相爱，继续陪伴在彼此的边。不管未来会遇到什么困难，我们都要一起面对。</p>
        <p>永远爱你的，<br>恋人B</p>
      `,
      'letter5': `
        <p>亲爱的，</p>
        <p>明天就是新年了，站在岁末年初的节点上，我不禁思绪万千。</p>
        <p>过去的一年，我们一起经历了很多。有欢笑，有泪水，有成功，也有失败。但最重要的是，我们一直在一起，相互支持，相互鼓励。</p>
        <p>新的一年，我有很多期许。我希望我们的感情能够更加稳固，希望我们都能够在工作和生活中取得更大的进步，希望我们能够一起去更多的地方，看更多的风景。</p>
        <p>最重要的是，我希望我们能够一直这样相爱下去，直到永远。</p>
        <p>永远爱你的，<br>恋人A</p>
      `,
      'letter6': `
        <p>亲爱的，</p>
        <p>今天整理旧物时，翻到了一张我们第一次见面时的照片。看着照片中青涩的我们，我不禁想起了那个美好的午后。</p>
        <p>那天阳光很好，我在图书馆看书，你坐在我对面。你专注的样子很吸引人，我时不时地偷偷看。后来你发现了，对我笑了笑，那个笑容真的很温暖。</p>
        <p>从那以后，我们经常在图书馆偶遇，渐渐地熟悉了起来。现在回想起来，那真是一段美好的时光。</p>
        <p>谢谢你出现在我的生命中，谢谢你给我带来那么多的快乐和幸福。</p>
        <p>永远爱你的，<br>恋人B</p>
      `
    };
    
    return contents[letter.id] || '<p>情书内容暂时无法加载</p>';
  },
  
  // 加载情书背景音乐
  loadLetterMusic(letterId) {
    const audio = new Audio();
    audio.volume = 0.3;
    
    // 模拟不同情书对应不同音乐
    const musicUrls = [
      'https://music.163.com/song/media/outer/url?id=1399528493.mp3',
      'https://music.163.com/song/media/outer/url?id=1400085118.mp3',
      'https://music.163.com/song/media/outer/url?id=1399528493.mp3'
    ];
    
    const musicIndex = (parseInt(letterId.replace('letter', '')) - 1) % musicUrls.length;
    audio.src = musicUrls[musicIndex];
    
    return audio;
  },
  
  // 停止情书音乐
  stopLetterMusic() {
    if (this.letterAudio) {
      this.letterAudio.pause();
      this.letterAudio = null;
    }
  },
  
  // 关闭情书模态框
  closeLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (!modal) return;
    
    // 停止音乐
    this.stopLetterMusic();
    
    // 恢复背景滚动
    document.body.style.overflow = '';
    
    // 移除模态框
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    
    // 直接恢复滚动位置 - 使用最简单直接的方法
    setTimeout(() => {
      window.scrollTo(0, this.scrollPosition);
    }, 10);
  }
};

// 导出模块
export default loveLettersModule;