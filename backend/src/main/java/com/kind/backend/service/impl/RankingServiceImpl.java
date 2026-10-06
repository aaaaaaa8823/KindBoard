package com.kind.backend.service.impl;

import com.kind.backend.dto.response.CategoryRankingEntryResponse;
import com.kind.backend.dto.response.QualityStatsProjection;
import com.kind.backend.dto.response.RankingEntryResponse;
import com.kind.backend.dto.response.ReceiverStatsProjection;
import com.kind.backend.model.Quality;
import com.kind.backend.model.User;
import com.kind.backend.repository.QualityRepository;
import com.kind.backend.repository.RecognitionRepository;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {

    private final RecognitionRepository recognitionRepository;
    private final UserRepository userRepository;
    private final QualityRepository qualityRepository;

    @Override
    public List<RankingEntryResponse> getMonthlyTop(int limit){
        LocalDate today = LocalDate.now();
        LocalDateTime from = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime to = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        List<ReceiverStatsProjection> stats = recognitionRepository.findMouthlyReceiverStats(from, to);

        List<RankingEntryResponse> result = new ArrayList<>();
        int rank = 1;

        for (ReceiverStatsProjection row: stats){
            if(rank > limit) break;

            User user = userRepository.findById(row.getReceiverId()).orElse(null);
            if(user == null) continue;

            RankingEntryResponse entry = new RankingEntryResponse();
            entry.setRank(rank);
            entry.setUserId(user.getId());
            entry.setUsername(user.getUsername());
            entry.setPointsSum(row.getPointsSum());
            entry.setUniqueGivers(row.getUniqueGivers());
            entry.setDepartmentName(resolveDepartmentName(user));
            entry.setTitle(titleFor(rank));

            result.add(entry);
            rank++;
        }

        return result;
    }

    private String titleFor(int rank) {
        return switch (rank) {
            case 1 -> "Employee of the month";
            case 2 -> "Runner-up";
            case 3 -> "Almost there";
            default -> null;
        };
    }

    private String resolveDepartmentName(User user) {
        if (user.getDepartment() == null) {
            return null;
        }
        return user.getDepartment().getName();
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getMyRank(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User me = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDateTime from = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime to = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        List<ReceiverStatsProjection> stats =
                recognitionRepository.findMouthlyReceiverStats(from, to);

        int rank = 1;
        for (ReceiverStatsProjection row : stats) {
            if (row.getReceiverId().equals(me.getId())) {
                return rank;
            }
            rank++;
        }
        return null;
    }

    @Override
    @Transactional
    public List<CategoryRankingEntryResponse> getMonthlyTopByQuality(Long qualityId, int limit) {
        LocalDate today = LocalDate.now();
        LocalDateTime from = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime to = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        List<QualityStatsProjection> stats =
                recognitionRepository.findMonthlyStatsByQuality(qualityId, from, to);


        Quality quality = qualityRepository.findById(qualityId)
                .orElseThrow(() -> new RuntimeException("Quality not found"));

        String qualityName = quality.getName();

        List<CategoryRankingEntryResponse> result = new ArrayList<>();
        int rank = 1;

        for(QualityStatsProjection row: stats){
            if(rank > limit) break;

            User user = userRepository.findById(row.getReceiverId()).orElse(null);
            if(user == null) continue;

            CategoryRankingEntryResponse entry = new CategoryRankingEntryResponse();
            entry.setRank(rank);
            entry.setUserId(user.getId());
            entry.setUsername(user.getUsername());
            entry.setDepartmentName(resolveDepartmentName(user));
            entry.setCount(row.getQualityCount());
            entry.setQualityName(qualityName);

            result.add(entry);
            rank++;
        }

        return result;
    }
}
