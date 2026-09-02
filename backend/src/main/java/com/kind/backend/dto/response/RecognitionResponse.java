package com.kind.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RecognitionResponse {
    private Long id;

    private Long giver_id;
    private String giverUsername;

    private Long receiver_id;
    private String receiverUsername;

    private Long quality_id;
    private String qualityUsername;
    private String qualityCode;

    private String message;

    private Integer points;

    private String status;

    private LocalDateTime createdAt;
}
