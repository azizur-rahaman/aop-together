package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import com.cg4academy.backend.service.JitsiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jitsi")
public class JitsiController {

    @Autowired
    private JitsiService jitsiService;

    @PostMapping("/token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getToken(@RequestBody Map<String, Object> payload) {
        String roomName = (String) payload.get("roomName");
        String userName = (String) payload.get("userName");
        String userEmail = (String) payload.get("userEmail");
        String userId = (String) payload.get("userId");
        boolean isModerator = Boolean.TRUE.equals(payload.get("isModerator")); // Simple check

        String token = jitsiService.generateToken(roomName, userName, userEmail, userId, isModerator);

        return ResponseEntity.ok(ApiResponse.success(Map.of("token", token), "Token generated"));
    }

}
