package com.railway.wagonmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class RakeRequest {

    @NotNull(message = "Consignment ID is required")
    @Positive(message = "Consignment ID must be greater than 0")
    private Long consignmentId;

    @NotBlank(message = "Rake number is required")
    @Size(
        min = 3,
        max = 30,
        message = "Rake number must be between 3 and 30 characters"
    )
    private String rakeNumber;

    public RakeRequest() {
    }

    public Long getConsignmentId() {
        return consignmentId;
    }

    public void setConsignmentId(Long consignmentId) {
        this.consignmentId = consignmentId;
    }

    public String getRakeNumber() {
        return rakeNumber;
    }

    public void setRakeNumber(String rakeNumber) {
        this.rakeNumber = rakeNumber;
    }
}