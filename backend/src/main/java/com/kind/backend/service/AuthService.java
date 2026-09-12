package com.kind.backend.service;

import com.kind.backend.dto.request.LoginRequest;
import com.kind.backend.dto.request.RegisterRequest;
import com.kind.backend.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
