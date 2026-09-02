package com.kind.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NonNull;

@Data
public class CreateRecognitionRequest {
    @NonNull
    private Long giver_id; //потом через auth

    @NotNull
    private Long receiver_id;

    @NotNull
    private Long quality_id;

    @NotBlank
    private String message;

    @NotNull
    @Min(1)
    private Integer points;

}
