const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const publicDir = process.cwd();

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 获取请求的文件路径
  let filePath = path.join(publicDir, req.url);
  
  // 如果请求的是根目录，返回index.html
  if (filePath === publicDir + '/') {
    filePath = path.join(publicDir, 'index.html');
  }
  
  // 检查文件是否存在
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 文件不存在，返回自定义404页面
      const notFoundPath = path.join(publicDir, '404.html');
      fs.readFile(notFoundPath, (err, data) => {
        if (err) {
          // 如果404.html也不存在，返回简单的文本响应
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          // 返回自定义404页面
          res.writeHead(404, { 
            'Content-Type': 'text/html',
            'Content-Length': data.length
          });
          res.end(data);
        }
        console.log(`[${new Date().toISOString().substring(11, 19)}] 404 Not Found: ${req.url}`);
      });
      return;
    }
    
    // 设置MIME类型
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
      case '.css':
        contentType = 'text/css';
        break;
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.ogg':
        contentType = 'audio/ogg';
        break;
    }
    
    // 读取并发送文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        console.error(`[${new Date().toISOString().substring(11, 19)}] Error reading file: ${err.message}`);
        return;
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Length': data.length
      });
      res.end(data);
      console.log(`[${new Date().toISOString().substring(11, 19)}] 200 OK: ${req.url}`);
    });
  });
});

// 启动服务器
try {
    server.listen(PORT, () => {
        // 输出更明确的启动成功信息
        console.log('====================================');
        console.log('HTTP服务器启动成功!');
        console.log(`访问地址: http://localhost:${PORT}/`);
        console.log(`访问首页: http://localhost:${PORT}/index.html`);
        console.log(`访问情书信箱: http://localhost:${PORT}/letters.html`);
        console.log('====================================');
        console.log('按 Ctrl+C 停止服务器');
    });
} catch (err) {
    console.error('====================================');
    console.error(`服务器启动失败: ${err.message}`);
    console.error(`请检查端口 ${PORT} 是否被占用`);
    console.error('====================================');
    process.exit(1);
}

// 错误处理
server.on('error', (err) => {
    console.error('====================================');
    console.error(`服务器运行时错误: ${err}`);
    console.error('====================================');
    process.exit(1);
});

// 优雅退出
process.on('SIGINT', () => {
    console.log('正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

// 输出服务器启动信息
console.log(`正在启动HTTP服务器...`);
console.log(`监听地址: localhost:${PORT}`);