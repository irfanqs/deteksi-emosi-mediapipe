# PowerShell script to download face-api.js model files
# This script downloads the required TinyFaceDetector and FaceExpressionNet models
# from the official face-api.js repository

# Base URL for model files
$BaseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Target directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ModelsDir = Join-Path $ScriptDir "..\public\models"

Write-Host "Downloading face-api.js model files..." -ForegroundColor Yellow
Write-Host ""

# Create models directory if it doesn't exist
if (-not (Test-Path $ModelsDir)) {
    New-Item -ItemType Directory -Path $ModelsDir -Force | Out-Null
}

# Function to download a file
function Download-File {
    param (
        [string]$FileName
    )
    
    $Url = "$BaseUrl/$FileName"
    $OutputPath = Join-Path $ModelsDir $FileName
    
    Write-Host "Downloading $FileName..." -ForegroundColor White
    
    try {
        # Use Invoke-WebRequest to download the file
        $ProgressPreference = 'SilentlyContinue'  # Disable progress bar for faster download
        Invoke-WebRequest -Uri $Url -OutFile $OutputPath -ErrorAction Stop
        $ProgressPreference = 'Continue'
        
        Write-Host "✓ Downloaded $FileName" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to download $FileName" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

# Download TinyFaceDetector models
Write-Host "Downloading TinyFaceDetector models..." -ForegroundColor Yellow
$success1 = Download-File "tiny_face_detector_model-weights_manifest.json"
$success2 = Download-File "tiny_face_detector_model-shard1"
Write-Host ""

# Download FaceExpressionNet models
Write-Host "Downloading FaceExpressionNet models..." -ForegroundColor Yellow
$success3 = Download-File "face_expression_model-weights_manifest.json"
$success4 = Download-File "face_expression_model-shard1"
Write-Host ""

# Verify all files are present
Write-Host "Verifying downloaded files..." -ForegroundColor Yellow

$RequiredFiles = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
)

$AllPresent = $true
foreach ($File in $RequiredFiles) {
    $FilePath = Join-Path $ModelsDir $File
    if (Test-Path $FilePath) {
        $Size = (Get-Item $FilePath).Length
        $SizeKB = [math]::Round($Size / 1KB, 2)
        Write-Host "✓ $File ($SizeKB KB)" -ForegroundColor Green
    }
    else {
        Write-Host "✗ $File is missing" -ForegroundColor Red
        $AllPresent = $false
    }
}

Write-Host ""

if ($AllPresent) {
    Write-Host "✓ All model files downloaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Models are ready to use. You can now run the application."
    Write-Host "The models will be loaded from /models path in the browser." -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "✗ Some model files are missing. Please try running the script again." -ForegroundColor Red
    exit 1
}
