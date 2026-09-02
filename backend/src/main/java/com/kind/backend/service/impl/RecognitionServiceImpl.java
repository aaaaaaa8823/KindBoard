package com.kind.backend.service.impl;

import com.kind.backend.dto.request.CreateRecognitionRequest;
import com.kind.backend.dto.response.RecognitionResponse;
import com.kind.backend.model.Quality;
import com.kind.backend.model.Recognition;
import com.kind.backend.model.User;
import com.kind.backend.model.UserBalance;
import com.kind.backend.repository.QualityRepository;
import com.kind.backend.repository.RecognitionRepository;
import com.kind.backend.repository.UserBalanceRepository;
import com.kind.backend.repository.UserRepository;
import com.kind.backend.service.RecognitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecognitionServiceImpl implements RecognitionService {

    private static final int daily_limit = 50; //пока константа

    private final QualityRepository qualityRepository;
    private final UserRepository userRepository;
    private final RecognitionRepository recognitionRepository;
    private final UserBalanceRepository userBalanceRepository;

    @Override
    public List<RecognitionResponse> getAll(){
        return recognitionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RecognitionResponse getById(Long id){
        Recognition recognition = recognitionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Not found" + id));
        return toResponse(recognition);
    }

    @Override
    @Transactional
    public RecognitionResponse create(CreateRecognitionRequest request){
        if(request.getGiver_id().equals(request.getReceiver_id())){
            throw new RuntimeException("Cannot recognize yourself");
        }

        User giver = userRepository.findById(request.getGiver_id()).orElseThrow(
                () -> new RuntimeException("Giver not found")
        );

        User receiver = userRepository.findById(request.getReceiver_id()).orElseThrow(
                () -> new RuntimeException("Receiver not found")
        );

        Quality quality = qualityRepository.findById(request.getQuality_id()).orElseThrow(
                () -> new RuntimeException("Quality not found")
        );

        if(!quality.isActive()){
            throw new RuntimeException("Quality is not active");
        }

        UserBalance balance = getOrCreateBalance(giver);
        resetIfNewDay(balance);

        if(balance.getGiveablePoints() < request.getPoints()){
            throw new RuntimeException("Not enough points. Last: " + balance);
        }

        balance.setGiveablePoints(balance.getGiveablePoints() - request.getPoints());
        userBalanceRepository.save(balance);

        Recognition recognition =  new Recognition();
        recognition.setGiver(giver);
        recognition.setReceiver(receiver);
        recognition.setQuality(quality);
        recognition.setMessage(request.getMessage());
        recognition.setPoints(request.getPoints());
        recognition.setStatus("active");

        Recognition saved = recognitionRepository.save(recognition);
        return toResponse(recognition);
    }

    @Transactional
    public void delete(Long id) {
        Recognition recognition = recognitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));

        recognitionRepository.delete(recognition);
    }

    private UserBalance getOrCreateBalance(User user){
        return userBalanceRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    UserBalance balance = new UserBalance();
                    balance.setUser(user);
                    balance.setGiveablePoints(daily_limit);
                    balance.setLastResetDate(LocalDate.now());
                    return userBalanceRepository.save(balance);
                });
    }

    private void resetIfNewDay(UserBalance balance){
        if(balance.getLastResetDate() == null || balance.getLastResetDate().isBefore(LocalDate.now())){
            balance.setGiveablePoints(daily_limit);
            balance.setLastResetDate(LocalDate.now());
        }
    }

    private RecognitionResponse toResponse(Recognition recognition){
        RecognitionResponse dto = new RecognitionResponse();
        dto.setId(recognition.getId());
        dto.setGiver_id(recognition.getGiver().getId());
        dto.setReceiver_id(recognition.getReceiver().getId());
        dto.setQuality_id(recognition.getQuality().getId());
        dto.setMessage(recognition.getMessage());
        dto.setPoints(recognition.getPoints());
        dto.setStatus(recognition.getStatus());
        dto.setCreatedAt(recognition.getCreatedAt());
        dto.setGiverUsername(recognition.getGiver().getUsername());
        dto.setReceiverUsername(recognition.getReceiver().getUsername());
        dto.setQualityUsername(recognition.getQuality().getName());
        dto.setQualityCode(recognition.getQuality().getCode());
        return dto;
    }
}
