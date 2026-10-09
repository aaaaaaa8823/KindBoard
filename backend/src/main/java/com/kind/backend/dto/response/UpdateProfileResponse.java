package com.kind.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileResponse {
    private UserResponse user;
    private String token;
    private String type = "Bearer";
}
