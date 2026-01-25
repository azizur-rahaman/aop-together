package com.cg4academy.backend.dto;

public class UserRoomStatusDTO {
    private boolean isInRoom;
    private String roomId;
    private String userId;

    public UserRoomStatusDTO(boolean isInRoom, String roomId, String userId) {
        this.isInRoom = isInRoom;
        this.roomId = roomId;
        this.userId = userId;
    }

    public boolean isInRoom() {
        return isInRoom;
    }

    public void setInRoom(boolean inRoom) {
        isInRoom = inRoom;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
