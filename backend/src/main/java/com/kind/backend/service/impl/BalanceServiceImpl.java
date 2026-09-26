package com.kind.backend.service.impl;

import com.kind.backend.dto.response.BalanceResponce;
import com.kind.backend.model.User;
import com.kind.backend.model.UserBalance;
import com.kind.backend.repository.UserBalanceRepository;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.service.BalanceSerive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceSerive {

    private static final int dailyLim = 50;

    private final UserRepository userRepository;
    private final UserBalanceRepository userBalanceRepository;

    @Override
    @Transactional
    public BalanceResponce getMyBalance() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserBalance balance = userBalanceRepository.findByUserId(user.getId())
                .orElseGet(() -> createBalance(user));

        resetIfNewDay(balance);
        userBalanceRepository.save(balance);

        return new BalanceResponce(
                balance.getGiveablePoints(),
                balance.getLastResetDate()
        );
    }

    private UserBalance createBalance(User user) {
        UserBalance balance = new UserBalance();
        balance.setUser(user);
        balance.setGiveablePoints(dailyLim);
        balance.setLastResetDate(LocalDate.now());
        return userBalanceRepository.save(balance);
    }

    private void resetIfNewDay(UserBalance balance) {
        LocalDate today = LocalDate.now();
        if (balance.getLastResetDate() == null || balance.getLastResetDate().isBefore(today)) {
            balance.setGiveablePoints(dailyLim);
            balance.setLastResetDate(today);
        }
    }
}
