package com.logistics.logistics.dto;

import com.logistics.logistics.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String role; // Changed from UserRole to String to accept string values from frontend
    
    public UserRole getRoleAsEnum() {
        // First try to find by value since that's how we store it in the frontend
        try {
            return UserRole.fromValue(role.toLowerCase());
        } catch (IllegalArgumentException e) {
            // If that fails, try to convert directly from the enum name
            return UserRole.valueOf(role.toUpperCase());
        }
    }
}
