package com.kind.backend.service;

import com.kind.backend.dto.response.CategoryRankingEntryResponse;
import com.kind.backend.dto.response.RankingEntryResponse;

import java.util.List;

public interface RankingService {
    List<RankingEntryResponse> getMonthlyTop(int limit);
    Integer getMyRank();
    List<CategoryRankingEntryResponse> getMonthlyTopByQuality(Long qualityId, int limit);
}
