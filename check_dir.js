const fs = require('fs');
const path = require('path');

function checkDir(dirPath) {
  try {
    console.log(`检查目录: ${dirPath}`);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      console.log(`目录存在，内容:`);
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
        const isDir = stats.isDirectory() ? '目录' : '文件';
        console.log(`- ${file} (${isDir})`);
      });
    } else {
      console.log(`目录不存在: ${dirPath}`);
    }
  } catch (error) {
    console.error(`检查目录时出错: ${error.message}`);
  }
}

// 检查根目录下的images目录
checkDir('./images');

// 检查images/1目录
checkDir('./images/1');

// 检查images/2目录
checkDir('./images/2');

// 检查根目录
checkDir('./');