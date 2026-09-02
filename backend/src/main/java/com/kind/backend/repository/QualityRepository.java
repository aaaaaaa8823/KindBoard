package com.kind.backend.repository;

import com.kind.backend.model.Quality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QualityRepository extends JpaRepository<Quality, Long>{
    Optional<Quality> findByCode(String code);
    boolean existsByCode(String code);
}
