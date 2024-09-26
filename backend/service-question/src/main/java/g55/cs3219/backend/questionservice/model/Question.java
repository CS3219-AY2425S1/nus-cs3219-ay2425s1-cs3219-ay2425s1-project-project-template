package g55.cs3219.backend.questionservice.model;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Document(collection = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Question {

    @Id
    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;

    // No need for explicit getters, setters, or constructors – Lombok handles them.
}
