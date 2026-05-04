# Mental Wellness Tracker - Web Deteksi Emosi

Mental Wellness Tracker adalah aplikasi web full-stack untuk tracking emosi, jurnal, dan kesehatan mental pengguna dengan fitur **emotion detection real-time menggunakan webcam**. Aplikasi ini dirancang dengan fokus pada **privacy** - data wajah tidak disimpan ke database, hanya hasil deteksi emosi yang diproses.

## 🎯 Fitur Utama

- **Real-time Emotion Detection**: Deteksi emosi langsung dari webcam menggunakan face-api.js
- **Emotion Tracking**: Catat dan pantau perkembangan emosi harian
- **Mood Journal**: Tulis jurnal dengan analisis emosi terkait
- **Goal Setting**: Tetapkan target emosi dan pantau progress
- **Streak Tracking**: Lacak konsistensi check-in emotional
- **Recommendations**: Dapatkan rekomendasi aktivitas berbasis emosi dan nilai islami
- **Islamic Features**: Ayat Al-Quran harian dan dzikir interaktif
- **Authentication**: Sistem login aman dengan NextAuth.js

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Express.js, TypeScript, Node.js |
| **Database** | PostgreSQL dengan Prisma ORM |
| **Authentication** | NextAuth.js v4 |
| **Emotion Detection** | face-api.js (TensorFlow.js based) |
| **Data Visualization** | Recharts |
| **Package Manager** | npm workspaces (monorepo) |

## 📁 Struktur Proyek

```
web-deteksi-emosi/
├── frontend/                          # Next.js frontend application
│   ├── app/
│   │   ├── api/                       # API routes (NextAuth, etc)
│   │   ├── auth/                      # Auth pages
│   │   ├── dashboard/                 # Main dashboard
│   │   ├── journal/                   # Journal page
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Navbar.tsx                 # Navigation component
│   │   ├── FaceScan.tsx               # Emotion detection component
│   │   ├── MoodJournal.tsx            # Journal entry component
│   │   ├── IslamicDzikir.tsx          # Dzikir feature
│   │   ├── AyatOfTheDay.tsx           # Daily verse
│   │   ├── SyariahIntervensi.tsx      # Islamic intervention
│   │   └── providers/
│   │       └── SessionProvider.tsx    # NextAuth provider
│   ├── lib/
│   │   ├── api-client.ts              # API client utilities
│   │   ├── faceApi.ts                 # face-api.js setup
│   │   └── hooks/
│   │       └── useAuth.ts             # Auth hook
│   ├── public/
│   │   ├── models/                    # face-api.js ML models
│   │   └── images/
│   │       └── logo/
│   ├── types/
│   │   ├── emotion.types.ts           # Emotion type definitions
│   │   ├── journal.types.ts           # Journal types
│   │   └── next-auth.d.ts             # NextAuth type extensions
│   └── scripts/
│       ├── download-models.sh         # Model download script (Mac/Linux)
│       └── download-models.ps1        # Model download script (Windows)
│
├── backend/                           # Express.js backend API
│   ├── src/
│   │   ├── index.ts                   # Server entry point
│   │   ├── controllers/               # Business logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── emotion.controller.ts
│   │   │   ├── journal.controller.ts
│   │   │   ├── goal.controller.ts
│   │   │   ├── streak.controller.ts
│   │   │   └── recommendation.controller.ts
│   │   ├── routes/                    # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── emotion.routes.ts
│   │   │   ├── journal.routes.ts
│   │   │   ├── goal.routes.ts
│   │   │   ├── streak.routes.ts
│   │   │   └── recommendation.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts     # JWT authentication
│   │   ├── types/
│   │   │   └── emotion.types.ts
│   │   ├── utils/
│   │   │   ├── prisma.ts              # Prisma client
│   │   │   ├── validation.ts          # Input validation
│   │   │   ├── recommendations.ts     # Recommendation logic
│   │   │   ├── goalProgress.ts        # Goal calculation
│   │   │   └── streak.ts              # Streak calculation
│   │   ├── data/
│   │   │   └── recommendations.ts     # Recommendation data
│   │   └── __tests__/                 # Jest unit tests
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema
│   │   └── migrations/                # Database migrations
│   ├── uploads/                       # User uploaded files
│   └── jest.config.js                 # Jest testing config
│
├── package.json                       # Root workspace config
└── README.md                          # This file
```

## 🔍 Database Schema

Aplikasi menggunakan 6 model utama di PostgreSQL:

