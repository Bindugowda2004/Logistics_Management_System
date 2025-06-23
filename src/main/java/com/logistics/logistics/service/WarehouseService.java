package com.logistics.logistics.service;

import com.logistics.logistics.dto.WarehouseRequest;
import com.logistics.logistics.dto.WarehouseResponse;
import com.logistics.logistics.model.User;
import com.logistics.logistics.model.Warehouse;
import com.logistics.logistics.repository.UserRepository;
import com.logistics.logistics.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private static final Logger logger = LoggerFactory.getLogger(WarehouseService.class);
    
    private final WarehouseRepository warehouseRepository;
    private final UserRepository userRepository;
    
    public List<WarehouseResponse> getAllWarehouses() {
        logger.info("Fetching all warehouses");
        return warehouseRepository.findAll().stream()
                .map(this::mapToWarehouseResponse)
                .collect(Collectors.toList());
    }
    
    public WarehouseResponse getWarehouseById(Integer id) {
        logger.info("Fetching warehouse with id: {}", id);
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", id);
                    return new IllegalArgumentException("Warehouse not found with id: " + id);
                });
        return mapToWarehouseResponse(warehouse);
    }
    
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        try {
            logger.info("Creating new warehouse: {}", request.getName());
            logger.debug("Warehouse request data: {}", request);
            
            User manager = null;
            if (request.getManagerId() != null) {
                manager = userRepository.findById(request.getManagerId())
                        .orElseThrow(() -> {
                            logger.error("Manager not found with id: {}", request.getManagerId());
                            return new IllegalArgumentException("Manager not found with id: " + request.getManagerId());
                        });
            }
            
            // Ensure capacity is properly handled
            BigDecimal capacity;
            if (request.getCapacity() == null) {
                capacity = BigDecimal.ZERO;
                logger.warn("Capacity was null, defaulting to zero");
            } else {
                capacity = request.getCapacity();
            }
            
            Warehouse warehouse = Warehouse.builder()
                    .name(request.getName())
                    .location(request.getLocation())
                    .capacity(capacity)
                    .manager(manager)
                    .contactPhone(request.getContactPhone())
                    .contactEmail(request.getContactEmail())
                    .isActive(true)
                    .build();
            
            Warehouse savedWarehouse = warehouseRepository.save(warehouse);
            logger.info("Warehouse created successfully with id: {}", savedWarehouse.getWarehouseId());
            
            return mapToWarehouseResponse(savedWarehouse);
        } catch (Exception e) {
            logger.error("Error creating warehouse: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create warehouse: " + e.getMessage(), e);
        }
    }
    
    public WarehouseResponse updateWarehouse(Integer id, WarehouseRequest request) {
        try {
            logger.info("Updating warehouse with id: {}", id);
            logger.debug("Warehouse update request data: {}", request);
            
            Warehouse warehouse = warehouseRepository.findById(id)
                    .orElseThrow(() -> {
                        logger.error("Warehouse not found with id: {}", id);
                        return new IllegalArgumentException("Warehouse not found with id: " + id);
                    });
            
            User manager = null;
            if (request.getManagerId() != null) {
                manager = userRepository.findById(request.getManagerId())
                        .orElseThrow(() -> {
                            logger.error("Manager not found with id: {}", request.getManagerId());
                            return new IllegalArgumentException("Manager not found with id: " + request.getManagerId());
                        });
            }
            
            // Ensure capacity is properly handled
            BigDecimal capacity;
            if (request.getCapacity() == null) {
                capacity = warehouse.getCapacity(); // Keep existing value if null
                logger.warn("Update capacity was null, keeping existing value");
            } else {
                capacity = request.getCapacity();
            }
            
            warehouse.setName(request.getName());
            warehouse.setLocation(request.getLocation());
            warehouse.setCapacity(capacity);
            warehouse.setManager(manager);
            warehouse.setContactPhone(request.getContactPhone());
            warehouse.setContactEmail(request.getContactEmail());
            
            Warehouse updatedWarehouse = warehouseRepository.save(warehouse);
            logger.info("Warehouse updated successfully: {}", updatedWarehouse.getWarehouseId());
            
            return mapToWarehouseResponse(updatedWarehouse);
        } catch (Exception e) {
            logger.error("Error updating warehouse: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update warehouse: " + e.getMessage(), e);
        }
    }
    
    public void deleteWarehouse(Integer id) {
        logger.info("Deleting warehouse with id: {}", id);
        
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", id);
                    return new IllegalArgumentException("Warehouse not found with id: " + id);
                });
        
        // Soft delete by setting isActive to false
        warehouse.setIsActive(false);
        warehouseRepository.save(warehouse);
        logger.info("Warehouse soft-deleted successfully: {}", id);
    }
    
    public List<WarehouseResponse> getWarehousesByManager(Integer managerId) {
        logger.info("Fetching warehouses by manager id: {}", managerId);
        
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> {
                    logger.error("Manager not found with id: {}", managerId);
                    return new IllegalArgumentException("Manager not found with id: " + managerId);
                });
        
        return warehouseRepository.findByManager(manager).stream()
                .map(this::mapToWarehouseResponse)
                .collect(Collectors.toList());
    }
    
    private WarehouseResponse mapToWarehouseResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .warehouseId(warehouse.getWarehouseId())
                .name(warehouse.getName())
                .location(warehouse.getLocation())
                .capacity(warehouse.getCapacity())
                .managerId(warehouse.getManager() != null ? warehouse.getManager().getUserId() : null)
                .managerName(warehouse.getManager() != null ? warehouse.getManager().getUsername() : null)
                .contactPhone(warehouse.getContactPhone())
                .contactEmail(warehouse.getContactEmail())
                .isActive(warehouse.getIsActive())
                .build();
    }
}
