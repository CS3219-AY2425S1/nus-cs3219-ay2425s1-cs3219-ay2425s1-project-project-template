package com.example.questionbank.service;

import com.example.questionbank.model.Question;

/**
 * Utility class for validating {@link Question} entities.
 * <p>
 * This class provides methods for validating the properties
 * of questions, such as title or description length.
 *
 */
@SuppressWarnings("FinalClass")
public class QuestionValidator {

    // Private constructor to prevent instantiation
    private QuestionValidator() {
        throw new UnsupportedOperationException(
                "Utility class should not be instantiated."
        );
    }

    /**
     * Validates a {@link Question} entity.
     * <p>
     * This method checks whether the {@code title} and
     * {@code description} of the provided {@link Question} are non-null
     * and non-empty. It returns {@code true} if both fields are valid,
     * otherwise it returns {@code false}.
     *
     * @param question the {@link Question} entity to be validated.
     * @return {@code true} if the {@link Question} is valid,
     * {@code false} otherwise.
     */
    public static boolean isValidQuestion(final Question question) {
        // Example validation logic
        return question.getTitle() != null
                && !question.getTitle().isEmpty()
                && question.getDescription() != null
                && !question.getDescription().isEmpty();
    }
}



