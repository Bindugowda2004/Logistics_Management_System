package com.logistics.logistics.controller;

import com.logistics.logistics.dto.WarehouseRequest;
import com.logistics.logistics.dto.WarehouseResponse;
import com.logistics.logistics.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponse> getWarehouseById(@PathVariable Integer id) {
        return ResponseEntity.ok(warehouseService.getWarehouseById(id));
    }

    @PostMapping
    public ResponseEntity<?> createWarehouse(@RequestBody WarehouseRequest warehouseRequest) {
        try {
            WarehouseResponse createdWarehouse = warehouseService.createWarehouse(warehouseRequest);
            return new ResponseEntity<>(createdWarehouse, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWarehouse(
            @PathVariable Integer id,
            @RequestBody WarehouseRequest warehouseRequest) {
        try {
            WarehouseResponse updatedWarehouse = warehouseService.updateWarehouse(id, warehouseRequest);
            return ResponseEntity.ok(updatedWarehouse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Integer id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<WarehouseResponse>> getWarehousesByManager(@PathVariable Integer managerId) {
        return ResponseEntity.ok(warehouseService.getWarehousesByManager(managerId));
    }
}
