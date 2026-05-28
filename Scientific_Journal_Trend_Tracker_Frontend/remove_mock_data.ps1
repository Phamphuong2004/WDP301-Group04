$componentsDir = "e:\WDP301_Group04\WDP301-Group04\Scientific_Journal_Trend_Tracker_Frontend\src\app\components"
$files = Get-ChildItem -Path $componentsDir -Filter "*.tsx"

foreach ($file in $files) {
    # Read the content as a single string
    $content = Get-Content -Path $file.FullName -Raw

    $modified = $false

    # Regex to match const array definitions like: const data = [ ... ];
    # This regex is a bit complex in powershell, so let's do something safer.
    # We will replace known mock variable declarations with empty arrays.
    
    $varsToEmpty = @(
        "const data", "const trend", "const latest", "const papers", "const timeline",
        "const volumeData", "const topJournals", "const topAuthors", "const coOccur",
        "const keywordBookmarks", "const following", "const discover", "const seed",
        "const stats", "const keywordTrend"
    )

    foreach ($varName in $varsToEmpty) {
        # regex to match: const varName = [...anything...];
        # we need to be careful with multi-line arrays.
        $pattern = "(?s)$varName\s*=\s*\[.*?\];"
        if ($content -match $pattern) {
            $content = $content -replace $pattern, "$varName: any[] = [];"
            $modified = $true
        }
    }

    if ($modified) {
        Write-Host "Modifying $($file.Name)"
        # Try to write back to the file. If it throws access denied, we use a temp file then overwrite.
        try {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -Force
        } catch {
            Write-Host "Failed to write $($file.Name): $_"
        }
    }
}
Write-Host "Done"
