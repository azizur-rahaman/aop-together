package com.cg4academy.backend.repository;

import com.cg4academy.backend.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, String> {
    Optional<Participant> findByUserId(String userId);

    List<Participant> findByRoomId(String roomId);

    void deleteByUserIdAndRoomId(String userId, String roomId);
}
