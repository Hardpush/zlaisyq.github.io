# 创建一个简单的HTTP服务器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()

Write-Host "Server running: http://localhost:8000"
Write-Host "Visit http://localhost:8000/index.html to view the website"
Write-Host "Press Ctrl+C to stop server"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested file path
        $filePath = [System.IO.Path]::Combine($PSScriptRoot, $request.Url.LocalPath.TrimStart('/'))
        
        # If directory, try to load index.html
        if ([System.IO.Directory]::Exists($filePath)) {
            $filePath = [System.IO.Path]::Combine($filePath, 'index.html')
        }
        
        # Check if file exists
        if ([System.IO.File]::Exists($filePath)) {
            # Set appropriate Content-Type
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($extension) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.jpg'  { 'image/jpeg' }
                '.png'  { 'image/png' }
                '.gif'  { 'image/gif' }
                '.ogg'  { 'audio/ogg' }
                '.txt'  { 'text/plain; charset=utf-8' }
                default { 'application/octet-stream' }
            }
            
            $response.ContentType = $contentType
            
            # Read and send file content
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
            
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 200 OK: $($request.Url.LocalPath)"
        } else {
            # File not found, return 404
            $response.StatusCode = 404
            $response.Close()
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 404 Not Found: $($request.Url.LocalPath)"
        }
    }
} catch {
    Write-Host "Error: $_"
} finally {
    $listener.Stop()
    Write-Host "Server stopped"
}