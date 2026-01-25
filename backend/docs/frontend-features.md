# Frontend Features Analysis & API Requirements

This document details the features identified in the frontend application and outlines the corresponding backend API endpoints required to support them.

## 1. Authentication
**Status**: Partially Implemented
- **Feature**: User signs in using Google.
- **Frontend File**: `components/Navbar.tsx`
- **Current Flow**: Uses Firebase Auth on client.
- **Required Backend Endpoints**:
    - `POST /api/auth/google`: Verify Google ID Token and retrieve/register user. (Implemented)
    - `POST /api/auth/logout`: (Optional) Invalidate session if backend sessions are used.

## 2. Subjects
**Status**: To Be Implemented
- **Feature**: Display a list of study subjects (e.g., Math, Science) to categorize rooms.
- **Frontend File**: `app/groups/page.tsx`, `app/groups/services/subjects.service.ts`
- **Data Structure**:
    ```json
    {
        "id": "string",
        "name": "string",
        "icon": "string" // URL or icon name
    }
    ```
- **Required Backend Endpoints**:
    - `GET /api/subjects`: Fetch all available subjects.

## 3. Study Rooms (Groups)
**Status**: To Be Implemented
- **Feature**: Users can view, search, create, and join study rooms.
- **Frontend File**: `app/groups/page.tsx`, `app/groups/services/rooms.service.ts`

### 3.1 List Rooms
- **Feature**: Display a grid of active study rooms.
- **Filter**: Filter by `Selected Subject`.
- **Data Structure**:
    ```json
    {
        "id": "string",
        "name": "string",
        "description": "string",
        "subject": "string", // Subject Name or ID
        "hostId": "string",
        "maxParticipants": "number",
        "participantCount": "number",
        "isPublic": "boolean",
        "status": "string" // 'active'
    }
    ```
- **Required Backend Endpoints**:
    - `GET /api/rooms`: Fetch all active rooms.
    - `GET /api/rooms?subject={subjectName}`: Fetch rooms filtered by subject.

### 3.2 Create Room
- **Feature**: Authenticated users can create a new room.
- **Frontend Logic**: Checks if user is already in a room before creating.
- **Payload**:
    ```json
    {
        "name": "string",
        "description": "string",
        "subject": "string",
        "maxParticipants": "number",
        "isPublic": "boolean",
        "hostId": "string"
    }
    ```
- **Required Backend Endpoints**:
    - `POST /api/rooms`: Create a new room.

### 3.3 Join/Leave Room
- **Feature**: Users join a room to participate. Logic exists to ensure a user is only in one room at a time.
- **Frontend File**: `app/groups/[id]/services/join.service.ts` (implied)
- **Required Backend Endpoints**:
    - `GET /api/users/{userId}/room-status`: Check if a user is currently in a room.
    - `POST /api/rooms/{roomId}/join`: Add user to a room (increment count).
    - `POST /api/rooms/{roomId}/leave`: Remove user from a room (decrement count).

### 3.4 Room Details & Video
- **Feature**: Detailed view of a room, including video call functionality.
- **Frontend File**: `app/groups/[id]/page.tsx`, `app/groups/[id]/_components/VideoCallView.tsx`
- **Required Backend Endpoints**:
    - `GET /api/rooms/{id}`: Fetch details for a specific room.
    - `POST /api/rooms/{id}/token`: (If using a video provider like LiveKit/Agora) Generate a video token for the user.

## 4. User Profile
- **Status**: To Be Implemented
- **Feature**: Display user information in the Navbar.
- **Frontend File**: `components/Navbar.tsx`
- **Required Backend Endpoints**:
    - `GET /api/users/me` or ensure `POST /api/auth/google` returns full profile.

## Summary of New Endpoints Needed

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/subjects` | List all subjects |
| `GET` | `/api/rooms` | List all rooms (optional filter) |
| `POST` | `/api/rooms` | Create a room |
| `GET` | `/api/rooms/{id}` | Get room details |
| `POST` | `/api/rooms/{id}/join` | Join a room |
| `POST` | `/api/rooms/{id}/leave` | Leave a room |
| `GET` | `/api/users/{id}/room-status` | Check if user is in a room |
