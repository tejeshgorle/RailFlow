package com.railway.wagonmanagement.dto;

import java.time.LocalDateTime;

public class RecentMovementResponse {

    private Long movementId;
    private String wagonNumber;
    private String fromStation;
    private String toStation;
    private LocalDateTime movementTime;

    public RecentMovementResponse() {
    }

    public RecentMovementResponse(
            Long movementId,
            String wagonNumber,
            String fromStation,
            String toStation,
            LocalDateTime movementTime
    ) {
        this.movementId = movementId;
        this.wagonNumber = wagonNumber;
        this.fromStation = fromStation;
        this.toStation = toStation;
        this.movementTime = movementTime;
    }

    public Long getMovementId() {
        return movementId;
    }

    public void setMovementId(Long movementId) {
        this.movementId = movementId;
    }

    public String getWagonNumber() {
        return wagonNumber;
    }

    public void setWagonNumber(String wagonNumber) {
        this.wagonNumber = wagonNumber;
    }

    public String getFromStation() {
        return fromStation;
    }

    public void setFromStation(String fromStation) {
        this.fromStation = fromStation;
    }

    public String getToStation() {
        return toStation;
    }

    public void setToStation(String toStation) {
        this.toStation = toStation;
    }

    public LocalDateTime getMovementTime() {
        return movementTime;
    }

    public void setMovementTime(LocalDateTime movementTime) {
        this.movementTime = movementTime;
    }
}