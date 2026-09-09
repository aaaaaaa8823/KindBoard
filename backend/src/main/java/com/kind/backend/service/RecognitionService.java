package com.kind.backend.service;

import com.kind.backend.dto.request.CreateQualityRequest;
import com.kind.backend.dto.request.CreateRecognitionRequest;
import com.kind.backend.dto.response.RecognitionResponse;

import java.util.List;
/**
 * Сервис признаний между сотрудниками: лента, создание поста, удаление.
 */
public interface RecognitionService {
    /**
     * Лента постов с признаниями
     */
    List<RecognitionResponse> getAll();

    /**
     * Пост по идентификатору
     * @param id id поста
     * @return найденный пост
     */
    RecognitionResponse getById(Long id);

    /**
     * Создает пост и списывает баллы с дневного лимита отправителя.
     * <p>
     * Проверяет: нельзя отметить себя; существуют giver, receiver и quality;
     *      качество активно; на балансе достаточно баллов. При нехватке баллов
     *      или нарушении правил выбрасывает исключение. Выполняется в транзакции:
     *      пост и списание баллов сохраняются только вместе.
     * </p>
     * @param request кто, кому, качество, текст, число баллов
     * @return созданный пост
     */
    RecognitionResponse create(CreateRecognitionRequest request);

    /**
     * Удаляет пост по id
     * @param id id поста
     */
    void delete(Long id);
}
