package com.kind.backend.service;

import com.kind.backend.dto.request.CreateUserRequest;
import com.kind.backend.dto.request.UpdateUserRequest;
import com.kind.backend.dto.response.UserResponse;

import java.util.List;

/**
 * Сервис юзера: создание, удаление, обновление.
 */
public interface UserService {
    List<UserResponse> getAll();
    UserResponse getById(Long id);
    UserResponse create(CreateUserRequest request);
    UserResponse update(Long id, UpdateUserRequest request);
    void delete(Long id);
}
