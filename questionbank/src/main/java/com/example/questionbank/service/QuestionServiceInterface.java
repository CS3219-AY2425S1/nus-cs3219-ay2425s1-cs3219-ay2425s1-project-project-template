package com.example.questionbank.service;

import com.example.questionbank.commons.QuestionNotFoundException;
import com.example.questionbank.model.Question;
import java.util.List;

/**
 * Service interface for managing {@link Question} entities.
 * <p>
 * This interface defines methods for CRUD operations and any additional business logic related to questions.
 * </p>
 */
public interface QuestionServiceInterface {

    /**
     * Retrieves all questions.
     *
     * @return a list of all {@link Question} entities
     */
    List<Question> getAllQuestions();

    /**
     * Retrieves a question by its ID.
     *
     * @param id the ID of the question to retrieve
     * @return the {@link Question} entity with the specified ID
     * @throws QuestionNotFoundException if no question is found with the specified ID
     */
    Question getQuestionById(String id);

    /**
     * Creates a new question.
     *
     * @param question the {@link Question} entity to create
     * @return the created {@link Question} entity
     */
    Question createQuestion(Question question);

    /**
     * Updates an existing question.
     *
     * @param id the ID of the question to update
     * @param updatedQuestion the updated {@link Question} entity
     * @return the updated {@link Question} entity
     * @throws QuestionNotFoundException if no question is found with the specified ID
     */
    Question updateQuestion(String id, Question updatedQuestion);

    /**
     * Deletes a question by its ID.
     *
     * @param id the ID of the question to delete
     * @throws QuestionNotFoundException if no question is found with the specified ID
     */
    void deleteQuestion(String id);
}

