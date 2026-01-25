package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Object>> checkHealth() {
        return ResponseEntity.ok(ApiResponse.success(
            Map.of("status", "UP"),
            "Backend is running"
        ));
    }
}
