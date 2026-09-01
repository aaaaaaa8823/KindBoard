package com.kind.backend.repository;

import com.kind.backend.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RecognitionRepository extends JpaRepository<Recognition, Long>{
}
