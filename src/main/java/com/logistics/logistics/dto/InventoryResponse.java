package com.logistics.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryResponse {
    private Integer inventoryId;
    private String itemName;
    private String description;
    private String sku;
    private Integer quantity;
    private Integer reorderPoint;
    private Integer reorderQuantity;
    private BigDecimal unitPrice;
    private Integer warehouseId;
    private String warehouseName;
    private LocalDateTime updatedAt;
    private Boolean needsRestock;
}
