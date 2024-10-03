package g55.cs3219.backend.userService.service;

import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public User getUserById(Long userId, User currentUser) {
        System.out.println("Fetching user with ID: " + userId);
        // Retrieve user from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the current user is an admin or accessing their own data
        if (!currentUser.isAdmin() && !user.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Forbidden");
        }

        return user;
    }

}
