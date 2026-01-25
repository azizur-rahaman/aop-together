package com.cg4academy.backend.controller;

import com.cg4academy.backend.dto.ApiResponse;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/livekit")
public class LiveKitController {

    @Value("${livekit.api.key}")
    private String apiKey;

    @Value("${livekit.api.secret}")
    private String apiSecret;

    @PostMapping("/token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getToken(@RequestBody Map<String, String> payload) {
        String roomName = payload.get("roomName");
        String participantName = payload.get("participantName");

        AccessToken token = new AccessToken(apiKey, apiSecret);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        return ResponseEntity.ok(ApiResponse.success(Map.of("token", token.toJwt()), "Token generated"));
    }
}
