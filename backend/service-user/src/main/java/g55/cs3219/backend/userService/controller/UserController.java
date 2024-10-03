package g55.cs3219.backend.userService.controller;

import g55.cs3219.backend.userService.dto.RegisterUserDto;
import g55.cs3219.backend.userService.responses.UserResponse;
import g55.cs3219.backend.userService.model.User;
import g55.cs3219.backend.userService.service.AuthenticationService;
import g55.cs3219.backend.userService.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

// https://youtu.be/uZGuwX3St_c?si=hQ2vppx_ACMhrS7u
@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    public UserController(UserService userService, AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable String userId, Authentication authentication) {
        System.out.println("Controller: Received request for user ID: " + userId);
        try {
            // Retrieve the current user making the request
            User currentUser = (User) authentication.getPrincipal();

            // Call the service method to get the user by ID
            User fetchedUser = userService.getUserById(Long.parseLong(userId), currentUser);

            // Return user data as a response
            return ResponseEntity.ok(new UserResponse(fetchedUser.getUsername(), fetchedUser.getEmail()));
        } catch (RuntimeException e) {
            // Handle forbidden access
            if (e.getMessage().equals("Forbidden")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied.");
            }
            // Handle user not found
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with the specified ID not found.");
            }
            // Handle internal server errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterUserDto registerUserDto) {
        try {
            User createdUser = authenticationService.signup(registerUserDto);
            return new ResponseEntity<>(new UserResponse(createdUser.getUsername(), createdUser.getEmail()), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Handle duplicate username or email
            if (e.getMessage().contains("exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            // Handle other server errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        } catch (Exception e) {
            // Handle generic errors (e.g., missing fields)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input: " + e.getMessage());
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }



//    @GetMapping("/me")
//    public ResponseEntity<User> getAuthenticatedUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        User currentUser = (User) authentication.getPrincipal();
//        return ResponseEntity.ok(currentUser);
//    }
//
//    @GetMapping("/")
//    public ResponseEntity<List<User>> getAllUsers() {
//        List<User> users = userService.getAllUsers();
//        return ResponseEntity.ok(users);
//    }
}
