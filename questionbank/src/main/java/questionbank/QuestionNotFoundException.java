package questionbank;

class QuestionNotFoundException extends RuntimeException {

    QuestionNotFoundException(Long id) {
        super("Could not find question " + id);
    }
}