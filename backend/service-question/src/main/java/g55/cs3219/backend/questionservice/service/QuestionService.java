package g55.cs3219.backend.questionservice.service;

import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Question getQuestionById(Long id) {
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
}