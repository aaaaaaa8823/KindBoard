package com.kind.backend.controller;

import com.kind.backend.dto.response.CategoryRankingEntryResponse;
import com.kind.backend.dto.response.RankingEntryResponse;
import com.kind.backend.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/monthly")
    public List<RankingEntryResponse> monthly(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return rankingService.getMonthlyTop(limit);
    }

    @GetMapping("/by-quality")
    public List<CategoryRankingEntryResponse> byQuality(
            @RequestParam Long qualityId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return rankingService.getMonthlyTopByQuality(qualityId, limit);
    }
}
