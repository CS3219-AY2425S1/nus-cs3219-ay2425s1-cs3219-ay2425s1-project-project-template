package questionbank.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import questionbank.model.Question;
import questionbank.commons.QuestionNotFoundException;
import questionbank.database.QuestionRepository;

@RestController
public class QuestionController {

    private final QuestionRepository repository;

    QuestionController(QuestionRepository repository) {
        this.repository = repository;
    }


    // Aggregate root
    // tag::get-aggregate-root[]

    @GetMapping("/questions")
    CollectionModel<EntityModel<Question>> all() {

        List<EntityModel<Question>> questions = repository.findAll().stream()
                .map(question -> EntityModel.of(question,
                        linkTo(methodOn(QuestionController.class).one(question.getId())).withSelfRel(),
                        linkTo(methodOn(QuestionController.class).all()).withRel("questions")))
                .collect(Collectors.toList());

        return CollectionModel.of(questions, linkTo(methodOn(QuestionController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]

    @PostMapping("/questions")
    Question newQuestion(@RequestBody Question newQuestion) {
        return repository.save(newQuestion);
    }

    // Single item

    @GetMapping("/questions/{id}")
    EntityModel<Question> one(@PathVariable Long id) {

        Question question = repository.findById(id) //
                .orElseThrow(() -> new QuestionNotFoundException(id));

        return EntityModel.of(question, //
                linkTo(methodOn(QuestionController.class).one(id)).withSelfRel(),
                linkTo(methodOn(QuestionController.class).all()).withRel("questions"));
    }

    @PutMapping("/questions/{id}")
    Question replaceQuestion(@RequestBody Question newQuestion, @PathVariable Long id) {

        return repository.findById(id)
                .map(question -> {
                    question.setTitle(newQuestion.getTitle());
                    question.setDescription(newQuestion.getDescription());
                    question.setCategory(newQuestion.getCategory());
                    question.setComplexity(newQuestion.getComplexity());
                    return repository.save(question);
                })
                .orElseGet(() -> {
                    return repository.save(newQuestion);
                });
    }

    @DeleteMapping("/questions/{id}")
    void deleteQuestion(@PathVariable Long id) {
        repository.deleteById(id);
    }
}