$file = "src\app\components\HomePage.tsx"
$content = Get-Content $file -Raw
$content = $content -replace '<Grid ', '<Box '
$content = $content -replace '</Grid>', '</Box>'
$content | Set-Content $file
Write-Host "Fixed Grid to Box replacement"
