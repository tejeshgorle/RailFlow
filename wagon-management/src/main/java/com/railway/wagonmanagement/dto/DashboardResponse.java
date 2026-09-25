package com.railway.wagonmanagement.dto;

public class DashboardResponse {

    // =====================================================
    // WAGON STATISTICS
    // =====================================================

    private long totalWagons;
    private long availableWagons;
    private long allocatedWagons;
    private long loadedWagons;
    private long emptyWagons;


    // =====================================================
    // DEMAND STATISTICS
    // =====================================================

    private long totalDemands;
    private long registeredDemands;
    private long approvedDemands;
    private long allocatedDemands;
    private long loadedDemands;
    private long deliveredDemands;


    // =====================================================
    // RAKE STATISTICS
    // =====================================================

    private long totalRakes;
    private long formedRakes;
    private long dispatchedRakes;
    private long arrivedRakes;


    // =====================================================
    // OTHER OPERATIONS
    // =====================================================

    private long totalConsignments;
    private long totalMovements;

    private long loadedDemandsAwaitingRake;
    private long arrivedRakesAwaitingUnloading;
    private long attentionTotal;


    public DashboardResponse() {
    }


    public long getTotalWagons() {
        return totalWagons;
    }

    public void setTotalWagons(long totalWagons) {
        this.totalWagons = totalWagons;
    }


    public long getAvailableWagons() {
        return availableWagons;
    }

    public void setAvailableWagons(long availableWagons) {
        this.availableWagons = availableWagons;
    }


    public long getAllocatedWagons() {
        return allocatedWagons;
    }

    public void setAllocatedWagons(long allocatedWagons) {
        this.allocatedWagons = allocatedWagons;
    }


    public long getLoadedWagons() {
        return loadedWagons;
    }

    public void setLoadedWagons(long loadedWagons) {
        this.loadedWagons = loadedWagons;
    }


    public long getEmptyWagons() {
        return emptyWagons;
    }

    public void setEmptyWagons(long emptyWagons) {
        this.emptyWagons = emptyWagons;
    }


    public long getTotalDemands() {
        return totalDemands;
    }

    public void setTotalDemands(long totalDemands) {
        this.totalDemands = totalDemands;
    }


    public long getRegisteredDemands() {
        return registeredDemands;
    }

    public void setRegisteredDemands(long registeredDemands) {
        this.registeredDemands = registeredDemands;
    }


    public long getApprovedDemands() {
        return approvedDemands;
    }

    public void setApprovedDemands(long approvedDemands) {
        this.approvedDemands = approvedDemands;
    }


    public long getAllocatedDemands() {
        return allocatedDemands;
    }

    public void setAllocatedDemands(long allocatedDemands) {
        this.allocatedDemands = allocatedDemands;
    }


    public long getLoadedDemands() {
        return loadedDemands;
    }

    public void setLoadedDemands(long loadedDemands) {
        this.loadedDemands = loadedDemands;
    }


    public long getDeliveredDemands() {
        return deliveredDemands;
    }

    public void setDeliveredDemands(long deliveredDemands) {
        this.deliveredDemands = deliveredDemands;
    }


    public long getTotalRakes() {
        return totalRakes;
    }

    public void setTotalRakes(long totalRakes) {
        this.totalRakes = totalRakes;
    }


    public long getFormedRakes() {
        return formedRakes;
    }

    public void setFormedRakes(long formedRakes) {
        this.formedRakes = formedRakes;
    }


    public long getDispatchedRakes() {
        return dispatchedRakes;
    }

    public void setDispatchedRakes(long dispatchedRakes) {
        this.dispatchedRakes = dispatchedRakes;
    }


    public long getArrivedRakes() {
        return arrivedRakes;
    }

    public void setArrivedRakes(long arrivedRakes) {
        this.arrivedRakes = arrivedRakes;
    }


    public long getTotalConsignments() {
        return totalConsignments;
    }

    public void setTotalConsignments(long totalConsignments) {
        this.totalConsignments = totalConsignments;
    }


    public long getTotalMovements() {
        return totalMovements;
    }

    public void setTotalMovements(long totalMovements) {
        this.totalMovements = totalMovements;
    }

    public long getLoadedDemandsAwaitingRake() {
        return loadedDemandsAwaitingRake;
    }

    public void setLoadedDemandsAwaitingRake(
            long loadedDemandsAwaitingRake) {
        this.loadedDemandsAwaitingRake =
                loadedDemandsAwaitingRake;
    }

    public long getArrivedRakesAwaitingUnloading() {
        return arrivedRakesAwaitingUnloading;
    }

    public void setArrivedRakesAwaitingUnloading(
            long arrivedRakesAwaitingUnloading) {
        this.arrivedRakesAwaitingUnloading =
                arrivedRakesAwaitingUnloading;
    }

    public long getAttentionTotal() {
        return attentionTotal;
    }

    public void setAttentionTotal(
            long attentionTotal) {
        this.attentionTotal = attentionTotal;
    }
}