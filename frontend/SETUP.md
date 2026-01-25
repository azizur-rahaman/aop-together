# Quick Setup Guide - Google Login with Backend

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → **Google** sign-in method
4. Copy your Firebase configuration

### 3. Set Environment Variables

Create `.env.local` in the frontend folder:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_MEASUREMENT_ID=G-ABC123

NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Configure Backend

In `backend/src/main/resources/application.properties`:

```properties
google.client.id=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

**Important:** Use the same Google Client ID that Firebase uses for web authentication.

To find it:
- Firebase Console → Project Settings → General
- Under "Your apps" → Web app → Firebase SDK snippet
- Or go to Google Cloud Console → APIs & Services → Credentials

### 5. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend will run on `http://localhost:8080`

### 6. Start Frontend

```bash
cd frontend
pnpm dev
```

Frontend will run on `http://localhost:3000`

## ✅ Test the Flow

1. Open `http://localhost:3000`
2. Click "Sign in with Google"
3. Complete Google OAuth
4. Backend will verify the token
5. You'll be redirected to `/groups`

## 🔍 Troubleshooting

### "Authentication failed" error
- Check that backend is running
- Verify Google Client ID matches in both Firebase and backend
- Check browser console for detailed error

### CORS errors
- Ensure backend has CORS enabled for `http://localhost:3000`
- Check `@CrossOrigin` annotation in controllers

### Firebase not initialized
- Verify all Firebase env variables are set in `.env.local`
- Restart the dev server after changing env variables

### Backend can't verify token
- Confirm Google Client ID in `application.properties`
- Check backend logs for detailed error message
- Ensure token is being sent correctly in request body

## 📝 Architecture

```
User clicks "Sign in with Google"
         ↓
Firebase initiates OAuth flow
         ↓
Google authenticates user
         ↓
Firebase returns ID token
         ↓
Frontend → POST /api/auth/google { idToken }
         ↓
Backend verifies token with Google
         ↓
Backend returns user data
         ↓
User redirected to /groups
```

## 🔐 Security Notes

- ID tokens are short-lived (1 hour)
- Backend verifies signature and expiration
- Never expose Firebase config or API keys in client code
- Use environment variables for sensitive data
- In production, implement JWT tokens for session management
