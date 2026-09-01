package com.kind.backend.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;

    @Email
    private String email;
}
