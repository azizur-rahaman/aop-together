# CG4Academy Frontend - UI Design

This is the **UI-only version** of the CG4Academy study room application. It contains all the design components and layouts with mock data, without any backend integration.

## 🎨 What's Inside

This frontend showcase includes:

- **Landing Page** - Hero section with animated Lottie elements
- **Study Rooms Page** - Browse and filter study rooms by subject
- **Room Detail Page** - Video call interface and participant sidebar
- **UI Components** - Complete component library using shadcn/ui and Radix UI
- **Mock Data** - Simulated subjects, rooms, and users for demonstration

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── groups/            # Study rooms pages
│       ├── page.tsx       # Rooms list
│       ├── _components/   # Room-specific components
│       └── [id]/          # Individual room page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── base/             # Custom base components
│   └── Navbar.tsx        # Navigation component
├── lib/                  # Utilities and helpers
│   ├── mockData.ts       # Mock data for demo
│   └── utils.ts          # Utility functions
└── public/               # Static assets
    ├── images/           # Image files
    └── lottie/           # Lottie animation files
```

## 🎭 Mock Data

All data in this version is mocked and stored in [lib/mockData.ts](lib/mockData.ts). This includes:

- **Subjects**: 8 different study subjects (Math, Physics, Chemistry, etc.)
- **Rooms**: 5 pre-configured study rooms with participants
- **User**: A demo user profile
- **Problems**: Sample study problems

## 🎨 Design System

The application uses:

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible component primitives
- **Lottie** - Animated illustrations
- **Motion** (Framer Motion) - Animation library
- **Three.js** - 3D graphics

## 🔑 Key Features (UI Only)

✅ Responsive design for mobile, tablet, and desktop
✅ Subject filtering and room browsing
✅ Room creation modal with form validation
✅ Video call placeholder interface (Jitsi SDK integrated)
✅ Participant sidebar with mock participants
✅ User authentication UI (no real auth)
✅ Toast notifications for user actions

## 🚫 What's NOT Included

This UI-only version does NOT include:

- ❌ Real authentication (Firebase removed)
- ❌ Backend API integration
- ❌ Database connectivity
- ❌ Real-time video/audio functionality
- ❌ Persistent data storage
- ❌ User management

## 📝 Notes

- This is designed for **UI demonstration and design review** purposes
- Mock data is hardcoded in `lib/mockData.ts`
- All interactions use `localStorage` for simple state persistence
- Components are ready to be connected to a real backend

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

## 📦 Tech Stack

- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React
- **Animations**: Motion, Lottie
- **3D**: Three.js, @react-three/fiber

## 📄 License

This is a UI showcase for the CG4Academy project.

---

**For the full application with backend integration, please refer to the main project repository.**
