package com.kind.backend.service.impl;

import com.kind.backend.dto.request.LoginRequest;
import com.kind.backend.dto.request.RegisterRequest;
import com.kind.backend.dto.response.AuthResponse;
import com.kind.backend.model.UserBalance;
import com.kind.backend.repository.UserBalanceRepository;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.security.JwtService;
import com.kind.backend.service.AuthService;
import com.kind.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserBalanceRepository userBalanceRepository;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already in use");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("user");
        user.setActive(true);

        User saved = userRepository.save(user);

        UserBalance balance = new UserBalance();
        balance.setUser(saved);
        balance.setGiveablePoints(50);
        balance.setLastResetDate(LocalDate.now());
        userBalanceRepository.save(balance);

        String token = jwtService.generateToken(saved.getEmail());
        return toAuthResponse(saved, token);
    }

    @Override
    public AuthResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new RuntimeException("Envalid email or password")
        );

        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("User is deactivated");
        }

        String token = jwtService.generateToken(user.getEmail());
        return toAuthResponse(user, token);
    }

    private AuthResponse toAuthResponse(User user, String token){
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}
