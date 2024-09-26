package g55.cs3219.backend.questionservice.controller;

import g55.cs3219.backend.questionservice.model.Question;
import g55.cs3219.backend.questionservice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/questions/filterByDifficulty")
    public List<Question> getQuestionsByDifficulty(@RequestParam(name = "difficulty", required = true) String difficulty) {
        return questionService.getQuestionsByDifficulty(difficulty);
    }

    @GetMapping("/questions/filterByCategory")
    public List<Question> getQuestionsByCategory(@RequestParam(name = "category", required = true) String category) {
        return questionService.getQuestionsByCategory(category);
    }

    @PostMapping()
    public Question createQuestion(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Integer id, @RequestBody Question updatedQuestion) {
        Question question = questionService.updateQuestion(id, updatedQuestion);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String > deleteQuestion(@PathVariable Integer id) {
        String message = questionService.deleteQuestion(id);
        return ResponseEntity.ok(message);
    }

}
