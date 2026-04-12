#!/bin/bash

# Script to download face-api.js model files
# This script downloads the required TinyFaceDetector and FaceExpressionNet models
# from the official face-api.js repository

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL for model files
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Target directory
MODELS_DIR="$(dirname "$0")/../public/models"

echo -e "${YELLOW}Downloading face-api.js model files...${NC}"
echo ""

# Create models directory if it doesn't exist
mkdir -p "$MODELS_DIR"

# Change to models directory
cd "$MODELS_DIR"

# Function to download a file
download_file() {
    local filename=$1
    local url="${BASE_URL}/${filename}"
    
    echo -e "Downloading ${filename}..."
    
    if command -v wget &> /dev/null; then
        wget -q --show-progress "$url" -O "$filename"
    elif command -v curl &> /dev/null; then
        curl -# -L "$url" -o "$filename"
    else
        echo -e "${RED}Error: Neither wget nor curl is available. Please install one of them.${NC}"
        exit 1
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Downloaded ${filename}${NC}"
    else
        echo -e "${RED}✗ Failed to download ${filename}${NC}"
        exit 1
    fi
}

# Download TinyFaceDetector models
echo -e "${YELLOW}Downloading TinyFaceDetector models...${NC}"
download_file "tiny_face_detector_model-weights_manifest.json"
download_file "tiny_face_detector_model-shard1"
echo ""

# Download FaceExpressionNet models
echo -e "${YELLOW}Downloading FaceExpressionNet models...${NC}"
download_file "face_expression_model-weights_manifest.json"
download_file "face_expression_model-shard1"
echo ""

# Verify all files are present
echo -e "${YELLOW}Verifying downloaded files...${NC}"

required_files=(
    "tiny_face_detector_model-weights_manifest.json"
    "tiny_face_detector_model-shard1"
    "face_expression_model-weights_manifest.json"
    "face_expression_model-shard1"
)

all_present=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo -e "${GREEN}✓ ${file} (${size})${NC}"
    else
        echo -e "${RED}✗ ${file} is missing${NC}"
        all_present=false
    fi
done

echo ""

if [ "$all_present" = true ]; then
    echo -e "${GREEN}✓ All model files downloaded successfully!${NC}"
    echo ""
    echo -e "Models are ready to use. You can now run the application."
    echo -e "The models will be loaded from ${YELLOW}/models${NC} path in the browser."
    exit 0
else
    echo -e "${RED}✗ Some model files are missing. Please try running the script again.${NC}"
    exit 1
fi
