package com.railway.wagonmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Wagon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wagonId;

    @NotBlank(message = "Wagon number is required")
    @Size(min = 3, max = 20,
          message = "Wagon number must be between 3 and 20 characters")
    @Column(nullable = false, unique = true)
    private String wagonNumber;

    @NotBlank(message = "Wagon type is required")
    @Size(max = 50,
          message = "Wagon type cannot exceed 50 characters")
    private String wagonType;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private WagonStatus status;

    @ManyToOne
    @JoinColumn(name = "station_id")
    private Station station;

    public Wagon() {
    }

    public Wagon(
            Long wagonId,
            String wagonNumber,
            String wagonType,
            Integer capacity,
            WagonStatus status) {

        this.wagonId = wagonId;
        this.wagonNumber = wagonNumber;
        this.wagonType = wagonType;
        this.capacity = capacity;
        this.status = status;
    }

    public Long getWagonId() {
        return wagonId;
    }

    public String getWagonNumber() {
        return wagonNumber;
    }

    public String getWagonType() {
        return wagonType;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public WagonStatus getStatus() {
        return status;
    }

    public Station getStation() {
        return station;
    }

    public void setWagonId(Long wagonId) {
        this.wagonId = wagonId;
    }

    public void setWagonNumber(String wagonNumber) {
        this.wagonNumber = wagonNumber;
    }

    public void setWagonType(String wagonType) {
        this.wagonType = wagonType;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setStatus(WagonStatus status) {
        this.status = status;
    }

    public void setStation(Station station) {
        this.station = station;
    }
}