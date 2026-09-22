package com.railway.wagonmanagement.model;

import jakarta.persistence.*;

@Entity
public class Consignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long consignmentId;

    @ManyToOne
    @JoinColumn(name = "consignor_id")
    private Customer consignor;

    @ManyToOne
    @JoinColumn(name = "consignee_id")
    private Customer consignee;

    @OneToOne
    @JoinColumn(name = "demand_id", unique = true)
    private Demand demand;

    private String commodity;

    private Double quantity;

    @ManyToOne
    @JoinColumn(name = "from_station_id")
    private Station fromStation;

    @ManyToOne
    @JoinColumn(name = "to_station_id")
    private Station toStation;

    public Consignment() {
    }

    public Long getConsignmentId() {
        return consignmentId;
    }

    public void setConsignmentId(Long consignmentId) {
        this.consignmentId = consignmentId;
    }

    public Customer getConsignor() {
        return consignor;
    }

    public void setConsignor(Customer consignor) {
        this.consignor = consignor;
    }

    public Customer getConsignee() {
        return consignee;
    }

    public void setConsignee(Customer consignee) {
        this.consignee = consignee;
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

    public Demand getDemand() {
        return demand;
    }

    public void setDemand(Demand demand) {
        this.demand = demand;
    }
}