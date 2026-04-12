# Face-API.js Model Files

This directory contains the machine learning models required for emotion detection using face-api.js.

## Required Models

The Mental Wellness Tracker requires the following face-api.js models:

1. **TinyFaceDetector** - Lightweight face detection model
2. **FaceExpressionNet** - Emotion detection model (detects 7 emotions: happy, sad, angry, fearful, disgusted, surprised, neutral)

## How to Download Models

### Option 1: Download from Official Repository (Recommended)

Download the model files from the official face-api.js repository:

**Repository:** https://github.com/justadudewhohacks/face-api.js

**Direct Download Links:**

1. **TinyFaceDetector models:**
   - Navigate to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   - Download these files:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`

2. **FaceExpressionNet models:**
   - Navigate to: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   - Download these files:
     - `face_expression_model-weights_manifest.json`
     - `face_expression_model-shard1`

### Option 2: Clone Repository and Copy Models

```bash
# Clone the face-api.js repository
git clone https://github.com/justadudewhohacks/face-api.js.git

# Copy the required model files to this directory
cp face-api.js/weights/tiny_face_detector_model-* ./frontend/public/models/
cp face-api.js/weights/face_expression_model-* ./frontend/public/models/

# Clean up
rm -rf face-api.js
```

### Option 3: Use wget or curl

```bash
# Navigate to the models directory
cd frontend/public/models

# Download TinyFaceDetector models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Download FaceExpressionNet models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1
```

Or using curl:

```bash
# Navigate to the models directory
cd frontend/public/models

# Download TinyFaceDetector models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Download FaceExpressionNet models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1
```

## Expected Directory Structure

After downloading, your `frontend/public/models/` directory should contain:

```
frontend/public/models/
├── README.md (this file)
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_expression_model-weights_manifest.json
└── face_expression_model-shard1
```

## Verification

To verify the models are correctly placed:

1. Start the development server: `npm run dev` (from the frontend directory)
2. Open the browser console
3. Navigate to the face scan page
4. Check for the message: "Face-api.js models loaded successfully"

If you see an error about missing model files, ensure:
- All 4 files are present in this directory
- File names match exactly (case-sensitive)
- Files are not corrupted (try re-downloading)

## Model Information

### TinyFaceDetector
- **Purpose:** Detects faces in video frames
- **Size:** ~1.2 MB
- **Performance:** Fast, optimized for real-time detection
- **Input Size:** 416x416 (configurable)

### FaceExpressionNet
- **Purpose:** Detects 7 facial expressions/emotions
- **Emotions Detected:**
  - Happy
  - Sad
  - Angry
  - Fearful
  - Disgusted
  - Surprised
  - Neutral
- **Size:** ~300 KB
- **Output:** Probability scores for each emotion (0-1 range)

## Privacy Note

These models run entirely in the browser (client-side). No video data or facial images are sent to any server. Only the emotion detection results (probability scores) are saved to the database.

## Troubleshooting

### Models not loading
- **Error:** "Model files not found"
- **Solution:** Ensure all 4 files are in the `/public/models` directory with correct names

### 404 errors in console
- **Error:** "Failed to fetch model files"
- **Solution:** Check that the Next.js dev server is running and files are in the `public` directory (not `src`)

### WebGL errors
- **Error:** "Browser does not support WebGL"
- **Solution:** Use a modern browser (Chrome, Firefox, Edge) with WebGL enabled

### Slow loading
- **Issue:** Models take long to load
- **Solution:** This is normal on first load. Models are cached by the browser after initial download.

## License

The face-api.js models are provided under the MIT License by the face-api.js project.

**Repository:** https://github.com/justadudewhohacks/face-api.js
**License:** MIT

## Requirements

**Validates: Requirements 1.2**
- Face-api.js models must be loaded before emotion detection can begin
- TinyFaceDetector and FaceExpressionNet are the required models