- **User**: Informasi user dan authentication
- **EmotionEntry**: Catatan hasil deteksi emosi (7 jenis: happy, sad, angry, fearful, disgusted, surprised, neutral)
- **Journal**: Jurnal teks/voice/foto yang terkait dengan EmotionEntry
- **Goal**: Target emosi yang ingin dicapai user
- **Streak**: Tracking konsistensi check-in emotional
- **RecommendationCompletion**: Tracking rekomendasi yang sudah dikerjakan user

Lihat `backend/prisma/schema.prisma` untuk detail lengkap.

## 📋 Prerequisites

- **Node.js** 18+ (versi LTS recommended)
- **npm** 9+ (bundled dengan Node.js)
- **PostgreSQL** 14+ (untuk database)
- **Git** (untuk version control)

### Verifikasi Instalasi

```bash
node --version    # Harus v18.0.0 atau lebih tinggi
npm --version     # Harus v9.0.0 atau lebih tinggi
psql --version    # Harus PostgreSQL 14 atau lebih tinggi
```

## 🚀 Quick Start Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd web-deteksi-emosi
```

### 2. Install Dependencies

```bash
# Install dependencies untuk semua workspace (frontend + backend)
npm install
```

### 3. Setup PostgreSQL Database

Pastikan PostgreSQL server sudah berjalan, kemudian buat database baru:

```bash
# Masuk ke PostgreSQL CLI
psql -U postgres

# Buat database baru
CREATE DATABASE web_deteksi_emosi;

# Verify database created
\l

# Exit
\q
```

### 4. Setup Environment Variables

#### Backend (`backend/.env`)

```bash
# Salin file example jika ada
# cp backend/.env.example backend/.env

# Edit backend/.env dengan konfigurasi berikut:
```

**Backend Configuration**:
```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/web_deteksi_emosi"

# Server
PORT=3001
NODE_ENV=development

# JWT (untuk authentication)
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRATION="7d"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (`frontend/.env.local`)

```bash
# Edit frontend/.env.local dengan konfigurasi berikut:
```

**Frontend Configuration**:
```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional, sesuaikan dengan provider yang digunakan)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

### 5. Setup Database Schema & Migrations

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations (create tables)
npm run prisma:migrate

cd ..
```

**Output yang diharapkan**:
```
✔ Your database has been successfully migrated
✔ Generated Prisma Client
```

### 6. Download ML Models untuk Emotion Detection

Model face-api.js (~100MB) diperlukan untuk deteksi emosi real-time.

#### Option A: Automatic Download (Recommended)

```bash
cd frontend

# For macOS/Linux
npm run download-models

# For Windows (PowerShell)
npm run download-models:win

cd ..
```

#### Option B: Manual Download

