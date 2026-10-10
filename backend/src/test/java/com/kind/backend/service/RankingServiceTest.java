package com.kind.backend.service;

import com.kind.backend.model.User;
import com.kind.backend.repository.RecognitionRepository;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.service.impl.RankingServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RankingServiceTest {

    @Mock
    private RecognitionRepository recognitionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RankingServiceImpl rankingService;

    @AfterEach
    void cleanup(){
        SecurityContextHolder.clearContext();
    }

    @Test
    void getMyRank_returnsNull_whenRecognitionsThisMonth(){
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("test@example.com", null)
        );

        User me = new User();
        me.setId(1L);
        me.setEmail("test@example.com");
        me.setUsername("TestUser");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(me));

        when(recognitionRepository.findMouthlyReceiverStats(any(), any()))
                .thenReturn(Collections.emptyList());

        Integer rank = rankingService.getMyRank();

        //нет рейтинга тк данных нет у нового юзера
        assertNull(rank);
    }

}
