package com.kind.backend.service.impl;

import com.kind.backend.dto.request.ChangePasswordRequest;
import com.kind.backend.dto.request.CreateUserRequest;
import com.kind.backend.dto.request.UpdateUserRequest;
import com.kind.backend.dto.response.UserResponse;
import com.kind.backend.model.User;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.service.RecognitionService;
import com.kind.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Реализация {@link UserService}
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UserResponse getById(Long id){
        User user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Not found" + id));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse create(CreateUserRequest request){
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exist");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole(): "user");
        user.setActive(true);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found" + id));
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id){
        if(!userRepository.existsById(id)) {
            throw new RuntimeException("Not found" + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user){
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());

        if (user.getDepartment() != null) {
            dto.setDepartmentName(user.getDepartment().getName());
        } else {
            dto.setDepartmentName(null);
        }

        return dto;
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new RuntimeException("New password must be different");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

}
