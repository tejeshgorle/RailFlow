export interface DashboardResponse {

  // Wagon statistics
  totalWagons: number;
  availableWagons: number;
  allocatedWagons: number;
  loadedWagons: number;
  emptyWagons: number;

  // Demand statistics
  totalDemands: number;
  registeredDemands: number;
  approvedDemands: number;
  allocatedDemands: number;
  loadedDemands: number;
  deliveredDemands: number;

  // Rake statistics
  totalRakes: number;
  formedRakes: number;
  dispatchedRakes: number;
  arrivedRakes: number;

  // Other operations
  totalConsignments: number;
  totalMovements: number;

  // Operational attention
  loadedDemandsAwaitingRake: number;
  arrivedRakesAwaitingUnloading: number;
  attentionTotal: number;
}