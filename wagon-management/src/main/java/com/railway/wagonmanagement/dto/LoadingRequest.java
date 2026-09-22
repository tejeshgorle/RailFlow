package com.railway.wagonmanagement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class LoadingRequest {

    @NotNull(message = "Wagon ID is required")
    @Positive(message = "Wagon ID must be greater than 0")
    private Long wagonId;

    @NotNull(message = "Consignment ID is required")
    @Positive(message = "Consignment ID must be greater than 0")
    private Long consignmentId;

    @NotNull(message = "Loaded quantity is required")
    @Positive(message = "Loaded quantity must be greater than 0")
    private Double loadedQuantity;

    public LoadingRequest() {
    }

    public Long getWagonId() {
        return wagonId;
    }

    public void setWagonId(Long wagonId) {
        this.wagonId = wagonId;
    }

    public Long getConsignmentId() {
        return consignmentId;
    }

    public void setConsignmentId(Long consignmentId) {
        this.consignmentId = consignmentId;
    }

    public Double getLoadedQuantity() {
        return loadedQuantity;
    }

    public void setLoadedQuantity(Double loadedQuantity) {
        this.loadedQuantity = loadedQuantity;
    }
}