package com.railway.wagonmanagement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ConsignmentFromDemandRequest {

    @NotNull(message = "Demand ID is required")
    @Positive(message = "Demand ID must be greater than zero")
    private Long demandId;

    @NotNull(message = "Consignee ID is required")
    @Positive(message = "Consignee ID must be greater than zero")
    private Long consigneeId;

    public ConsignmentFromDemandRequest() {
    }

    public Long getDemandId() {
        return demandId;
    }

    public void setDemandId(Long demandId) {
        this.demandId = demandId;
    }

    public Long getConsigneeId() {
        return consigneeId;
    }

    public void setConsigneeId(Long consigneeId) {
        this.consigneeId = consigneeId;
    }
}