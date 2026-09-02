package com.kind.backend.repository;

import com.kind.backend.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
    List<Recognition> findAllByOrderByCreatedAtDesc();
}
