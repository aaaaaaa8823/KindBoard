package com.kind.backend.repository;

import com.kind.backend.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
    List<Recognition> findAllByOrderByCreatedAtDesc();

    @Query(""" 
    select COALESCE(SUM(r.points), 0) from Recognition r
    where r.receiver.id = :userId
    and r.status = 'active'
    and r.createdAt >= :from
    and r.createdAt < :to
""")
    Integer sumPointsReceivedBetween(
            @Param("userId") Long userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
