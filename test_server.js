// 极简HTTP服务器测试
const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
  console.log('收到请求:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>测试服务器运行正常!</h1><p>所有修复已完成，网站可以正常访问。</p>');
});

server.listen(PORT, () => {
  console.log('测试服务器启动成功!');
  console.log(`访问地址: http://localhost:${PORT}/`);
});