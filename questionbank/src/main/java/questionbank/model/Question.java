package questionbank.model;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class Question {

    private @Id
    @GeneratedValue Long id;
    private String title;

    @Column(length = 1000) // Adjust length to fit description needs
    private String description;

    @ElementCollection // Indicates that this is a collection of basic types
    private List<String> categories; // A list of categories

    private String complexity;

    public Question() {}

    public Question(String title, String description, List<String> categories, String complexity) {

        this.title = title;
        this.description = description;
        this.categories = categories;
        this.complexity = complexity;
    }

    public Long getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public String getDescription() {
        return this.description;
    }

    public List<String> getCategories() {
        return this.categories;
    }

    public String getComplexity() {
        return this.complexity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public void setComplexity(String complexity) {
        this.complexity = complexity;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o)
            return true;
        if (!(o instanceof Question))
            return false;
        Question question = (Question) o;
        return Objects.equals(this.id, question.id) && Objects.equals(this.title, question.title)
                && Objects.equals(this.description, question.description)
                && Objects.equals(this.categories, question.categories)
                && Objects.equals(this.complexity, question.complexity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.title, this.description, this.categories, this.complexity);
    }

    @Override
    public String toString() {
        return "Question{" + "id=" + this.id
                + ", title='" + this.title + '\''
                + ", description='" + this.description + '\''
                + ", categories='" + this.categories + '\''
                + ", complexity='" + this.complexity + '\'' + '}';
    }
}
