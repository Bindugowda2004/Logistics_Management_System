package com.logistics.logistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "InventoryTransfers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransfer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transfer_id")
    private Integer transferId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_warehouse_id", nullable = false)
    private Warehouse sourceWarehouse;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_warehouse_id", nullable = false)
    private Warehouse destinationWarehouse;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventory_id", nullable = false)
    private Inventory inventory;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TransferStatus status;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "initiated_by")
    private User initiatedBy;
    
    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        initiatedAt = LocalDateTime.now();
    }
    
    public enum TransferStatus {
        PENDING,
        IN_TRANSIT,
        COMPLETED,
        CANCELLED
    }
}
