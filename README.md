# Drone Competition Management System

Full-stack responsive React application with Firebase backend for managing drone racing rounds, obstacles, and live scoring.

## 🚀 Features

- **Admin Portal**: Manage rounds, obstacles, and teams.
- **Real-time Scoring**: Live updates as scores are entered.
- **Public Leaderboard**: Mobile-responsive view for spectators.
- **Dark Mode UI**: "Drone Racing" aesthetic with neon accents.

## 🛠 Setup Instructions

### 1. Prerequisites

- Node.js installed
- Firebase Account

### 2. Firebase Configuration

1. Create a new project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database**.
4. Enable **Storage**.
5. Copy your web app configuration keys.
6. Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Installation

```bash
npm install
```

### 4. Running Locally

```bash
npm run dev
```

### 5. Deployment (Firebase Hosting)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init` (Select Hosting, use existing project, build directory: `dist`)
4. Build: `npm run build`
   _Ensure build completes without errors._
5. Deploy: `firebase deploy`

## 🔒 Security Rules

The `firestore.rules` file has been updated to strictly control access:

- **Public**: Read-only access to _visible_ rounds and their obstacles.
- **Admin**: Full read/write access to all collections.
- **Teams**: Public read access for leaderboard.

## 📂 Key Features

- **Strict Scoring**: Automatic disqualification for >3 ground touches.
- **Re-Entry**: One-time re-entry per team with specific round reset logic.
- **Subcollections**: Obstacles stored within rounds for cleaner data architecture.
- **Dark Mode**: Neon-accented UI for drone racing aesthetic.
- `src/components`: Reusable UI components (Admin & Public)
- `src/pages`: Main views (Home, Login, AdminDashboard)
- `src/services`: Firebase logic (db.js, storage.js)
- `src/context`: Auth state management

## 📝 Admin Initial Setup

1. Go to `/login` to sign in.
2. The database rounds (`round1`, `round2`, `round3`) will auto-initialize on first Admin Dashboard load.
3. Add teams and start configuring obstacles!
