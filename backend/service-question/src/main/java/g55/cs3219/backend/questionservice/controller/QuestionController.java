package g55.cs3219.backend.questionservice.controller;

import g55.cs3219.backend.questionservice.exception.QuestionNotFoundException;
import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
       return questionService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Integer id) {
        return questionService.getQuestionById(id);
    }

    @GetMapping("/questions/filter")
    public List<Question> getQuestionsByDifficulty(@RequestParam(name = "difficulty", required = true) String difficulty) {
        return questionService.getQuestionsByDifficulty(difficulty);
    }

    @PostMapping()
    public Question createQuestion(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }

}
