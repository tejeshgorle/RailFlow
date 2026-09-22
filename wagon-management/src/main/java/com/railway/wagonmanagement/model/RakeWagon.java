package com.railway.wagonmanagement.model;

import jakarta.persistence.*;

@Entity
public class RakeWagon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rakeWagonId;

    @ManyToOne
    @JoinColumn(name = "rake_id")
    private Rake rake;

    @ManyToOne
    @JoinColumn(name = "wagon_id")
    private Wagon wagon;

    private Integer sequenceNumber;

    public RakeWagon() {
    }

    public Long getRakeWagonId() {
        return rakeWagonId;
    }

    public void setRakeWagonId(Long rakeWagonId) {
        this.rakeWagonId = rakeWagonId;
    }

    public Rake getRake() {
        return rake;
    }

    public void setRake(Rake rake) {
        this.rake = rake;
    }

    public Wagon getWagon() {
        return wagon;
    }

    public void setWagon(Wagon wagon) {
        this.wagon = wagon;
    }

    public Integer getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Integer sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }
}