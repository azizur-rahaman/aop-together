# Google Sign-In Implementation Details

This document outlines the technical implementation of the Google Sign-In feature in the backend.

## Overview

The backend provides an endpoint to verify the Google ID Token received from the frontend. This ensures that the user is authenticated with Google and allows the backend to securely identify the user.

## Dependencies

We utilize the official Google API Client libraries for Java to handle token verification standardly and securely.

**`pom.xml`**:
```xml
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.0.0</version>
</dependency>
<dependency>
    <groupId>com.google.oauth-client</groupId>
    <artifactId>google-oauth-client-jetty</artifactId>
    <version>1.34.1</version>
</dependency>
```

## Configuration

The Google Client ID is configured in `src/main/resources/application.properties`. This ID must match the one used in the frontend application.

```properties
google.client.id=YOUR_GOOGLE_CLIENT_ID
```
*Note: In a production environment, this should be set via an environment variable.*

## Components

### 1. `AuthService`
**Location**: `src/main/java/com/cg4academy/backend/service/AuthService.java`

- **Purpose**: Encapsulates the logic for verifying the Google ID Token.
- **Key Method**: `verifyGoogleToken(String idTokenString)`
- **Logic**:
    - Initializes a `GoogleIdTokenVerifier` with the configured `google.client.id`.
    - Verifies the integrity and expiration of the token.
    - Returns the `GoogleIdToken.Payload` (containing email, name, sub, etc.) if valid.
    - Throws `IllegalArgumentException` or `GeneralSecurityException` if invalid.

### 2. `AuthController`
**Location**: `src/main/java/com/cg4academy/backend/controller/AuthController.java`

- **Purpose**: Exposes the REST API endpoint.
- **Endpoint**: `POST /api/auth/google`
- **Request Body**: `GoogleLoginRequest`
  ```json
  {
      "idToken": "eyJhbGciOiJSUzI1NiIs..."
  }
  ```
- **Response**: `ApiResponse<Object>`
    - **Success (200)**: Returns user details from the token payload.
    - **Failure (401)**: Returns an error message if verification fails.

## Data Flow

1. **Frontend**: User signs in with Google and receives an `idToken`.
2. **Frontend**: Sends valid `idToken` to Backend via `POST /api/auth/google`.
3. **Backend (`AuthController`)**: Receives request and calls `AuthService`.
4. **Backend (`AuthService`)**: Contacts Google's public keys (cached) to verify the token signature and checks the Audience (Client ID).
5. **Backend**: 
    - If valid: Returns user info (Email, Name, Picture).
    - If invalid: Returns 401 Unauthorized.

## Next Steps for Expansion
- **User Persistence**: Currently, the backend only verifies the token. The next step is to check if the user exists in a local database (using the Google `sub` as a key) and register them if not.
- **Session Management**: Issue a session cookie or a backend-specific JWT (e.g., using Spring Security) for subsequent requests.
