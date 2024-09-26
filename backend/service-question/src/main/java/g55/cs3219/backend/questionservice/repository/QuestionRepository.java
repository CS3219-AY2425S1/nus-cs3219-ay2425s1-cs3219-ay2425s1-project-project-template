package g55.cs3219.backend.questionservice.repository;

import g55.cs3219.backend.questionservice.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends MongoRepository<Question, String> {
}
