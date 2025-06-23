package com.logistics.logistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Custom getter and setter for role to handle string conversion
    public void setRoleFromString(String roleValue) {
        if (roleValue == null) {
            throw new IllegalArgumentException("Role value cannot be null");
        }
        try {
            this.role = UserRole.fromValue(roleValue);
            System.out.println("Role set to: " + this.role + " (value: " + this.role.getValue() + ")"); // Debug log
        } catch (IllegalArgumentException e) {
            System.out.println("Failed to set role from value: " + roleValue); // Debug log
            throw new IllegalArgumentException("Invalid role. Valid values are: admin, logistics_manager, warehouse_staff, delivery_driver");
        }
    }
    
    public String getRoleValue() {
        return role != null ? role.getValue() : null;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Override toString for better logging
    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role=" + (role != null ? role.getValue() : "null") +
                ", createdAt=" + createdAt +
                '}';
    }
}
