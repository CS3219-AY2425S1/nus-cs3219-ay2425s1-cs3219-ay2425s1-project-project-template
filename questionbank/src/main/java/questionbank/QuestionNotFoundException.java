package questionbank;

class QuestionNotFoundException extends RuntimeException {

    QuesetionNotFoundException(Long id) {
        super("Could not find question " + id);
    }
}