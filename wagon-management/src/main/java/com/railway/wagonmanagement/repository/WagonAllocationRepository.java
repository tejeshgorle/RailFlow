package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.AllocationStatus;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface WagonAllocationRepository
        extends JpaRepository<WagonAllocation, Long> {

        boolean existsByWagonAndAllocationStatus(
                Wagon wagon,
                AllocationStatus allocationStatus);

        long countByConsignmentAndAllocationStatus(
                Consignment consignment,
                AllocationStatus allocationStatus);

        boolean existsByWagonAndConsignmentAndAllocationStatus(
                Wagon wagon,
                Consignment consignment,
                AllocationStatus allocationStatus);

        List<WagonAllocation> findByWagonAndAllocationStatus(
                Wagon wagon,
                AllocationStatus allocationStatus);

        Optional<WagonAllocation> findByWagonAndConsignmentAndAllocationStatus(
                Wagon wagon,
                Consignment consignment,
                AllocationStatus allocationStatus);        
}