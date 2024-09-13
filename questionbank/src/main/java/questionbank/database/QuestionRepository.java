package questionbank.database;

import org.springframework.data.jpa.repository.JpaRepository;
import questionbank.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {

}