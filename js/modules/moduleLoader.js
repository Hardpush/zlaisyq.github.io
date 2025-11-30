// 模块加载器 - 提供模块化加载和管理功能
const moduleLoader = {
  // 已加载的模块缓存
  modules: {},
  
  // 加载模块
  loadModule(moduleName, moduleFunction) {
    if (!this.modules[moduleName]) {
      this.modules[moduleName] = moduleFunction;
      console.log(`✅ 模块已加载: ${moduleName}`);
    }
    return this.modules[moduleName];
  },
  
  // 获取已加载的模块
  getModule(moduleName) {
    if (!this.modules[moduleName]) {
      console.error(`❌ 模块未加载: ${moduleName}`);
      return null;
    }
    return this.modules[moduleName];
  },
  
  // 初始化所有模块
  initAllModules(appState, config) {
    Object.keys(this.modules).forEach(moduleName => {
      const module = this.modules[moduleName];
      if (module.init && typeof module.init === 'function') {
        try {
          module.init(appState, config);
          console.log(`🚀 模块已初始化: ${moduleName}`);
        } catch (error) {
          console.error(`❌ 模块初始化失败: ${moduleName}`, error);
        }
      }
    });
  }
};

// 导出模块加载器
export default moduleLoader;