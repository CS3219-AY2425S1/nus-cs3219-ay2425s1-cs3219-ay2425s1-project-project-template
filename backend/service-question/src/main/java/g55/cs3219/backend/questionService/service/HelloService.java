package g55.cs3219.backend.questionService.service;

import g55.cs3219.backend.questionService.model.HelloUser;
import g55.cs3219.backend.questionService.repository.HelloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelloService {

    @Autowired
    private HelloRepository helloRepository;

    public List<HelloUser> getAllUsers() {
        return helloRepository.findAll();
    }

    public HelloUser saveUser(HelloUser user) {
        return helloRepository.save(user);
    }
}
