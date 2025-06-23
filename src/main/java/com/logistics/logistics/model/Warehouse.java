package com.logistics.logistics.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "Warehouses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Integer warehouseId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal capacity;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private User manager;
    
    // Additional fields for warehouse details
    private String contactPhone;
    private String contactEmail;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}
