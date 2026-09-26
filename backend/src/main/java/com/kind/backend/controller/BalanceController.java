package com.kind.backend.controller;

import com.kind.backend.dto.response.BalanceResponce;
import com.kind.backend.service.BalanceSerive;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/balances")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceSerive balanceService;

    @GetMapping("/me")
    public BalanceResponce me() {
        return balanceService.getMyBalance();
    }
}