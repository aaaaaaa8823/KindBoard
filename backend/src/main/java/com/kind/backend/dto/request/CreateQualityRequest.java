package com.kind.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateQualityRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String code;
}
