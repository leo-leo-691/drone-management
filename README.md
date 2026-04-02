# 🏁 Drone Competition Management System

> A full-stack React + Firebase platform for managing drone racing tournaments — with live scoring, admin controls, and a real-time public leaderboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛠️ Admin Portal | Manage rounds, obstacles, and teams from a dedicated dashboard |
| ⚡ Real-time Scoring | Live score updates via Firestore listeners |
| 🏆 Public Leaderboard | Mobile-responsive spectator view |
| 🔄 Re-Entry Logic | One-time re-entry per team with round-specific reset |
| ❌ Auto-Disqualification | Teams disqualified after more than 3 ground touches |
| 🌑 Dark Mode UI | Neon-accented drone racing aesthetic |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend / Database | Firebase Firestore |
| Auth | Firebase Authentication (Email/Password) |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Firebase](https://firebase.google.com/) account

---

### 1. Firebase Setup

1. Create a new project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable the following services:
   - **Authentication** → Email/Password provider
   - **Firestore Database**
   - **Storage**
3. Go to **Project Settings → Your Apps** and copy your web app config.

---

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

---

### 5. Deploy to Firebase Hosting

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Authenticate
firebase login

# Initialize hosting (select existing project, set build dir to: dist)
firebase init

# Build the app
npm run build

# Deploy
firebase deploy
```

---

## 🔒 Security Rules

Defined in `firestore.rules`:

| Role | Access |
|---|---|
| **Public** | Read-only access to visible rounds and their obstacles |
| **Admin** | Full read/write across all collections |
| **Teams** | Public read access for leaderboard display |

---

## 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components (Admin & Public)
├── pages/            # Main views: Home, Login, AdminDashboard
├── services/         # Firebase logic: db.js, storage.js
└── context/          # Auth state management
```

---

## ⚙️ Scoring Rules

- **Ground Touches**: A team is **automatically disqualified** if they accumulate more than 3 ground touches in a round.
- **Re-Entry**: Each team is allowed **one re-entry** per competition. Re-entry resets the team's score for that specific round only.
- **Obstacles**: Stored as subcollections within each round document for clean, scalable data architecture.

---

## 🧑‍💼 Admin Setup Guide

1. Navigate to `/login` and sign in with your admin credentials.
2. On first load, the **Admin Dashboard** will auto-initialize the default rounds: `round1`, `round2`, `round3`.
3. Add teams, configure obstacles, and you're ready to race!

---

## 📄 License

This project is open source. Contributions are welcome.
