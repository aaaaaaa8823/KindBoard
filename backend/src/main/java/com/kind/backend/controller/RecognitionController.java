package com.kind.backend.controller;

import com.kind.backend.dto.request.CreateRecognitionRequest;
import com.kind.backend.dto.response.RecognitionResponse;
import com.kind.backend.service.RecognitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recognitions")
@RequiredArgsConstructor
public class RecognitionController {

    private final RecognitionService recognitionService;

    @GetMapping
    public List<RecognitionResponse> getAll() {
        return recognitionService.getAll();
    }

    @GetMapping("/{id}")
    public RecognitionResponse getById(@PathVariable Long id) {
        return recognitionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecognitionResponse create(@Valid @RequestBody CreateRecognitionRequest request) {
        return recognitionService.create(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        recognitionService.delete(id);
    }
}