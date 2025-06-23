package com.logistics.logistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponse {
    private Integer warehouseId;
    private String name;
    private String location;
    private BigDecimal capacity;
    private Integer managerId;
    private String managerName;
    private String contactPhone;
    private String contactEmail;
    private Boolean isActive;
}
