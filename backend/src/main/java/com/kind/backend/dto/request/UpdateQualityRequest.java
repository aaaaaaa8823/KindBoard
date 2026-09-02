package com.kind.backend.dto.request;

import lombok.Data;

@Data
public class UpdateQualityRequest {
    private String name;
    private String code;
    private Boolean active;
}
