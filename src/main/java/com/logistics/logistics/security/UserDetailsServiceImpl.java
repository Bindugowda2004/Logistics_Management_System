package com.logistics.logistics.security;

import com.logistics.logistics.model.User;
import com.logistics.logistics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading user by username: {}", username);
        
        try {
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (!userOptional.isPresent()) {
                logger.error("User not found with username: {}", username);
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
            
            User user = userOptional.get();
            logger.debug("User found: {}", user);
            
            if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
                logger.error("User has no password: {}", username);
                throw new UsernameNotFoundException("User has invalid credentials");
            }
            
            if (user.getRole() == null) {
                logger.error("User has no role: {}", username);
                throw new UsernameNotFoundException("User has no role assigned");
            }
            
            String role = user.getRoleValue();
            logger.debug("User role: {}", role);
            
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
            );
        } catch (Exception e) {
            logger.error("Error loading user by username: {}", username, e);
            throw new UsernameNotFoundException("Error loading user: " + e.getMessage());
        }
    }
}
