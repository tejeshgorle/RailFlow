package com.railway.wagonmanagement.service;

import com.railway.wagonmanagement.dto.DashboardResponse;
import com.railway.wagonmanagement.model.Consignment;
import com.railway.wagonmanagement.model.Demand;
import com.railway.wagonmanagement.model.DemandStatus;
import com.railway.wagonmanagement.model.Rake;
import com.railway.wagonmanagement.model.RakeStatus;
import com.railway.wagonmanagement.model.Unloading;
import com.railway.wagonmanagement.model.Wagon;
import com.railway.wagonmanagement.model.WagonStatus;
import com.railway.wagonmanagement.repository.ConsignmentRepository;
import com.railway.wagonmanagement.repository.DemandRepository;
import com.railway.wagonmanagement.repository.MovementRepository;
import com.railway.wagonmanagement.repository.RakeRepository;
import com.railway.wagonmanagement.repository.UnloadingRepository;
import com.railway.wagonmanagement.repository.WagonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class DashboardService {

    private final WagonRepository wagonRepository;
    private final DemandRepository demandRepository;
    private final ConsignmentRepository consignmentRepository;
    private final RakeRepository rakeRepository;
    private final MovementRepository movementRepository;
    private final UnloadingRepository unloadingRepository;

    public DashboardService(
            WagonRepository wagonRepository,
            DemandRepository demandRepository,
            ConsignmentRepository consignmentRepository,
            RakeRepository rakeRepository,
            MovementRepository movementRepository,
            UnloadingRepository unloadingRepository
    ) {
        this.wagonRepository = wagonRepository;
        this.demandRepository = demandRepository;
        this.consignmentRepository = consignmentRepository;
        this.rakeRepository = rakeRepository;
        this.movementRepository = movementRepository;
        this.unloadingRepository = unloadingRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {

        DashboardResponse response = new DashboardResponse();

        // WAGON STATISTICS
        List<Wagon> wagons = wagonRepository.findAll();

        response.setTotalWagons(wagons.size());
        response.setAvailableWagons(
                wagons.stream()
                        .filter(wagon -> wagon.getStatus() == WagonStatus.AVAILABLE)
                        .count()
        );
        response.setAllocatedWagons(
                wagons.stream()
                        .filter(wagon -> wagon.getStatus() == WagonStatus.ALLOCATED)
                        .count()
        );
        response.setLoadedWagons(
                wagons.stream()
                        .filter(wagon -> wagon.getStatus() == WagonStatus.LOADED)
                        .count()
        );
        response.setEmptyWagons(
                wagons.stream()
                        .filter(wagon -> wagon.getStatus() == WagonStatus.EMPTY)
                        .count()
        );

        // DEMAND STATISTICS
        List<Demand> demands = demandRepository.findAll();

        response.setTotalDemands(demands.size());
        response.setRegisteredDemands(
                demands.stream()
                        .filter(demand -> demand.getStatus() == DemandStatus.REGISTERED)
                        .count()
        );
        response.setApprovedDemands(
                demands.stream()
                        .filter(demand -> demand.getStatus() == DemandStatus.APPROVED)
                        .count()
        );
        response.setAllocatedDemands(
                demands.stream()
                        .filter(demand -> demand.getStatus() == DemandStatus.WAGONS_ALLOCATED)
                        .count()
        );
        response.setLoadedDemands(
                demands.stream()
                        .filter(demand -> demand.getStatus() == DemandStatus.LOADED)
                        .count()
        );
        response.setDeliveredDemands(
                demands.stream()
                        .filter(demand -> demand.getStatus() == DemandStatus.DELIVERED)
                        .count()
        );

        // RAKE STATISTICS
        List<Rake> rakes = rakeRepository.findAll();

        response.setTotalRakes(rakes.size());
        response.setFormedRakes(
                rakes.stream()
                        .filter(rake -> rake.getStatus() == RakeStatus.FORMED)
                        .count()
        );
        response.setDispatchedRakes(
                rakes.stream()
                        .filter(rake -> rake.getStatus() == RakeStatus.DISPATCHED)
                        .count()
        );
        response.setArrivedRakes(
                rakes.stream()
                        .filter(rake -> rake.getStatus() == RakeStatus.ARRIVED)
                        .count()
        );

        // OTHER OPERATION STATISTICS
        response.setTotalConsignments(consignmentRepository.count());
        response.setTotalMovements(movementRepository.count());

        // OPERATIONAL ATTENTION
        List<Consignment> consignments = consignmentRepository.findAll();
        List<Unloading> unloadings = unloadingRepository.findAll();

        // Loaded demands with a consignment not yet assigned to a rake.
        long loadedDemandsAwaitingRake = demands.stream()
                .filter(demand -> demand.getStatus() == DemandStatus.LOADED)
                .filter(demand -> consignments.stream()
                        .filter(consignment -> consignment.getDemand() != null)
                        .filter(consignment -> Objects.equals(
                                consignment.getDemand().getDemandId(),
                                demand.getDemandId()
                        ))
                        .anyMatch(consignment -> rakes.stream()
                                .noneMatch(rake -> rake.getConsignment() != null
                                        && Objects.equals(
                                                rake.getConsignment().getConsignmentId(),
                                                consignment.getConsignmentId()
                                        )
                                )
                        )
                )
                .count();

        // Arrived rakes with at least one wagon not yet recorded as unloaded.
        long arrivedRakesAwaitingUnloading = rakes.stream()
                .filter(rake -> rake.getStatus() == RakeStatus.ARRIVED)
                .filter(rake -> {
                    if (rake.getConsignment() == null || rake.getWagonCount() == null) {
                        return false;
                    }

                    long unloadedCount = unloadings.stream()
                            .filter(unloading -> unloading.getConsignment() != null)
                            .filter(unloading -> Objects.equals(
                                    unloading.getConsignment().getConsignmentId(),
                                    rake.getConsignment().getConsignmentId()
                            ))
                            .count();

                    return unloadedCount < rake.getWagonCount();
                })
                .count();

        long attentionTotal =
                response.getRegisteredDemands()
                        + response.getApprovedDemands()
                        + response.getAllocatedDemands()
                        + loadedDemandsAwaitingRake
                        + response.getFormedRakes()
                        + response.getDispatchedRakes()
                        + arrivedRakesAwaitingUnloading;

        response.setLoadedDemandsAwaitingRake(loadedDemandsAwaitingRake);
        response.setArrivedRakesAwaitingUnloading(arrivedRakesAwaitingUnloading);
        response.setAttentionTotal(attentionTotal);

        return response;
    }
}
