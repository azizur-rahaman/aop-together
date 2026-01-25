package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import com.cg4academy.backend.dto.UserRoomStatusDTO;
import com.cg4academy.backend.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/{id}/room-status")
    public ResponseEntity<ApiResponse<UserRoomStatusDTO>> getUserRoomStatus(@PathVariable String id) {
        UserRoomStatusDTO status = roomService.getUserRoomStatus(id);
        return ResponseEntity.ok(ApiResponse.success(status));
    }
}
