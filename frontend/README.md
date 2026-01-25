# CG4Academy Frontend

This is the frontend application for CG4Academy study room platform. It features Google authentication with backend API integration, allowing users to join virtual study rooms and collaborate in real-time.

## 🎨 What's Inside

This frontend includes:

- **Landing Page** - Hero section with animated Lottie elements and Google Sign-In
- **Study Rooms Page** - Browse and filter study rooms by subject
- **Room Detail Page** - Video call interface and participant sidebar
- **UI Components** - Complete component library using shadcn/ui and Radix UI
- **Google Authentication** - Firebase authentication with backend verification
- **Protected Routes** - Authentication-based route protection

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm
- Firebase project (for Google authentication)
- Backend API running (see backend folder)

### Installation

```bash
# Install dependencies
pnpm install
```

### Configuration

1. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication in Firebase Authentication
   - Get your Firebase configuration

2. **Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_MEASUREMENT_ID=your-measurement-id

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Authentication Flow

1. User clicks "Sign in with Google" on landing page
2. Firebase initiates Google OAuth flow
3. Upon successful authentication, Firebase returns an ID token
4. Frontend sends ID token to backend API (`POST /api/auth/google`)
5. Backend verifies the token with Google
6. Backend returns user data
7. User is redirected to study rooms page

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page with Google Sign-In
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── groups/            # Study rooms pages (protected)
│       ├── layout.tsx     # Groups layout with ProtectedRoute
│       ├── page.tsx       # Rooms list
│       ├── _components/   # Room-specific components
│       └── [id]/          # Individual room page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   │   └── ProtectedRoute.tsx
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── base/             # Custom base components
│   └── Navbar.tsx        # Navigation with auth state
├── lib/                  # Utilities and helpers
│   ├── firebase/         # Firebase configuration
│   │   └── client.ts
│   ├── api.ts            # Backend API client
│   ├── mockData.ts       # Mock data for demo
│   └── utils.ts          # Utility functions
└── public/               # Static assets
    ├── images/           # Image files
    └── lottie/           # Lottie animation files
```

## 🔑 Key Features

✅ Google OAuth authentication via Firebase
✅ Backend API integration for user verification
✅ Protected routes with authentication guards
✅ Responsive design for mobile, tablet, and desktop
✅ Subject filtering and room browsing
✅ Room creation with form validation
✅ Video call interface (Jitsi SDK)
✅ Real-time participant updates
✅ Toast notifications for user feedback

## 🔧 Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 📡 API Integration

The frontend communicates with the backend API using the `api` utility in `lib/api.ts`:

```typescript
import { api } from "@/lib/api";

// POST request example
const response = await api.post('/auth/google', { idToken });

// GET request example
const data = await api.get('/rooms');
```

### Available Endpoints

- `POST /api/auth/google` - Verify Google ID token
- `GET /api/subjects` - Get all subjects
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create a room
- `POST /api/rooms/{id}/join` - Join a room
- `POST /api/rooms/{id}/leave` - Leave a room

## 🌐 Backend Setup

This frontend requires the Spring Boot backend to be running. Please ensure:

1. Backend is running on `http://localhost:8080` (or update `NEXT_PUBLIC_API_URL`)
2. Google Client ID is configured in backend's `application.properties`
3. Backend has proper CORS configuration for `http://localhost:3000`

## 📦 Tech Stack

- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Animations**: Motion, Lottie
- **3D**: Three.js, @react-three/fiber
- **API Client**: Fetch API with custom wrapper

## 🚨 Important Notes

- Firebase credentials must be configured in `.env.local`
- Backend API must be running for authentication to work
- Google OAuth must be enabled in both Firebase and backend
- The same Google Client ID must be used in both frontend (Firebase) and backend

## 📄 License

This is part of the CG4Academy project.

---

**For backend setup, please refer to the backend folder in the main repository.**
