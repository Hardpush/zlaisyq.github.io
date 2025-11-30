import http.server
import socketserver
import os

# 设置服务器端口
PORT = 8080  # 改为8080端口避免冲突

# 自定义请求处理器，支持自定义404页面
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, message=None):
        if code == 404:
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            # 检查404.html是否存在
            if os.path.exists('404.html'):
                with open('404.html', 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b'404 Not Found')
            return
        # 其他错误使用默认处理
        super().send_error(code, message)

Handler = CustomHandler

# 创建并启动服务器
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"服务器正在运行: http://localhost:{PORT}")
    print(f"网站地址: http://localhost:{PORT}/index.html")
    print(f"测试404页面: http://localhost:{PORT}/notfound")
    print("按 Ctrl+C 停止服务器")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")