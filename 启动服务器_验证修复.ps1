# 验证修复脚本：创建简单的验证函数来测试照片路径

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "网站修复验证脚本" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 验证函数：检查照片路径
function Test-PhotoPath {
    param(
        [string]$path
    )
    
    if (Test-Path -Path $path) {
        Write-Host "✓ 照片路径存在: $path" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ 照片路径不存在: $path" -ForegroundColor Red
        return $false
    }
}

# 检查照片路径
Write-Host "\n检查照片路径..." -ForegroundColor Yellow
$photoDirs = @(
    ".\images",
    ".\images\2",
    ".\images\2\home"
)

$allPhotosExist = $true
foreach ($dir in $photoDirs) {
    if (-not (Test-PhotoPath $dir)) {
        $allPhotosExist = $false
    }
}

# 显示验证结果
Write-Host "\n====================================" -ForegroundColor Cyan
if ($allPhotosExist) {
    Write-Host "✅ 照片路径检查通过，可以进行下一步测试" -ForegroundColor Green
} else {
    Write-Host "❌ 照片路径检查失败，请检查图片文件是否正确放置" -ForegroundColor Red
}
Write-Host "\n手动验证方法："
Write-Host "1. 启动服务器: node simple_server.js" -ForegroundColor Yellow
Write-Host "2. 在浏览器访问: http://localhost:8000" -ForegroundColor Yellow
Write-Host "3. 检查照片是否正确显示" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Cyan
