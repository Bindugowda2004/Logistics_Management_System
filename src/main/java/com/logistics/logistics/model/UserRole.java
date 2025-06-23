package com.logistics.logistics.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;

public enum UserRole {
    ADMIN("admin"),
    LOGISTICS_MANAGER("logistics_manager"),
    WAREHOUSE_STAFF("warehouse_staff"),
    DELIVERY_DRIVER("delivery_driver");
    
    private final String value;
    
    UserRole(String value) {
        this.value = value;
    }
    
    @JsonValue
    public String getValue() {
        return value;
    }
    
    @JsonCreator
    public static UserRole fromValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Value cannot be null");
        }
        
        String trimmedValue = value.trim();
        
        // First try matching by value (case-insensitive)
        return Arrays.stream(UserRole.values())
                .filter(role -> role.getValue().equalsIgnoreCase(trimmedValue))
                .findFirst()
                .orElseGet(() -> {
                    // If value doesn't match, try by enum name
                    try {
                        return UserRole.valueOf(trimmedValue.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException(
                            "Invalid role value: " + value + ". Valid values are: admin, logistics_manager, warehouse_staff, delivery_driver");
                    }
                });
    }
    
    @Override
    public String toString() {
        return value;
    }
}
