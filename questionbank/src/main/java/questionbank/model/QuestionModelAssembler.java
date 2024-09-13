package questionbank.model;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;
import questionbank.controller.QuestionController;

@Component
public class QuestionModelAssembler implements RepresentationModelAssembler<Question, EntityModel<Question>> {

    @Override
    public EntityModel<Question> toModel(Question question) {

        return EntityModel.of(question,
                linkTo(methodOn(QuestionController.class).one(question.getId())).withSelfRel(),
                linkTo(methodOn(QuestionController.class).all()).withRel("questions"));
    }
}
