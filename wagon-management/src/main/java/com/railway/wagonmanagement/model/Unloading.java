package com.railway.wagonmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Unloading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long unloadingId;

    @ManyToOne
    @JoinColumn(name = "wagon_id")
    private Wagon wagon;

    @ManyToOne
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    private Double unloadedQuantity;

    private LocalDateTime unloadingTime;

    @Enumerated(EnumType.STRING)
    private UnloadingStatus unloadingStatus;

    public Unloading() {
    }

    public Long getUnloadingId() {
        return unloadingId;
    }

    public void setUnloadingId(Long unloadingId) {
        this.unloadingId = unloadingId;
    }

    public Wagon getWagon() {
        return wagon;
    }

    public void setWagon(Wagon wagon) {
        this.wagon = wagon;
    }

    public Consignment getConsignment() {
        return consignment;
    }

    public void setConsignment(Consignment consignment) {
        this.consignment = consignment;
    }

    public Double getUnloadedQuantity() {
        return unloadedQuantity;
    }

    public void setUnloadedQuantity(Double unloadedQuantity) {
        this.unloadedQuantity = unloadedQuantity;
    }

    public LocalDateTime getUnloadingTime() {
        return unloadingTime;
    }

    public void setUnloadingTime(LocalDateTime unloadingTime) {
        this.unloadingTime = unloadingTime;
    }

    public UnloadingStatus getUnloadingStatus() {
        return unloadingStatus;
    }

    public void setUnloadingStatus(UnloadingStatus unloadingStatus) {
        this.unloadingStatus = unloadingStatus;
    }
}