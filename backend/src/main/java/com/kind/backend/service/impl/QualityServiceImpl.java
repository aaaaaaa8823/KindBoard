package com.kind.backend.service.impl;

import com.kind.backend.dto.request.CreateQualityRequest;
import com.kind.backend.dto.request.UpdateQualityRequest;
import com.kind.backend.dto.response.QualityResponse;
import com.kind.backend.repository.QualityRepository;
import com.kind.backend.service.QualityService;
import com.kind.backend.model.Quality;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QualityServiceImpl implements QualityService {

    private final QualityRepository qualityRepository;

    @Override
    public List<QualityResponse> getAll(){
        return qualityRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public QualityResponse getById(Long id){
        Quality quality = qualityRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Not found" + id));
        return toResponse(quality);
    }

    @Override
    @Transactional
    public QualityResponse create(CreateQualityRequest request) {
        if (qualityRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Quality code already exists: " + request.getCode());
        }

        Quality quality = new Quality();
        quality.setName(request.getName());
        quality.setCode(request.getCode().toUpperCase());
        quality.setActive(true);

        return toResponse(qualityRepository.save(quality));
    }

    @Override
    @Transactional
    public QualityResponse update(Long id, UpdateQualityRequest request) {
        Quality quality = qualityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
        if (request.getName() != null && !request.getName().isBlank()) {
            quality.setName(request.getName());
        }
        if (request.getCode() != null && !request.getCode().isBlank()) {
            quality.setCode(request.getCode().toUpperCase());
        }
        if (request.getActive() != null) {
            quality.setActive(request.getActive());
        }

        return toResponse(qualityRepository.save(quality));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!qualityRepository.existsById(id)) {
            throw new RuntimeException("Quality not found: " + id);
        }
        qualityRepository.deleteById(id);
    }

    private QualityResponse toResponse(Quality quality) {
        QualityResponse dto = new QualityResponse();
        dto.setId(quality.getId());
        dto.setName(quality.getName());
        dto.setCode(quality.getCode());
        dto.setActive(quality.isActive());
        return dto;
    }
}
