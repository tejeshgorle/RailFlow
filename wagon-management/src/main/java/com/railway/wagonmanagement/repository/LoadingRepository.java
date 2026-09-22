package com.railway.wagonmanagement.repository;

import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Loading;
import com.railway.wagonmanagement.model.LoadingStatus;
import com.railway.wagonmanagement.model.Wagon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoadingRepository
        extends JpaRepository<Loading, Long> {

    boolean existsByWagonAndConsignment(
            Wagon wagon,
            Consignment consignment);

    Optional<Loading> findByWagonAndConsignment(
            Wagon wagon,
            Consignment consignment);

    long countByConsignmentAndLoadingStatus(
            Consignment consignment,
            LoadingStatus loadingStatus);

    @Query("""
        SELECT COALESCE(SUM(l.loadedQuantity), 0)
        FROM Loading l
        WHERE l.consignment = :consignment
        AND l.loadingStatus = :loadingStatus
    """)
    Double sumLoadedQuantity(
            @Param("consignment") Consignment consignment,
            @Param("loadingStatus") LoadingStatus loadingStatus);

    @Query("""
        SELECT l.wagon
        FROM Loading l
        WHERE l.consignment = :consignment
        AND l.loadingStatus = :loadingStatus
        ORDER BY l.loadingId
    """)
    List<Wagon> findLoadedWagons(
            @Param("consignment") Consignment consignment,
            @Param("loadingStatus") LoadingStatus loadingStatus);
}