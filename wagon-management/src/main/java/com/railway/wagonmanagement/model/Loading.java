package com.railway.wagonmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Loading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loadingId;

    @ManyToOne
    @JoinColumn(name = "wagon_id")
    private Wagon wagon;

    @ManyToOne
    @JoinColumn(name = "consignment_id")
    private Consignment consignment;

    private Double loadedQuantity;

    private LocalDateTime loadingTime;

    @Enumerated(EnumType.STRING)
    private LoadingStatus loadingStatus;

    public Loading() {
    }

    public Long getLoadingId() {
        return loadingId;
    }

    public void setLoadingId(Long loadingId) {
        this.loadingId = loadingId;
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

    public Double getLoadedQuantity() {
        return loadedQuantity;
    }

    public void setLoadedQuantity(Double loadedQuantity) {
        this.loadedQuantity = loadedQuantity;
    }

    public LocalDateTime getLoadingTime() {
        return loadingTime;
    }

    public void setLoadingTime(LocalDateTime loadingTime) {
        this.loadingTime = loadingTime;
    }

    public LoadingStatus getLoadingStatus() {
        return loadingStatus;
    }

    public void setLoadingStatus(LoadingStatus loadingStatus) {
        this.loadingStatus = loadingStatus;
    }
}