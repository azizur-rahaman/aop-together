# Final Project Report: Study Together

**Submitted by:** [Your Name/Team Name]  
**Date:** January 25, 2026

---

## 1. Project Motivation and Problem Statement

### Motivation
In an era of remote learning and digital collaboration, students arguably face more isolation than ever before. While there are many tools for video conferencing (Zoom, Teams) or solitary study (Flashcard apps), there is a gap in accessible, impromptu "virtual libraries" where students can simply drop in, find a peer group, and study together in silence or collaboration.

### Problem Statement
Existing solutions are either too formal (scheduled classes), too broad (generic social media), or too expensive. Students lack a lightweight, focused platform to instantly create or join a "Study Room" based on a specific subject, utilizing modern video conferencing tools without the hassle of scheduling or complex setups.

---

## 2. Project Idea and Objectives

### Core Idea
**"Study Together"** is a full-stack web application that allows users to create and join virtual study rooms. It leverages **Next.js** for a responsive frontend and **Spring Boot** for a robust backend, with real-time video conferencing powered by **Jitsi Meet**.

### Objectives
1.  **Seamless Authentication:** Secure login using Google OAuth (Firebase).
2.  **Room Management (CRUD):** Users can create public study rooms with subjects (e.g., Math, Science), view active rooms, and delete their own rooms.
3.  **Real-time Collaboration:** Integrate low-latency video and audio communication for room participants.
4.  **Scalable Architecture:** Use a separated frontend/backend architecture to allow independent scaling.
5.  **Robust Backend:** Implement RESTful APIs with validation, error handling, and concurrency management.

---

## 3. High-Level System Architecture

The project follows a modern **Client-Server Architecture**:

-   **Frontend (Client):** 
    -   Built with **Next.js 14+ (React)** and **TypeScript**.
    -   Uses **Tailwind CSS** and **Radix UI** for a polished, responsive user interface.
    -   Manages client-side state and communicates with the backend via REST APIs.
    -   Integrates **Firebase Authentication** for identity management.
-   **Backend (Server):** 
    -   Built with **Java 17** and **Spring Boot 3.x**.
    -   Exposes **RESTful API endpoints** for managing rooms and user sessions.
    -   Uses **Spring Data JPA** with an **H2 In-Memory Database** (for development speed and portability).
    -   Generates secure **JWT Tokens** for Jitsi Meet sessions.
-   **External Services:**
    -   **Firebase Auth:** Verifies user identity.
    -   **Jitsi Meet (JaaS):** Provides the video/audio infrastructure (WebRTC).

---

## 4. Design Approach and Solution Workflow

### Design Philosophy
1.  **"API First" Design:** The backend API was defined to support specific frontend requirements (e.g., "Get all rooms," "Join room").
2.  **Component-Based UI:** The frontend is built using reusable components (e.g., `RoomCard`, `SocialButton`) to ensure consistency.
3.  **Service Layer Pattern:** Business logic (joining a room, validation) is encapsulated in Service classes (`RoomService`), keeping Controllers clean.

### Solution Workflow
1.  **User Login:** User clicks "Sign in with Google." Firebase returns an ID Token.
2.  **Verification:** Frontend sends the ID Token to the Spring Boot backend (`/api/auth/google`). Backend verifies it with Google servers.
3.  **Dashboard:** Authenticated user sees a list of active rooms fetched from `/api/rooms`.
4.  **Create/Join:** User creates a room (POST `/api/rooms`) or joins one.
5.  **Video Session:** Upon joining, the backend generates a signed JWT. The frontend uses this token to initialize the Jitsi Meet iframe, granting the user access to the video call.

---

## 5. Feature Descriptions

### Backend Responsibilities
-   **Room Management:** Handles creation, retrieval, and deletion of rooms. Enforces limits (e.g., max participants).
-   **User Tracking:** Tracks which user is in which room to prevent double-joining.
-   **Security:** Validates Google ID tokens and generates Jitsi JWTs signed with a private key.

### Frontend Responsibilities
-   **UI/UX:** dynamic landing page with animations (Lottie), responsive dashboard grid.
-   **State Management:** React hooks (`useState`, `useEffect`) manage user session and room lists.
-   **Video Integration:** Wraps the Jitsi External API to render video streams directly in the browser.

---

## 6. REST API Design and Implementation

The project implements a strict RESTful interface. Key endpoints include:

| Method | Endpoint | Description | Responsibilities |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/google` | Login/Signup | Verifies Google Token; creates user in DB if new. |
| `GET` | `/api/rooms` | List Rooms | Returns all active study rooms. |
| `POST` | `/api/rooms` | Create Room | Creates a new room entry. Requires Auth. |
| `GET` | `/api/rooms/{id}` | Get Room Details | Returns metadata for a specific room. |
| `POST` | `/api/rooms/{id}/join` | Join Room | Adds user to room participants; checks capacity. |
| `GET` | `/api/jitsi/token` | Get Video Token | Returns a signed JWT for accessing Jitsi video. |

---

## 7. Networking Components

The detailed networking implementation involves two distinct layers:

1.  **HTTP/REST (Application Layer):** All control messages (creating rooms, fetching lists) happen over standard HTTP 1.1/2 calls using JSON payloads.
2.  **WebRTC (Media Layer):** The actual voice and video data bypasses our backend and goes directly between clients and the Jitsi Video Bridge (JVB). This ensures low latency and high quality.
    -   **Deep Dive:** The backend facilitates this by acting as a trusted signaling server that issues "tickets" (JWTs) allowing clients to connect to the Jitsi network.

---

## 8. Use of Threads and Concurrency

While the business logic logic is straightforward, Concurrency is critical for the server's performance:

1.  **Request Handling (Thread-per-Request):** The Spring Boot (Tomcat) embedded server manages a thread pool. Each incoming API request (e.g., 50 users joining rooms simultaneously) is assigned a separate worker thread. This allows the application to handle multiple users concurrently without blocking.
2.  **Jitsi Token Expiry:** The `JitsiService` generates tokens with a specific expiration time (`System.currentTimeMillis() + 3600 * 1000`). This relies on system time consistency and ensures that stale sessions are automatically invalidated, a key aspect of temporal correctness in distributed systems.
3.  **Database Transactions:** The `@Transactional` annotation in `RoomService` ensures that operations like "Join Room" (which involves checking capcity, adding a participant, and updating the count) happen atomically. This prevents race conditions where two users might join the last spot in a room simultaneously.

---

## 9. Conclusion

"Study Together" successfully demonstrates a full-stack engineering capability. By combining a high-performance Java backend with a dynamic React frontend and third-party video infrastructure, it solves a real-world problem for students. The code is modular, the API is strict, and the system is ready for future expansion (e.g., chat history, file sharing).
