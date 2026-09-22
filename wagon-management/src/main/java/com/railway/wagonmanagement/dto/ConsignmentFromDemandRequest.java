package com.railway.wagonmanagement.dto;

public class ConsignmentFromDemandRequest {

    private Long demandId;
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