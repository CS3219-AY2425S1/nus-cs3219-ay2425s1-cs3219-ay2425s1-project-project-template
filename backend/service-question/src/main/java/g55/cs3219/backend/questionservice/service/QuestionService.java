package g55.cs3219.backend.questionservice.service;

import g55.cs3219.backend.questionservice.exception.DuplicatedQuestionIdException;
import g55.cs3219.backend.questionservice.exception.InvalidQuestionException;
import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
        return questions;
    }

    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new QuestionNotFoundException("Question with ID " + id + " not found."));
    }

    public List<Question> getQuestionsByDifficulty(String difficulty) {
        List<Question> questions = questionRepository.findByDifficulty(difficulty);
        if (questions.isEmpty()) {
            throw new QuestionNotFoundException("No questions found with difficulty: " + difficulty);
        }
        return questions;
    }

    public Question createQuestion(Question question) {
        validateQuestion(question);
        if (questionRepository.existsById(question.getQuestionId())) {
            throw new DuplicatedQuestionIdException("Duplicate question with ID " + question.getQuestionId() + " already exists.");
        }
        return questionRepository.save(question);
    }

    private void validateQuestion(Question question) {
        List<String> missingFields = Stream.of(
                question.getQuestionId() == null ? "questionId" : null,
                question.getTitle() == null ? "title" : null,
                question.getDescription() == null ? "description" : null,
                question.getCategory() == null ? "category" : null,
                question.getDifficulty() == null ? "difficulty" : null
        ).filter(field -> field != null).collect(Collectors.toList());

        if (!missingFields.isEmpty()) {
            throw new InvalidQuestionException("Missing required fields: " + String.join(", ", missingFields));
        }
    }

}