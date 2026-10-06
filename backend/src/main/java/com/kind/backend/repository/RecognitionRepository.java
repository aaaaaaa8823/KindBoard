package com.kind.backend.repository;

import com.kind.backend.dto.response.QualityStatsProjection;
import com.kind.backend.dto.response.ReceiverStatsProjection;
import com.kind.backend.model.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RecognitionRepository extends JpaRepository<Recognition, Long> {
    List<Recognition> findAllByOrderByCreatedAtDesc();

    @Query(""" 
    select COALESCE(SUM(r.points), 0) from Recognition r
    where r.receiver.id = :userId
    and r.status = 'active'
    and r.createdAt >= :from
    and r.createdAt < :to
""")
    Integer sumPointsReceivedBetween(
            @Param("userId") Long userId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
    select r.receiver.id as receiverId,
    count(DISTINCT r.giver.id) as uniqueGivers,
    coalesce(sum(r.points), 0) as pointsSum
    from Recognition r
    where r.status = 'active'
    and r.createdAt >= :from
    and r.createdAt < :to
    group by r.receiver.id
    order by count(distinct r.giver.id) desc, sum(r.points) desc 
""")
    List<ReceiverStatsProjection> findMouthlyReceiverStats(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
    select r.receiver.id as receiverId, COUNT(r.id) as qualityCount
    from Recognition r
    where r.status = 'active'
    and r.quality.id = :qualityId
    and r.createdAt >= :from
    and r.createdAt < :to
    group by r.receiver.id
    order by COUNT(r.id) desc 
    """)
    List<QualityStatsProjection> findMonthlyStatsByQuality(
            @Param("qualityId") Long qualityId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
