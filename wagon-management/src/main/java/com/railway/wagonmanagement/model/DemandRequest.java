package com.railway.wagonmanagement.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class DemandRequest {

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be greater than 0")
    private Long customerId;

    @NotBlank(message = "Commodity is required")
    @Size(max = 100, message = "Commodity cannot exceed 100 characters")
    private String commodity;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantity;

    @NotNull(message = "Required wagon count is required")
    @Positive(message = "Required wagon count must be greater than 0")
    private Integer requiredWagons;

    @NotNull(message = "From station ID is required")
    @Positive(message = "From station ID must be greater than 0")
    private Long fromStationId;

    @NotNull(message = "To station ID is required")
    @Positive(message = "To station ID must be greater than 0")
    private Long toStationId;

    public DemandRequest() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCommodity() {
        return commodity;
    }

    public void setCommodity(String commodity) {
        this.commodity = commodity;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Integer getRequiredWagons() {
        return requiredWagons;
    }

    public void setRequiredWagons(Integer requiredWagons) {
        this.requiredWagons = requiredWagons;
    }

    public Long getFromStationId() {
        return fromStationId;
    }

    public void setFromStationId(Long fromStationId) {
        this.fromStationId = fromStationId;
    }

    public Long getToStationId() {
        return toStationId;
    }

    public void setToStationId(Long toStationId) {
        this.toStationId = toStationId;
    }
}