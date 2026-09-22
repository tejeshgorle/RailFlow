package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Unloading;
import com.railway.wagonmanagement.model.Wagon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UnloadingRepository
        extends JpaRepository<Unloading, Long> {

    boolean existsByWagonAndConsignment(
            Wagon wagon,
            Consignment consignment);

    long countByConsignment(
            Consignment consignment);

    @Query("""
           SELECT COALESCE(SUM(u.unloadedQuantity), 0)
           FROM Unloading u
           WHERE u.consignment = :consignment
           """)
    Double sumUnloadedQuantity(
            @Param("consignment") Consignment consignment);
}