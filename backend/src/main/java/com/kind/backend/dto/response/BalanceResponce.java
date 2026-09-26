package com.kind.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class BalanceResponce {
    private Integer giveablePoints;
    private LocalDate lastResetDate;
}
