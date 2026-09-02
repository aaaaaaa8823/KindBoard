package com.kind.backend.controller;

import com.kind.backend.dto.request.CreateQualityRequest;
import com.kind.backend.dto.request.UpdateQualityRequest;
import com.kind.backend.dto.response.QualityResponse;
import com.kind.backend.dto.response.UserResponse;
import com.kind.backend.service.QualityService;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/qualities")
@RequiredArgsConstructor
public class QualityController {

    private final QualityService qualityService;

    @GetMapping
    public List<QualityResponse> getAll(){
        return qualityService.getAll();
    }

    @GetMapping("/{id}")
    public QualityResponse getById(@PathVariable Long id){
        return qualityService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QualityResponse create(@Valid @RequestBody CreateQualityRequest request){
        return  qualityService.create(request);
    }

    @PutMapping("/{id}")
    public QualityResponse update(@PathVariable Long id, @Valid @RequestBody UpdateQualityRequest request){
        return qualityService.update(id,request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){
        qualityService.delete(id);
    }

}
