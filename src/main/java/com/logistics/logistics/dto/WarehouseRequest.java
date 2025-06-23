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
public class WarehouseRequest {
    private String name;
    private String location;
    private BigDecimal capacity;
    private Integer managerId;
    private String contactPhone;
    private String contactEmail;
}
