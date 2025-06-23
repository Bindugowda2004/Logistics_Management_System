package com.logistics.logistics.controller;

import com.logistics.logistics.model.User;
import com.logistics.logistics.model.UserRole;
import com.logistics.logistics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/managers")
    public ResponseEntity<?> getManagers() {
        try {
            logger.info("Fetching managers");
            // Get users with LOGISTICS_MANAGER role
            List<Map<String, Object>> managers = userRepository.findAll().stream()
                    .filter(user -> {
                        // Safely check the role
                        UserRole role = user.getRole();
                        return role != null && 
                               (role.equals(UserRole.LOGISTICS_MANAGER) || 
                                role.equals(UserRole.ADMIN));
                    })
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            logger.info("Found {} managers", managers.size());
            return ResponseEntity.ok(managers);
        } catch (Exception e) {
            logger.error("Error fetching managers", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to fetch managers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/warehouse-staff")
    public ResponseEntity<?> getWarehouseStaff() {
        try {
            logger.info("Fetching warehouse staff");
            // Get users with WAREHOUSE_STAFF role
            List<Map<String, Object>> staff = userRepository.findAll().stream()
                    .filter(user -> {
                        UserRole role = user.getRole();
                        return role != null && role.equals(UserRole.WAREHOUSE_STAFF);
                    })
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            logger.info("Found {} warehouse staff members", staff.size());
            return ResponseEntity.ok(staff);
        } catch (Exception e) {
            logger.error("Error fetching warehouse staff", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to fetch warehouse staff: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/delivery-drivers")
    public ResponseEntity<?> getDeliveryDrivers() {
        try {
            logger.info("Fetching delivery drivers");
            // Get users with DELIVERY_DRIVER role
            List<Map<String, Object>> drivers = userRepository.findAll().stream()
                    .filter(user -> {
                        UserRole role = user.getRole();
                        return role != null && role.equals(UserRole.DELIVERY_DRIVER);
                    })
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            
            logger.info("Found {} delivery drivers", drivers.size());
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            logger.error("Error fetching delivery drivers", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to fetch delivery drivers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * Converts a User entity to a DTO map with only the necessary fields
     */
    private Map<String, Object> convertToDTO(User user) {
        Map<String, Object> userDTO = new HashMap<>();
        userDTO.put("id", user.getUserId());
        userDTO.put("username", user.getUsername());
        userDTO.put("email", user.getEmail());
        
        // Safely handle role
        UserRole role = user.getRole();
        userDTO.put("role", role != null ? role.toString() : "unknown");
        
        // Add debug info
        logger.debug("Converting user to DTO: {} with role: {}", user.getUsername(), role);
        
        return userDTO;
    }
}
