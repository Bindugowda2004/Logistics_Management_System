package com.logistics.logistics.repository;

import com.logistics.logistics.model.Inventory;
import com.logistics.logistics.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findByWarehouse(Warehouse warehouse);
    
    Optional<Inventory> findBySkuAndWarehouse(String sku, Warehouse warehouse);
    
    List<Inventory> findByItemNameContaining(String itemName);
    
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.reorderPoint")
    List<Inventory> findItemsBelowReorderPoint();
    
    @Query("SELECT i FROM Inventory i WHERE i.warehouse = ?1 AND i.quantity <= i.reorderPoint")
    List<Inventory> findItemsBelowReorderPointByWarehouse(Warehouse warehouse);
}
