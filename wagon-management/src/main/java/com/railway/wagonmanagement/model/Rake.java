package com.railway.wagonmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Rake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rakeId;

    private String rakeNumber;

    @ManyToOne
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    @ManyToOne
    @JoinColumn(name = "from_station_id")
    private Station fromStation;

    @ManyToOne
    @JoinColumn(name = "to_station_id")
    private Station toStation;

    private Integer wagonCount;

    private LocalDateTime formationTime;

    private LocalDateTime dispatchTime;

    @Enumerated(EnumType.STRING)
    private RakeStatus status;

    public Rake() {
    }

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

    public Consignment getConsignment() {
        return consignment;
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = consignment;
    }

    public Station getFromStation() {
        return fromStation;
    }

    public void setFromStation(Station fromStation) {
        this.fromStation = fromStation;
    }

    public Station getToStation() {
        return toStation;
    }

    public void setToStation(Station toStation) {
        this.toStation = toStation;
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

    public RakeStatus getStatus() {
        return status;
    }

    public void setStatus(RakeStatus status) {
        this.status = status;
    }
}