# Mental Wellness Tracker

Mental Wellness Tracker adalah aplikasi web untuk tracking emosi dan mental wellness pengguna dengan fitur emotion detection menggunakan webcam. Aplikasi ini berjalan secara lokal dengan fokus pada privacy - data wajah tidak disimpan, hanya hasil deteksi emosi.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript, React 18, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Emotion Detection**: face-api.js
- **Data Visualization**: Recharts

## Project Structure

```
mental-wellness-tracker/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── public/          # Static files
│   │   └── models/      # face-api.js models
│   └── types/           # TypeScript type definitions
├── backend/             # Express.js backend API
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Utility functions
│   ├── prisma/          # Prisma schema and migrations
│   └── uploads/         # User uploaded files
└── package.json         # Root package.json (workspace)
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mental-wellness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and configure your PostgreSQL connection
```

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local and configure API URL and NextAuth
```

4. Setup database:
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
cd ..
```

5. Download face-api.js models:

**Option A: Automatic Download (Recommended)**
```bash
cd frontend
npm run download-models        # For Linux/Mac
npm run download-models:win    # For Windows
cd ..
```

**Option B: Manual Download**
Download the required models from the [face-api.js repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them in `frontend/public/models/`:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_expression_model-weights_manifest.json
- face_expression_model-shard1

See `frontend/public/models/README.md` for detailed instructions.

## Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:

**Frontend** (http://localhost:3000):
```bash
npm run dev:frontend
```

**Backend** (http://localhost:3001):
```bash
npm run dev:backend
```

## Features

- 🎭 **Emotion Detection**: Real-time emotion detection using webcam and face-api.js
- 📊 **Analytics Dashboard**: Visualize emotion trends and patterns
- 📝 **Mood Journal**: Add text notes, voice recordings, or photos to emotion entries
- 🎯 **Goal Tracking**: Set and track emotional wellness goals
- 🔥 **Streak Tracking**: Track daily check-in streaks
- 💡 **Personalized Recommendations**: Get recommendations based on your current mood
- 🔒 **Privacy First**: No facial data is stored, only emotion scores

## Privacy

This application prioritizes user privacy:
- Raw video data is never saved or transmitted
- Facial images are never saved or transmitted
- Only emotion scores (numerical values) are stored
- All processing happens client-side in the browser
- User data is encrypted and secured

## License

ISC
