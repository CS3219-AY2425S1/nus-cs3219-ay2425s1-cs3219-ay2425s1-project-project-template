package com.example.questionbank.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.example.questionbank.repository.QuestionRepository;
import com.example.questionbank.model.QuestionModelAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.questionbank.model.Question;
import com.example.questionbank.commons.QuestionNotFoundException;

@RestController
public class QuestionController {

    private final QuestionRepository repository;

    private final QuestionModelAssembler assembler;

    QuestionController(QuestionRepository repository, QuestionModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }


    // Aggregate root
    // tag::get-aggregate-root[]

    @GetMapping("/questions")
    public CollectionModel<EntityModel<Question>> all() {

        List<EntityModel<Question>> questions = repository.findAll().stream() //
                .map(assembler::toModel) //
                .collect(Collectors.toList());

        return CollectionModel.of(questions, linkTo(methodOn(QuestionController.class).all()).withSelfRel());
    }
    // end::get-aggregate-root[]


    @PostMapping("/questions")
    ResponseEntity<?> newQuestion(@RequestBody Question newQuestion) {

        EntityModel<Question> entityModel = assembler.toModel(repository.save(newQuestion));

        return ResponseEntity //
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    // Single item

    @GetMapping("/questions/{id}")
    public EntityModel<Question> one(@PathVariable Long id) {

        Question question = repository.findById(id) //
                .orElseThrow(() -> new QuestionNotFoundException(id));

        return assembler.toModel(question);
    }

    @PutMapping("/questions/{id}")
    ResponseEntity<?> replaceQuestion(@RequestBody Question newQuestion, @PathVariable Long id) {

        Question updatedQuestion = repository.findById(id) //
                .map(question -> {
                    question.setTitle(newQuestion.getTitle());
                    question.setDescription(newQuestion.getDescription());
                    question.setCategories(newQuestion.getCategories());
                    question.setComplexity(newQuestion.getComplexity());
                    return repository.save(question);
                }) //
                .orElseGet(() -> {
                    return repository.save(newQuestion);
                });

        EntityModel<Question> entityModel = assembler.toModel(updatedQuestion);

        return ResponseEntity //
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    @DeleteMapping("/questions/{id}")
    ResponseEntity<?> deleteQuestion(@PathVariable Long id) {

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

}