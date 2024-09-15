/**
 * This package contains the model classes for the Question Bank application.
 *
 * The model classes represent the main entities such as {@link Question},
 * which holds the data structure for questions including fields like ID, title,
 * description, categories, and complexity.
 */
package com.example.questionbank.model;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import com.example.questionbank.controller.QuestionController;

/**
 * Assembles {@link Question} entities into {@link EntityModel} instances for HATEOAS support.
 * <p>
 * This component implements {@link RepresentationModelAssembler} to convert {@link Question} entities into
 * {@link EntityModel} instances with added HATEOAS links. The links include self-references and a link to
 * the collection of all questions.
 * </p>
 */
@Component
public class QuestionModelAssembler implements RepresentationModelAssembler<Question, EntityModel<Question>> {

    @Override
    public EntityModel<Question> toModel(Question question) {

        return EntityModel.of(question,
                linkTo(methodOn(QuestionController.class).one(question.getId())).withSelfRel(),
                linkTo(methodOn(QuestionController.class).all()).withRel("questions"));
    }
}
