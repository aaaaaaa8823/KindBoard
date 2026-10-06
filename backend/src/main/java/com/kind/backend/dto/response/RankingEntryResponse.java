package com.kind.backend.dto.response;

import lombok.Data;

@Data
public class RankingEntryResponse {
    private int rank;
    private Long userId;
    private String username;
    private String departmentName;
    private long uniqueGivers;
    private Long pointsSum;
    private String title;
}
