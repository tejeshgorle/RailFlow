package com.railway.wagonmanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

public class RakeDetailsResponse {

    private Long rakeId;
    private String rakeNumber;
    private String status;
    private Integer wagonCount;

    private LocalDateTime formationTime;
    private LocalDateTime dispatchTime;

    private StationSummary fromStation;
    private StationSummary toStation;

    private ConsignmentSummary consignment;

    private List<WagonSummary> wagons;

    public RakeDetailsResponse() {
    }

    public RakeDetailsResponse(
            Long rakeId,
            String rakeNumber,
            String status,
            Integer wagonCount,
            LocalDateTime formationTime,
            LocalDateTime dispatchTime,
            StationSummary fromStation,
            StationSummary toStation,
            ConsignmentSummary consignment,
            List<WagonSummary> wagons) {

        this.rakeId = rakeId;
        this.rakeNumber = rakeNumber;
        this.status = status;
        this.wagonCount = wagonCount;
        this.formationTime = formationTime;
        this.dispatchTime = dispatchTime;
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.consignment = consignment;
        this.wagons = wagons;
    }

    // -------------------------------------------------
    // Getters and Setters
    // -------------------------------------------------

    public Long getRakeId() {
        return rakeId;
    }

    public void setRakeId(Long rakeId) {
        this.rakeId = rakeId;
    }

    public String getRakeNumber() {
        return rakeNumber;
    }

    public void setRakeNumber(String rakeNumber) {
        this.rakeNumber = rakeNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getWagonCount() {
        return wagonCount;
    }

    public void setWagonCount(Integer wagonCount) {
        this.wagonCount = wagonCount;
    }

    public LocalDateTime getFormationTime() {
        return formationTime;
    }

    public void setFormationTime(LocalDateTime formationTime) {
        this.formationTime = formationTime;
    }

    public LocalDateTime getDispatchTime() {
        return dispatchTime;
    }

    public void setDispatchTime(LocalDateTime dispatchTime) {
        this.dispatchTime = dispatchTime;
    }

    public StationSummary getFromStation() {
        return fromStation;
    }

    public void setFromStation(StationSummary fromStation) {
        this.fromStation = fromStation;
    }

    public StationSummary getToStation() {
        return toStation;
    }

    public void setToStation(StationSummary toStation) {
        this.toStation = toStation;
    }

    public ConsignmentSummary getConsignment() {
        return consignment;
    }

    public void setConsignment(ConsignmentSummary consignment) {
        this.consignment = consignment;
    }

    public List<WagonSummary> getWagons() {
        return wagons;
    }

    public void setWagons(List<WagonSummary> wagons) {
        this.wagons = wagons;
    }

    // =================================================
    // Station Summary
    // =================================================

    public static class StationSummary {

        private Long stationId;
        private String stationCode;
        private String stationName;
        private String zone;
        private String division;

        public StationSummary() {
        }

        public StationSummary(
                Long stationId,
                String stationCode,
                String stationName,
                String zone,
                String division) {

            this.stationId = stationId;
            this.stationCode = stationCode;
            this.stationName = stationName;
            this.zone = zone;
            this.division = division;
        }

        public Long getStationId() {
            return stationId;
        }

        public void setStationId(Long stationId) {
            this.stationId = stationId;
        }

        public String getStationCode() {
            return stationCode;
        }

        public void setStationCode(String stationCode) {
            this.stationCode = stationCode;
        }

        public String getStationName() {
            return stationName;
        }

        public void setStationName(String stationName) {
            this.stationName = stationName;
        }

        public String getZone() {
            return zone;
        }

        public void setZone(String zone) {
            this.zone = zone;
        }

        public String getDivision() {
            return division;
        }

        public void setDivision(String division) {
            this.division = division;
        }
    }

    // =================================================
    // Consignment Summary
    // =================================================

    public static class ConsignmentSummary {

        private Long consignmentId;
        private String commodity;
        private Double quantity;

        private Long demandId;

        private Long consignorId;
        private String consignorName;

        private Long consigneeId;
        private String consigneeName;

        public ConsignmentSummary() {
        }

        public ConsignmentSummary(
                Long consignmentId,
                String commodity,
                Double quantity,
                Long demandId,
                Long consignorId,
                String consignorName,
                Long consigneeId,
                String consigneeName) {

            this.consignmentId = consignmentId;
            this.commodity = commodity;
            this.quantity = quantity;
            this.demandId = demandId;
            this.consignorId = consignorId;
            this.consignorName = consignorName;
            this.consigneeId = consigneeId;
            this.consigneeName = consigneeName;
        }

        public Long getConsignmentId() {
            return consignmentId;
        }

        public void setConsignmentId(Long consignmentId) {
            this.consignmentId = consignmentId;
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

        public Long getDemandId() {
            return demandId;
        }

        public void setDemandId(Long demandId) {
            this.demandId = demandId;
        }

        public Long getConsignorId() {
            return consignorId;
        }

        public void setConsignorId(Long consignorId) {
            this.consignorId = consignorId;
        }

        public String getConsignorName() {
            return consignorName;
        }

        public void setConsignorName(String consignorName) {
            this.consignorName = consignorName;
        }

        public Long getConsigneeId() {
            return consigneeId;
        }

        public void setConsigneeId(Long consigneeId) {
            this.consigneeId = consigneeId;
        }

        public String getConsigneeName() {
            return consigneeName;
        }

        public void setConsigneeName(String consigneeName) {
            this.consigneeName = consigneeName;
        }
    }

    // =================================================
    // Wagon Summary
    // =================================================

    public static class WagonSummary {

        private Integer sequenceNumber;

        private Long wagonId;
        private String wagonNumber;
        private String wagonType;
        private Integer capacity;
        private String status;

        public WagonSummary() {
        }

        public WagonSummary(
                Integer sequenceNumber,
                Long wagonId,
                String wagonNumber,
                String wagonType,
                Integer capacity,
                String status) {

            this.sequenceNumber = sequenceNumber;
            this.wagonId = wagonId;
            this.wagonNumber = wagonNumber;
            this.wagonType = wagonType;
            this.capacity = capacity;
            this.status = status;
        }

        public Integer getSequenceNumber() {
            return sequenceNumber;
        }

        public void setSequenceNumber(Integer sequenceNumber) {
            this.sequenceNumber = sequenceNumber;
        }

        public Long getWagonId() {
            return wagonId;
        }

        public void setWagonId(Long wagonId) {
            this.wagonId = wagonId;
        }

        public String getWagonNumber() {
            return wagonNumber;
        }

        public void setWagonNumber(String wagonNumber) {
            this.wagonNumber = wagonNumber;
        }

        public String getWagonType() {
            return wagonType;
        }

        public void setWagonType(String wagonType) {
            this.wagonType = wagonType;
        }

        public Integer getCapacity() {
            return capacity;
        }

        public void setCapacity(Integer capacity) {
            this.capacity = capacity;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}