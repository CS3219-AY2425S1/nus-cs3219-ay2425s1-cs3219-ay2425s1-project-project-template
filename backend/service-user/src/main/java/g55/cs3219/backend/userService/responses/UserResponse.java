package g55.cs3219.backend.userService.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String email;
    private String username;

    public UserResponse(String username, String email) {
        this.username = username;
        this.email = email;
    }
}
