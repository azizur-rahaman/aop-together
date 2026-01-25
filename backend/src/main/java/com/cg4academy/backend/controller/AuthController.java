package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import com.cg4academy.backend.dto.GoogleLoginRequest;
import com.cg4academy.backend.service.AuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<Object>> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdToken.Payload payload = authService.verifyGoogleToken(request.getIdToken());
            // Here you would typically check if the user exists in your database,
            // create them if they don't, and return a JWT or session.
            // For now, we just return the payload data.
            return ResponseEntity.ok(ApiResponse.success(payload, "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Authentication failed: " + e.getMessage(), null));
        }
    }
}
