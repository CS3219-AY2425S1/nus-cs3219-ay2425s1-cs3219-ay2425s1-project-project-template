package questionbank;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
class Question {

    private @Id
    @GeneratedValue Long id;
    private String title;

    @Column(length = 1000) // Adjust length to fit description needs
    private String description;
    private String category;
    private String complexity;

    Question() {}

    Question(String title, String description, String category, String complexity) {

        this.title = title;
        this.description = description;
        this.category = category;
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

    public String getCategory() {
        return this.category;
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

    public void setCategory(String category) {
        this.category = category;
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
                && Objects.equals(this.category, question.category)
                && Objects.equals(this.complexity, question.complexity);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.title, this.description, this.category, this.complexity);
    }

    @Override
    public String toString() {
        return "Question{" + "id=" + this.id
                + ", title='" + this.title + '\''
                + ", description='" + this.description + '\''
                + ", category='" + this.category + '\''
                + ", complexity='" + this.complexity + '\'' + '}';
    }
}
