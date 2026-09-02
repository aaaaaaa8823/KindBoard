package com.kind.backend.service;

import com.kind.backend.dto.request.CreateQualityRequest;
import com.kind.backend.dto.request.CreateRecognitionRequest;
import com.kind.backend.dto.response.RecognitionResponse;

import java.util.List;

public interface RecognitionService {
    List<RecognitionResponse> getAll();
    RecognitionResponse getById(Long id);
    RecognitionResponse create(CreateRecognitionRequest request);
    void delete(Long id);
}
