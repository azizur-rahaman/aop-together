package com.cg4academy.backend.service;

import com.cg4academy.backend.dto.CreateRoomRequest;
import com.cg4academy.backend.dto.UserRoomStatusDTO;
import com.cg4academy.backend.exception.BusinessException;
import com.cg4academy.backend.exception.ResourceNotFoundException;
import com.cg4academy.backend.model.Participant;
import com.cg4academy.backend.model.Room;
import com.cg4academy.backend.repository.ParticipantRepository;
import com.cg4academy.backend.repository.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    public List<Room> getAllRooms(String subject) {
        if (subject != null && !subject.isEmpty()) {
            return roomRepository.findBySubject(subject);
        }
        return roomRepository.findAll();
    }

    @Transactional
    public Room createRoom(CreateRoomRequest request) {
        Room room = new Room();
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setSubject(request.getSubject());
        room.setMaxParticipants(request.getMaxParticipants());
        room.setPublic(request.isPublic());
        room.setHostId(request.getHostId());
        room.setParticipantCount(0);

        Room savedRoom = roomRepository.save(room);

        // Auto-join the host
        joinRoom(savedRoom.getId(), request.getHostId());

        return savedRoom;
    }

    public Optional<Room> getRoomById(String id) {
        return roomRepository.findById(id);
    }

    @Transactional
    public void joinRoom(String roomId, String userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        // Check if user is already in THIS room
        Optional<Participant> existing = participantRepository.findByUserId(userId);
        if (existing.isPresent()) {
            if (existing.get().getRoomId().equals(roomId)) {
                return; // Already in this room
            } else {
                throw new BusinessException("User is already in another room");
            }
        }

        // Check capacity
        if (room.getParticipantCount() >= room.getMaxParticipants()) {
            throw new BusinessException("Room is full");
        }

        Participant participant = new Participant(userId, roomId);
        participantRepository.save(participant);

        room.setParticipantCount(room.getParticipantCount() + 1);
        roomRepository.save(room);
    }

    @Transactional
    public void leaveRoom(String roomId, String userId) {
        Participant participant = participantRepository.findByUserId(userId)
                .filter(p -> p.getRoomId().equals(roomId))
                .orElseThrow(() -> new BusinessException("User is not in this room"));

        participantRepository.delete(participant);

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (room.getParticipantCount() > 0) {
            room.setParticipantCount(room.getParticipantCount() - 1);
            roomRepository.save(room);
        }
    }

    public UserRoomStatusDTO getUserRoomStatus(String userId) {
        Optional<Participant> participant = participantRepository.findByUserId(userId);
        if (participant.isPresent()) {
            return new UserRoomStatusDTO(true, participant.get().getRoomId(), userId);
        }
        return new UserRoomStatusDTO(false, null, userId);
    }
}
