import http.server
import socketserver
import os

PORT = 8080
handler = http.server.SimpleHTTPRequestHandler

# 自定义请求处理器，添加404错误处理
class CustomHandler(handler):
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

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"服务器启动成功! 访问地址: http://localhost:{PORT}/")
    print(f"访问首页: http://localhost:{PORT}/index.html")
    print(f"访问情书信箱: http://localhost:{PORT}/letters.html")
    print(f"测试404页面: http://localhost:{PORT}/notfound")
    print("按 Ctrl+C 停止服务器")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器正在关闭...")
        httpd.shutdown()
        print("服务器已关闭")