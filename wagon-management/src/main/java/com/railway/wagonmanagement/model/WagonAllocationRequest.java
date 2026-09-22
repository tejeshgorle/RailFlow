package com.railway.wagonmanagement.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class WagonAllocationRequest {

    @NotNull(message = "Wagon ID is required")
    @Positive(message = "Wagon ID must be greater than 0")
    private Long wagonId;

    @NotNull(message = "Consignment ID is required")
    @Positive(message = "Consignment ID must be greater than 0")
    private Long consignmentId;

    public WagonAllocationRequest() {
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
}