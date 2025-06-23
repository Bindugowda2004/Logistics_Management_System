package com.logistics.logistics.service;

import com.logistics.logistics.dto.AuthenticationRequest;
import com.logistics.logistics.dto.AuthenticationResponse;
import com.logistics.logistics.dto.RegistrationRequest;
import com.logistics.logistics.model.User;
import com.logistics.logistics.model.UserRole;
import com.logistics.logistics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegistrationRequest request) {
        logger.info("Attempting to register user: {}", request.getUsername());
        
        // Validate role
        UserRole userRole;
        try {
            userRole = UserRole.fromValue(request.getRole());
            logger.info("Role validated: {} (value: {})", userRole.name(), userRole.getValue());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid role provided during registration: {}", request.getRole());
            throw new IllegalArgumentException("Invalid role. Valid values are: admin, logistics_manager, warehouse_staff, delivery_driver");
        }
        
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .build();
        
        userRepository.save(user);
        logger.info("User registered successfully: {}", user);
        
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRoleValue())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("Attempting to authenticate user: {}", request.getUsername());
        
        try {
            // First check if the user exists in the database
            var userOptional = userRepository.findByUsername(request.getUsername());
            if (!userOptional.isPresent()) {
                logger.error("User not found during authentication: {}", request.getUsername());
                throw new IllegalArgumentException("User not found");
            }
            
            var user = userOptional.get();
            logger.debug("Found user: {}", user);
            
            // Verify that the user has a password and role
            if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
                logger.error("User has no password hash: {}", request.getUsername());
                throw new IllegalArgumentException("Invalid user credentials");
            }
            
            if (user.getRole() == null) {
                logger.error("User has no role: {}", request.getUsername());
                throw new IllegalArgumentException("User has no role assigned");
            }
            
            // Attempt authentication
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );
            } catch (Exception e) {
                logger.error("Authentication failed for user: {}, error: {}", request.getUsername(), e.getMessage());
                throw new IllegalArgumentException("Authentication failed: " + e.getMessage());
            }
            
            logger.info("User authenticated successfully: {}", user);
            var jwtToken = jwtService.generateToken(user);
            
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .role(user.getRoleValue())
                    .build();
        } catch (Exception e) {
            logger.error("Error during authentication: {}", e.getMessage(), e);
            throw e;
        }
    }
}
