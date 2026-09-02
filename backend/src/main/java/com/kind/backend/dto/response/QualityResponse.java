package com.kind.backend.dto.response;

import lombok.Data;

@Data
public class QualityResponse {
    private Long id;
    private String name;
    private String code;
    private boolean active;
}
