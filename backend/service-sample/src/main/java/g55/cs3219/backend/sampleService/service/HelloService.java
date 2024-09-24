package g55.cs3219.backend.sampleService.service;

import g55.cs3219.backend.sampleService.model.HelloUser;
import g55.cs3219.backend.sampleService.repository.HelloRepository;
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
