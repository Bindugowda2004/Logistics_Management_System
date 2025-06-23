package com.logistics.logistics.controller;

import com.logistics.logistics.dto.InventoryRequest;
import com.logistics.logistics.dto.InventoryResponse;
import com.logistics.logistics.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByWarehouse(@PathVariable Integer warehouseId) {
        return ResponseEntity.ok(inventoryService.getInventoryByWarehouse(warehouseId));
    }

    @PostMapping
    public ResponseEntity<?> createInventory(@RequestBody InventoryRequest inventoryRequest) {
        try {
            InventoryResponse createdInventory = inventoryService.createInventory(inventoryRequest);
            return new ResponseEntity<>(createdInventory, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(
            @PathVariable Integer id,
            @RequestBody InventoryRequest inventoryRequest) {
        try {
            InventoryResponse updatedInventory = inventoryService.updateInventory(id, inventoryRequest);
            return ResponseEntity.ok(updatedInventory);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_MANAGER')")
    public ResponseEntity<Void> deleteInventory(@PathVariable Integer id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/quantity")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_MANAGER', 'WAREHOUSE_STAFF')")
    public ResponseEntity<InventoryResponse> updateInventoryQuantity(
            @PathVariable Integer id,
            @RequestBody Map<String, Integer> request) {
        Integer quantityChange = request.get("quantityChange");
        if (quantityChange == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(inventoryService.updateInventoryQuantity(id, quantityChange));
    }

    @GetMapping("/reorder")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_MANAGER')")
    public ResponseEntity<List<InventoryResponse>> getItemsBelowReorderPoint() {
        return ResponseEntity.ok(inventoryService.getItemsBelowReorderPoint());
    }

    @GetMapping("/reorder/warehouse/{warehouseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_MANAGER', 'WAREHOUSE_STAFF')")
    public ResponseEntity<List<InventoryResponse>> getItemsBelowReorderPointByWarehouse(@PathVariable Integer warehouseId) {
        return ResponseEntity.ok(inventoryService.getItemsBelowReorderPointByWarehouse(warehouseId));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasAnyRole('ADMIN', 'LOGISTICS_MANAGER', 'WAREHOUSE_STAFF')")
    public ResponseEntity<Void> transferInventory(@RequestBody Map<String, Integer> request) {
        Integer sourceInventoryId = request.get("sourceInventoryId");
        Integer destinationWarehouseId = request.get("destinationWarehouseId");
        Integer quantity = request.get("quantity");
        
        // Get current user ID from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.parseInt(authentication.getName());
        
        if (sourceInventoryId == null || destinationWarehouseId == null || quantity == null) {
            return ResponseEntity.badRequest().build();
        }
        
        inventoryService.transferInventory(sourceInventoryId, destinationWarehouseId, quantity, userId);
        return ResponseEntity.ok().build();
    }
}
