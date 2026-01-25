package com.cg4academy.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinRoomRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    public JoinRoomRequest() {
    }

    public JoinRoomRequest(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
