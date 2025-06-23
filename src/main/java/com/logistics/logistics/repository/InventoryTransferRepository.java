package com.logistics.logistics.repository;

import com.logistics.logistics.model.InventoryTransfer;
import com.logistics.logistics.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransferRepository extends JpaRepository<InventoryTransfer, Integer> {
    List<InventoryTransfer> findBySourceWarehouse(Warehouse sourceWarehouse);
    List<InventoryTransfer> findByDestinationWarehouse(Warehouse destinationWarehouse);
    List<InventoryTransfer> findByStatus(InventoryTransfer.TransferStatus status);
}
