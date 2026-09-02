package com.kind.backend.service;

import com.kind.backend.dto.request.CreateQualityRequest;
import com.kind.backend.dto.request.UpdateQualityRequest;
import com.kind.backend.dto.response.QualityResponse;

import java.util.List;

public interface QualityService {
    List<QualityResponse> getAll();
    QualityResponse getById(Long id);
    QualityResponse create(CreateQualityRequest request);
    QualityResponse update(Long id, UpdateQualityRequest request);
    void delete(Long id);
}
