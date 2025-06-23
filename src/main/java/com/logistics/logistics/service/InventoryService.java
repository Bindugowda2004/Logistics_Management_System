package com.logistics.logistics.service;

import com.logistics.logistics.dto.InventoryRequest;
import com.logistics.logistics.dto.InventoryResponse;
import com.logistics.logistics.model.Inventory;
import com.logistics.logistics.model.InventoryTransfer;
import com.logistics.logistics.model.User;
import com.logistics.logistics.model.Warehouse;
import com.logistics.logistics.repository.InventoryRepository;
import com.logistics.logistics.repository.InventoryTransferRepository;
import com.logistics.logistics.repository.UserRepository;
import com.logistics.logistics.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
    
    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryTransferRepository inventoryTransferRepository;
    private final UserRepository userRepository;
    
    public List<InventoryResponse> getAllInventory() {
        logger.info("Fetching all inventory items");
        return inventoryRepository.findAll().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public InventoryResponse getInventoryById(Integer id) {
        logger.info("Fetching inventory with id: {}", id);
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Inventory not found with id: {}", id);
                    return new IllegalArgumentException("Inventory not found with id: " + id);
                });
        return mapToInventoryResponse(inventory);
    }
    
    public List<InventoryResponse> getInventoryByWarehouse(Integer warehouseId) {
        logger.info("Fetching inventory for warehouse id: {}", warehouseId);
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", warehouseId);
                    return new IllegalArgumentException("Warehouse not found with id: " + warehouseId);
                });
        
        return inventoryRepository.findByWarehouse(warehouse).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public InventoryResponse createInventory(InventoryRequest request) {
        logger.info("Creating new inventory item: {}", request.getItemName());
        
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", request.getWarehouseId());
                    return new IllegalArgumentException("Warehouse not found with id: " + request.getWarehouseId());
                });
        
        // Check if item with same SKU already exists in this warehouse
        inventoryRepository.findBySkuAndWarehouse(request.getSku(), warehouse)
                .ifPresent(existingItem -> {
                    logger.error("Item with SKU {} already exists in warehouse {}", request.getSku(), warehouse.getName());
                    throw new IllegalArgumentException("Item with SKU " + request.getSku() + " already exists in warehouse " + warehouse.getName());
                });
        
        Inventory inventory = Inventory.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .reorderPoint(request.getReorderPoint())
                .reorderQuantity(request.getReorderQuantity())
                .unitPrice(request.getUnitPrice())
                .warehouse(warehouse)
                .build();
        
        Inventory savedInventory = inventoryRepository.save(inventory);
        logger.info("Inventory item created successfully with id: {}", savedInventory.getInventoryId());
        
        return mapToInventoryResponse(savedInventory);
    }
    
    public InventoryResponse updateInventory(Integer id, InventoryRequest request) {
        logger.info("Updating inventory with id: {}", id);
        
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Inventory not found with id: {}", id);
                    return new IllegalArgumentException("Inventory not found with id: " + id);
                });
        
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", request.getWarehouseId());
                    return new IllegalArgumentException("Warehouse not found with id: " + request.getWarehouseId());
                });
        
        // If SKU is changing, check if new SKU already exists in this warehouse
        if (!inventory.getSku().equals(request.getSku())) {
            inventoryRepository.findBySkuAndWarehouse(request.getSku(), warehouse)
                    .ifPresent(existingItem -> {
                        logger.error("Item with SKU {} already exists in warehouse {}", request.getSku(), warehouse.getName());
                        throw new IllegalArgumentException("Item with SKU " + request.getSku() + " already exists in warehouse " + warehouse.getName());
                    });
        }
        
        inventory.setItemName(request.getItemName());
        inventory.setDescription(request.getDescription());
        inventory.setSku(request.getSku());
        inventory.setQuantity(request.getQuantity());
        inventory.setReorderPoint(request.getReorderPoint());
        inventory.setReorderQuantity(request.getReorderQuantity());
        inventory.setUnitPrice(request.getUnitPrice());
        inventory.setWarehouse(warehouse);
        
        Inventory updatedInventory = inventoryRepository.save(inventory);
        logger.info("Inventory updated successfully: {}", updatedInventory.getInventoryId());
        
        return mapToInventoryResponse(updatedInventory);
    }
    
    public void deleteInventory(Integer id) {
        logger.info("Deleting inventory with id: {}", id);
        
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Inventory not found with id: {}", id);
                    return new IllegalArgumentException("Inventory not found with id: " + id);
                });
        
        inventoryRepository.delete(inventory);
        logger.info("Inventory deleted successfully: {}", id);
    }
    
    @Transactional
    public InventoryResponse updateInventoryQuantity(Integer id, Integer quantityChange) {
        logger.info("Updating inventory quantity for id: {}, change: {}", id, quantityChange);
        
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Inventory not found with id: {}", id);
                    return new IllegalArgumentException("Inventory not found with id: " + id);
                });
        
        int newQuantity = inventory.getQuantity() + quantityChange;
        if (newQuantity < 0) {
            logger.error("Cannot reduce inventory below zero. Current: {}, Change: {}", inventory.getQuantity(), quantityChange);
            throw new IllegalArgumentException("Cannot reduce inventory below zero");
        }
        
        inventory.setQuantity(newQuantity);
        Inventory updatedInventory = inventoryRepository.save(inventory);
        logger.info("Inventory quantity updated successfully: {}, new quantity: {}", id, newQuantity);
        
        return mapToInventoryResponse(updatedInventory);
    }
    
    public List<InventoryResponse> getItemsBelowReorderPoint() {
        logger.info("Fetching items below reorder point");
        return inventoryRepository.findItemsBelowReorderPoint().stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    public List<InventoryResponse> getItemsBelowReorderPointByWarehouse(Integer warehouseId) {
        logger.info("Fetching items below reorder point for warehouse id: {}", warehouseId);
        
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> {
                    logger.error("Warehouse not found with id: {}", warehouseId);
                    return new IllegalArgumentException("Warehouse not found with id: " + warehouseId);
                });
        
        return inventoryRepository.findItemsBelowReorderPointByWarehouse(warehouse).stream()
                .map(this::mapToInventoryResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void transferInventory(Integer sourceInventoryId, Integer destinationWarehouseId, Integer quantity, Integer userId) {
        logger.info("Transferring inventory: from item {}, to warehouse {}, quantity {}", 
                sourceInventoryId, destinationWarehouseId, quantity);
        
        if (quantity <= 0) {
            logger.error("Transfer quantity must be positive: {}", quantity);
            throw new IllegalArgumentException("Transfer quantity must be positive");
        }
        
        Inventory sourceInventory = inventoryRepository.findById(sourceInventoryId)
                .orElseThrow(() -> {
                    logger.error("Source inventory not found with id: {}", sourceInventoryId);
                    return new IllegalArgumentException("Source inventory not found with id: " + sourceInventoryId);
                });
        
        if (sourceInventory.getQuantity() < quantity) {
            logger.error("Insufficient quantity for transfer. Available: {}, Requested: {}", 
                    sourceInventory.getQuantity(), quantity);
            throw new IllegalArgumentException("Insufficient quantity for transfer");
        }
        
        Warehouse sourceWarehouse = sourceInventory.getWarehouse();
        Warehouse destinationWarehouse = warehouseRepository.findById(destinationWarehouseId)
                .orElseThrow(() -> {
                    logger.error("Destination warehouse not found with id: {}", destinationWarehouseId);
                    return new IllegalArgumentException("Destination warehouse not found with id: " + destinationWarehouseId);
                });
        
        User initiatedBy = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", userId);
                    return new IllegalArgumentException("User not found with id: " + userId);
                });
        
        // Create transfer record
        InventoryTransfer transfer = InventoryTransfer.builder()
                .sourceWarehouse(sourceWarehouse)
                .destinationWarehouse(destinationWarehouse)
                .inventory(sourceInventory)
                .quantity(quantity)
                .status(InventoryTransfer.TransferStatus.IN_TRANSIT)
                .initiatedBy(initiatedBy)
                .build();
        
        inventoryTransferRepository.save(transfer);
        
        // Reduce quantity from source
        sourceInventory.setQuantity(sourceInventory.getQuantity() - quantity);
        inventoryRepository.save(sourceInventory);
        
        // Check if same item exists in destination warehouse
        Inventory destinationInventory = inventoryRepository.findBySkuAndWarehouse(sourceInventory.getSku(), destinationWarehouse)
                .orElse(null);
        
        if (destinationInventory != null) {
            // Update existing inventory in destination
            destinationInventory.setQuantity(destinationInventory.getQuantity() + quantity);
            inventoryRepository.save(destinationInventory);
        } else {
            // Create new inventory item in destination
            Inventory newInventory = Inventory.builder()
                    .itemName(sourceInventory.getItemName())
                    .description(sourceInventory.getDescription())
                    .sku(sourceInventory.getSku())
                    .quantity(quantity)
                    .reorderPoint(sourceInventory.getReorderPoint())
                    .reorderQuantity(sourceInventory.getReorderQuantity())
                    .unitPrice(sourceInventory.getUnitPrice())
                    .warehouse(destinationWarehouse)
                    .build();
            
            inventoryRepository.save(newInventory);
        }
        
        // Complete the transfer
        transfer.setStatus(InventoryTransfer.TransferStatus.COMPLETED);
        transfer.setCompletedAt(LocalDateTime.now());
        inventoryTransferRepository.save(transfer);
        
        logger.info("Inventory transfer completed successfully");
    }
    
    private InventoryResponse mapToInventoryResponse(Inventory inventory) {
        boolean needsRestock = inventory.getQuantity() <= inventory.getReorderPoint();
        
        return InventoryResponse.builder()
                .inventoryId(inventory.getInventoryId())
                .itemName(inventory.getItemName())
                .description(inventory.getDescription())
                .sku(inventory.getSku())
                .quantity(inventory.getQuantity())
                .reorderPoint(inventory.getReorderPoint())
                .reorderQuantity(inventory.getReorderQuantity())
                .unitPrice(inventory.getUnitPrice())
                .warehouseId(inventory.getWarehouse().getWarehouseId())
                .warehouseName(inventory.getWarehouse().getName())
                .updatedAt(inventory.getUpdatedAt())
                .needsRestock(needsRestock)
                .build();
    }
}
