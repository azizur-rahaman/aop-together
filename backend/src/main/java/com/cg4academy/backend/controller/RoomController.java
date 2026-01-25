package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import com.cg4academy.backend.dto.CreateRoomRequest;
import com.cg4academy.backend.model.Room;
import com.cg4academy.backend.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms(@RequestParam(required = false) String subject) {
        List<Room> rooms = roomService.getAllRooms(subject);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Room>> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        Room createdRoom = roomService.createRoom(request);
        return ResponseEntity.ok(ApiResponse.success(createdRoom, "Room created successfully"));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<Void>> joinRoom(@PathVariable String id,
            @Valid @RequestBody com.cg4academy.backend.dto.JoinRoomRequest request) {
        roomService.joinRoom(id, request.getUserId());
        return ResponseEntity.ok(ApiResponse.success(null, "Joined room successfully"));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveRoom(@PathVariable String id,
            @Valid @RequestBody com.cg4academy.backend.dto.JoinRoomRequest request) {
        roomService.leaveRoom(id, request.getUserId());
        return ResponseEntity.ok(ApiResponse.success(null, "Left room successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable String id) {
        Optional<Room> room = roomService.getRoomById(id);
        if (room.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(room.get()));
        } else {
            // This fallback is fine, but typically handled by GlobalExceptionHandler if
            // service threw exception
            // Since service returns Optional, controller handles it here.
            // Alternatively, we could change service to throw exception if desired, but
            // this pattern is also valid.
            return ResponseEntity.status(404).body(ApiResponse.error(404, "Room not found", null));
        }
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getParticipants(@PathVariable String id) {
        List<com.cg4academy.backend.model.Participant> participants = roomService.getParticipants(id);
        return ResponseEntity.ok(ApiResponse.success(java.util.Map.of(
                "participants", participants,
                "count", participants.size())));
    }
}
