package g55.cs3219.backend.userService.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDto {
    private String email;
    private String username;

    public UserResponseDto(String username, String email) {
        this.username = username;
        this.email = email;
    }
}
