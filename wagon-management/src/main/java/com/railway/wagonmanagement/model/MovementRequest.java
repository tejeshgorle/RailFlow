package com.railway.wagonmanagement.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MovementRequest {

    @NotNull(message = "Wagon ID is required")
    @Positive(message = "Wagon ID must be greater than 0")
    private Long wagonId;

    @NotNull(message = "From station ID is required")
    @Positive(message = "From station ID must be greater than 0")
    private Long fromStationId;

    @NotNull(message = "To station ID is required")
    @Positive(message = "To station ID must be greater than 0")
    private Long toStationId;

    public MovementRequest() {
    }

    public Long getWagonId() {
        return wagonId;
    }

    public void setWagonId(Long wagonId) {
        this.wagonId = wagonId;
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