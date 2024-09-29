package g55.cs3219.backend.questionservice.service;

import g55.cs3219.backend.questionservice.exception.DuplicatedQuestionIdException;
import g55.cs3219.backend.questionservice.exception.InvalidQuestionException;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        List<Question> questions = questionRepository.findAll();
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found.");
        }
        questions.sort((q1, q2) -> q1.getId() - q2.getId());
        return questions;
    }

    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));
    }

    public List<Question> getQuestionsByFilters(String category, String difficulty) {
        if (category != null && difficulty != null) {
            throw new InvalidQuestionException("Cannot filter by both category and difficulty.");
        } else if (category != null) {
            return getQuestionsByCategory(category);
        } else if (difficulty != null) {
            return getQuestionsByDifficulty(difficulty);
        } else {
            throw new InvalidQuestionException("At least one filter is required.");
        }
    }

    public List<Question> getQuestionsByDifficulty(String difficulty) {
        List<Question> questions = questionRepository.findByDifficulty(difficulty);
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found with difficulty: " + difficulty);
        }
        return questions;
    }

    public List<Question> getQuestionsByCategory(String category) {
        List<Question> questions = questionRepository.findByCategoriesContaining(category);
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found with category: " + category);
        }
        return questions;
    }

    public Question createQuestion(Question question) {
        validateQuestion(question);
        if (questionRepository.existsById(question.getId())) {
            throw new DuplicatedQuestionIdException("Duplicate question with ID " + question.getId() + " already exists.");
        }
        return questionRepository.save(question);
    }

    private void validateQuestion(Question question) {
        List<String> missingFields = Stream.of(
                question.getId() == null ? "id" : null,
                question.getTitle() == null ? "title" : null,
                question.getDescription() == null ? "description" : null,
                question.getCategories() == null ? "categories" : null,
                question.getDifficulty() == null ? "difficulty" : null
        ).filter(Objects::nonNull).collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidQuestionException("Missing required fields: " + String.join(", ", missingFields));
        }
    }

    public Question updateQuestion(Integer id, Question updatedQuestion) {
        if (updatedQuestion.getId() == null) {
            throw new InvalidQuestionException("Question ID is required for update.");
        }

        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));

        existingQuestion.setTitle(updatedQuestion.getTitle());
        existingQuestion.setDescription(updatedQuestion.getDescription());
        existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
        existingQuestion.setCategories(updatedQuestion.getCategories());

        return questionRepository.save(existingQuestion);
    }

    public String deleteQuestion(Integer id) {
        if (id == null) {
            throw new InvalidQuestionException("Question ID is required for deletion.");
        }

        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));

        questionRepository.delete(existingQuestion);

        return "Question with ID " + id + " has been deleted.";
    }

}