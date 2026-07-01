# Context Reminder Backend

Backend foundation for **Dynamic Contextual Relevance Evaluation System for Adaptive Location-Based Reminders**.

## Stack

- Node.js
- Express.js
- Firebase Admin SDK
- Cloud Firestore
- Firebase Authentication-ready foundation
- JavaScript
- MVC architecture

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, create `.env` manually from `.env.example` if `cp` is unavailable.

## Firebase Admin Credentials

The Android `google-services.json` file is for the mobile app and must not be used as the backend Admin SDK credential.

Use one of these backend-safe options:

1. `FIREBASE_SERVICE_ACCOUNT_BASE64`
2. `FIREBASE_SERVICE_ACCOUNT_PATH`
3. Google Application Default Credentials in your deployment environment

## Endpoints

- `GET /`
- `GET /api/health`
- `GET /api/version`
- `GET /api/example?name=Ganesh`

## Scripts

```bash
npm start
npm run dev
npm run lint
```
