package g55.cs3219.backend.questionservice.model;

import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashMap;
import java.util.List;

@Document(collection = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Question {

    @Id
    private Integer id;

    private String title;
    private String description;
    private List<HashMap<String, String>> examples;
    private List<String> constraints;
    private List<String> categories;
    private String difficulty;
    private String link;
}
