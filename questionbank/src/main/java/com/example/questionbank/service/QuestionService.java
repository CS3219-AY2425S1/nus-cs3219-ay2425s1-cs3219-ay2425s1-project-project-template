package com.example.questionbank.service;

import com.example.questionbank.model.Question;
import com.example.questionbank.repository.QuestionRepository;
import com.example.questionbank.commons.QuestionNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of the {@link QuestionServiceInterface} interface.
 * <p>
 * This class contains the business logic for managing {@link Question} entities and interacts with the
 * {@link QuestionRepository}.
 * </p>
 */
@Service
public class QuestionService implements QuestionServiceInterface {

    private final QuestionRepository repository;

    public QuestionService(QuestionRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Question> getAllQuestions() {
        return repository.findAll();
    }

    @Override
    public Question getQuestionById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException(id));
    }

    @Override
    public Question createQuestion(Question question) {
        if (!QuestionValidator.isValidQuestion(question)) {
            throw new IllegalArgumentException("Invalid question data");
        }
        return repository.save(question);
    }

    @Override
    public Question updateQuestion(String id, Question updatedQuestion) {
        if (!QuestionValidator.isValidQuestion(updatedQuestion)) {
            throw new IllegalArgumentException("Invalid new question data");
        }

        return repository.findById(id)
                .map(existingQuestion -> {
                    existingQuestion.setTitle(updatedQuestion.getTitle());
                    existingQuestion.setDescription(updatedQuestion.getDescription());
                    existingQuestion.setCategories(updatedQuestion.getCategories());
                    existingQuestion.setComplexity(updatedQuestion.getComplexity());
                    return repository.save(existingQuestion);
                })
                .orElseGet(() -> {
                    updatedQuestion.setId(id);
                    return repository.save(updatedQuestion);
                });
    }

    @Override
    public void deleteQuestion(String id) {
        if (!repository.existsById(id)) {
            throw new QuestionNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
