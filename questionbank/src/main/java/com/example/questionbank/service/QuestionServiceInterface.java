/**
 * This package contains the service layer of the Question Bank application.
 *
 * The service layer provides the business logic for managing {@link Question} entities.
 * It includes interfaces such as {@link QuestionServiceInterface} and their implementations
 * that interact with the repository layer to perform operations such as retrieving, adding,
 * updating, and deleting questions.
 */
package com.example.questionbank.service;

import com.example.questionbank.commons.QuestionNotFoundException;
import com.example.questionbank.model.Question;
import java.util.List;

/**
 * Service interface for managing {@link Question} entities.
 *
 * This interface defines methods for CRUD operations and any additional
 * business logic related to questions.
 *
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
     * @throws QuestionNotFoundException if no question is found with the
     * specified ID
     */
    Question getQuestionById(String id) throws QuestionNotFoundException;

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
     * @throws QuestionNotFoundException if no question is found with the
     * specified ID
     */
    Question updateQuestion(String id, Question updatedQuestion);

    /**
     * Deletes a question by its ID.
     *
     * @param id the ID of the question to delete
     * @throws QuestionNotFoundException if no question is found with the
     * specified ID
     */
    void deleteQuestion(String id);
}