Jika script gagal, download manual dari:
- [face-api.js weights repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

Dan copy ke: `frontend/public/models/`

File yang diperlukan:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_expression_model-weights_manifest.json`
- `face_expression_model-shard1`

Lihat `frontend/public/models/README.md` untuk detail lebih lanjut.

## 🛠️ Running the Application

### Development Mode (Frontend + Backend Simultaneously)

Jalankan dari root directory:

```bash
# Terminal 1: Run semua service (frontend + backend) dengan concurrently
npm run dev
```

Atau jalankan secara terpisah:

```bash
# Terminal 1: Frontend (port 3000)
npm run dev:frontend

# Terminal 2: Backend (port 3001)
npm run dev:backend
```

**Expected Output**:

Frontend:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Environments: .env.local
```

Backend:
```
Mental Wellness Tracker API is running on port 3001
✔ Connected to PostgreSQL
```

### Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Health Check**: http://localhost:3001/health

### Production Build

```bash
# Build both frontend dan backend
npm run build

# Start backend (frontend di-serve dari build)
npm start
```

## 📦 Available Scripts

### Root Level

```bash
npm run dev              # Run frontend + backend secara bersamaan
npm run dev:frontend    # Run frontend only
npm run dev:backend     # Run backend only
npm run build           # Build frontend + backend untuk production
npm start               # Start backend production server
```

### Frontend Specific

```bash
cd frontend

npm run dev             # Start Next.js development server
npm run build           # Build untuk production
npm start               # Start production server
npm run lint            # ESLint check
npm run download-models # Download face-api.js models (Mac/Linux)
npm run download-models:win # Download models (Windows)
```

### Backend Specific

```bash
cd backend

npm run dev                 # Start Express server dengan hot reload
npm run build               # Compile TypeScript to JavaScript
npm run start               # Run compiled JavaScript
npm run test                # Run all Jest tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Create/run database migrations
npm run prisma:studio      # Open Prisma Studio GUI (http://localhost:5555)
```

## 🔐 API Authentication

Aplikasi menggunakan **JWT Bearer Token** untuk authentication:

```bash
# Header yang diperlukan untuk protected routes:
Authorization: Bearer <your_jwt_token>
```

Lihat `backend/middleware/AUTH.md` untuk dokumentasi lengkap endpoint authentication.

## 🧪 Testing

### Run All Tests

```bash
cd backend
npm run test
```

### Run Tests with Coverage

```bash
cd backend
npm run test:coverage
```

### Run Specific Test

```bash
cd backend
npm run test -- <test-file-name>
```

**Test Files Available**:
- `emotion.controller.test.ts`
- `journal.controller.test.ts`
- `recommendation.controller.test.ts`
- `streak.controller.test.ts`
- `auth.middleware.test.ts`
- `validation.test.ts`
- `streak.test.ts`
- `recommendations.test.ts`
- `goalProgress.test.ts`

## 📊 Database Management

### View & Edit Database Schema

```bash
cd backend

# Open Prisma Studio (GUI for database management)
npm run prisma:studio
```

Studio akan terbuka di http://localhost:5555

### Create New Migration

```bash
cd backend

# Modify schema.prisma, kemudian run:
npm run prisma:migrate

# Follow prompts untuk naming dan confirmation
```

### Reset Database (Development Only)

```bash
cd backend

# Warning: This will delete all data!
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Issue: PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
- Pastikan PostgreSQL service berjalan
- Verifikasi DATABASE_URL di backend/.env
- Check PostgreSQL port (default: 5432)

```bash
# Check PostgreSQL status (macOS)
brew services list

# Start PostgreSQL (macOS)
brew services start postgresql
```

### Issue: Models Not Found (Emotion Detection)

```
Failed to load face-api.js models
```

**Solution**:
- Verify files exist di `frontend/public/models/`
- Re-run download script:
  ```bash
  cd frontend
  npm run download-models
  cd ..
  ```
- Check network connection (file size ~100MB)

### Issue: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process (replace PID)
kill -9 <PID>

# Or use different port
PORT=3002 npm run dev
```

### Issue: JWT Secret Not Configured

```
Error: Missing NEXTAUTH_SECRET
```

**Solution**:
- Ensure `frontend/.env.local` memiliki `NEXTAUTH_SECRET`
- Generate secret: `openssl rand -base64 32`

## 📚 API Documentation

### Main Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register user baru
  - POST `/api/auth/login` - Login user
  - GET `/api/auth/me` - Get current user

- **Emotions**
  - POST `/api/emotions` - Record emotion detection
  - GET `/api/emotions` - Get emotion history
  - GET `/api/emotions/stats` - Get emotion statistics

- **Journal**
  - POST `/api/journal` - Create journal entry
  - GET `/api/journal` - Get journal entries
  - PUT `/api/journal/:id` - Update entry
  - DELETE `/api/journal/:id` - Delete entry

- **Goals**
  - POST `/api/goals` - Create goal
  - GET `/api/goals` - Get all goals
  - PUT `/api/goals/:id` - Update goal
  - DELETE `/api/goals/:id` - Delete goal

- **Streaks**
  - GET `/api/streaks` - Get streak data
  - POST `/api/streaks/checkin` - Record daily check-in

- **Recommendations**
  - GET `/api/recommendations` - Get recommendations
  - POST `/api/recommendations/:id/complete` - Mark as complete

Lihat dokumentasi lebih lengkap di masing-masing route file di `backend/src/routes/`

## 🔗 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [NextAuth.js](https://next-auth.js.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## 💡 Development Tips

1. **Hot Reload**: Backend dan frontend sudah support hot reload. Cukup save file dan perubahan akan reflect otomatis.

2. **Database Queries**: Gunakan Prisma Studio untuk visualisasi dan query database:
   ```bash
   cd backend && npm run prisma:studio
   ```

3. **API Testing**: Gunakan tools seperti Postman atau Thunder Client untuk test API
   - Import dari `backend/src/routes/` untuk melihat endpoint examples

4. **Environment Files**: Jangan commit `.env` files. Gunakan `.env.example` sebagai template.

5. **TypeScript**: Pastikan TypeScript errors di-resolve sebelum commit.

## 📝 License

ISC

## 👨‍💻 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

---

**Last Updated**: May 2026  
**Version**: 1.0.0

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
