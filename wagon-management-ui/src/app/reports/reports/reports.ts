import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LucideRefreshCw,
  LucideDownload,
  LucideSearch,
  LucideTrainFront,
  LucidePackageCheck,
  LucidePackagePlus,
  LucideFileText,
  LucideArrowLeftRight
} from '@lucide/angular';

import { WagonService } from '../../wagons/wagon.service';
import type { Wagon } from '../../wagons/wagon.service';

import { ConsignmentService } from '../../consignments/consignment.service';
import type { Consignment } from '../../consignments/consignment.service';

import { AllocationService } from '../../allocations/allocation.service';
import type { WagonAllocation } from '../../allocations/allocation.service';

import { LoadingService } from '../../loadings/loading.service';
import type { Loading } from '../../loadings/loading.service';

import { RakeService } from '../../rakes/rake.service';
import type { Rake } from '../../rakes/rake.service';

import { MovementService } from '../../movements/movement.service';
import type { Movement } from '../../movements/movement.service';

import { UnloadingService } from '../../unloadings/unloading.service';
import type { Unloading } from '../../unloadings/unloading.service';

import { DemandService } from '../../demands/demand.service';
import type { Demand } from '../../demands/demand.service';

type ReportType =
  | 'WAGONS'
  | 'CONSIGNMENTS'
  | 'ALLOCATIONS'
  | 'LOADINGS'
  | 'RAKES'
  | 'MOVEMENTS'
  | 'UNLOADINGS'
  | 'DEMANDS'
  | 'MIS_SUMMARY';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideRefreshCw,
    LucideDownload,
    LucideSearch,
    LucideTrainFront,
    LucidePackageCheck,
    LucidePackagePlus,
    LucideFileText,
    LucideArrowLeftRight
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  // =====================================================
  // REPORT SELECTION
  // =====================================================

  selectedReport: ReportType = 'WAGONS';

  setReport(report: ReportType): void {
    this.selectedReport = report;
  }


  // =====================================================
  // WAGON REPORT DATA AND STATE
  // =====================================================

  wagons: Wagon[] = [];

  wagonLoading = false;
  wagonErrorMessage = '';

  searchTerm = '';
  selectedStatus = 'ALL';

  statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Loaded', value: 'LOADED' },
    { label: 'Allocated', value: 'ALLOCATED' },
    { label: 'In Transit', value: 'IN_TRANSIT' },
    { label: 'Under Maintenance', value: 'UNDER_MAINTENANCE' }
  ];


  // =====================================================
  // CONSIGNMENT REPORT DATA AND STATE
  // =====================================================

  consignments: Consignment[] = [];

  consignmentLoading = false;
  consignmentErrorMessage = '';

  consignmentSearchTerm = '';
  selectedOrigin = 'ALL';
  selectedDestination = 'ALL';


  // =====================================================
  // ALLOCATION REPORT DATA AND STATE
  // =====================================================

  allocations: WagonAllocation[] = [];

  allocationLoading = false;
  allocationErrorMessage = '';

  allocationSearchTerm = '';
  selectedAllocationStatus = 'ALL';
  selectedAllocationCommodity = 'ALL';


  // =====================================================
  // LOADING REPORT DATA AND STATE
  // =====================================================

  loadings: Loading[] = [];

  loadingLoading = false;
  loadingErrorMessage = '';

  loadingSearchTerm = '';
  selectedLoadingStatus = 'ALL';
  selectedLoadingCommodity = 'ALL';

    // =====================================================
    // RAKE FORMATION REPORT DATA AND STATE
    // =====================================================

    rakes: Rake[] = [];

    rakeLoading = false;
    rakeErrorMessage = '';

    rakeSearchTerm = '';
    selectedRakeStatus = 'ALL';
    selectedRakeCommodity = 'ALL';

      // =====================================================
      // MOVEMENT HISTORY REPORT DATA AND STATE
      // =====================================================

      movements: Movement[] = [];

      movementLoading = false;
      movementErrorMessage = '';

      movementSearchTerm = '';
      selectedMovementOrigin = 'ALL';
      selectedMovementDestination = 'ALL';

      // =====================================================
      // UNLOADING REPORT DATA AND STATE
      // =====================================================

      unloadings: Unloading[] = [];

      unloadingLoading = false;
      unloadingErrorMessage = '';

      unloadingSearchTerm = '';
      selectedUnloadingStatus = 'ALL';
      selectedUnloadingCommodity = 'ALL';

      // =====================================================
      // DEMAND REPORT DATA AND STATE
      // =====================================================

      demands: Demand[] = [];

      demandLoading = false;
      demandErrorMessage = '';

      demandSearchTerm = '';
      selectedDemandStatus = 'ALL';
      selectedDemandOrigin = 'ALL';
      selectedDemandDestination = 'ALL';

  // =====================================================
  // CONSTRUCTOR AND INITIAL LOAD
  // =====================================================

    constructor(
    private wagonService: WagonService,
    private consignmentService: ConsignmentService,
    private allocationService: AllocationService,
    private loadingService: LoadingService,
    private rakeService: RakeService,
    private movementService: MovementService,
    private unloadingService: UnloadingService,
    private demandService: DemandService,
    private cdr: ChangeDetectorRef
  ) {}


    ngOnInit(): void {
    this.loadWagons();
    this.loadConsignments();
    this.loadAllocations();
    this.loadLoadings();
    this.loadRakes();
    this.loadMovements();
    this.loadUnloadings();
    this.loadDemands();
  }


  // =====================================================
  // WAGON REPORT
  // =====================================================

  loadWagons(): void {
    this.wagonLoading = true;
    this.wagonErrorMessage = '';

    this.wagonService.getAllWagons().subscribe({
      next: (data: Wagon[]) => {
        this.wagons = data ?? [];
        this.wagonLoading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.wagonErrorMessage =
          'Unable to load wagon report. Please try again.';

        this.wagonLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  get filteredWagons(): Wagon[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.wagons.filter(wagon => {

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        wagon.status === this.selectedStatus;

      const matchesSearch =
        !search ||
        (wagon.wagonNumber ?? '')
          .toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }


  get availableCount(): number {
    return this.wagons.filter(
      wagon => wagon.status === 'AVAILABLE'
    ).length;
  }


  get loadedCount(): number {
    return this.wagons.filter(
      wagon => wagon.status === 'LOADED'
    ).length;
  }


  get otherCount(): number {
    return this.wagons.length -
      this.availableCount -
      this.loadedCount;
  }


  // =====================================================
  // CONSIGNMENT REPORT
  // =====================================================

  loadConsignments(): void {
    this.consignmentLoading = true;
    this.consignmentErrorMessage = '';

    this.consignmentService.getAllConsignments().subscribe({
      next: (data: Consignment[]) => {
        this.consignments = data ?? [];
        this.consignmentLoading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.consignmentErrorMessage =
          'Unable to load consignment report. Please try again.';

        this.consignmentLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  get filteredConsignments(): Consignment[] {
    const search =
      this.consignmentSearchTerm.trim().toLowerCase();

    return this.consignments.filter(item => {

      const matchesSearch =
        !search ||
        String(item.consignmentId).includes(search) ||
        (item.commodity ?? '')
          .toLowerCase()
          .includes(search) ||
        (item.consignor?.customerName ?? '')
          .toLowerCase()
          .includes(search) ||
        (item.consignee?.customerName ?? '')
          .toLowerCase()
          .includes(search);

      const matchesOrigin =
        this.selectedOrigin === 'ALL' ||
        item.fromStation?.stationCode === this.selectedOrigin;

      const matchesDestination =
        this.selectedDestination === 'ALL' ||
        item.toStation?.stationCode === this.selectedDestination;

      return matchesSearch &&
        matchesOrigin &&
        matchesDestination;
    });
  }


  get totalConsignmentQuantity(): number {
    return this.consignments.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    );
  }


  get commodityTypeCount(): number {
    return new Set(
      this.consignments
        .map(item => item.commodity)
        .filter(Boolean)
    ).size;
  }


  get linkedDemandCount(): number {
    return this.consignments.filter(
      item => item.demand != null
    ).length;
  }


  get originStations(): string[] {
    return [
      ...new Set(
        this.consignments
          .map(item => item.fromStation?.stationCode)
          .filter(
            (code): code is string => Boolean(code)
          )
      )
    ].sort();
  }


  get destinationStations(): string[] {
    return [
      ...new Set(
        this.consignments
          .map(item => item.toStation?.stationCode)
          .filter(
            (code): code is string => Boolean(code)
          )
      )
    ].sort();
  }


  // =====================================================
  // ALLOCATION REPORT
  // =====================================================

  loadAllocations(): void {
    this.allocationLoading = true;
    this.allocationErrorMessage = '';

    this.allocationService.getAllAllocations().subscribe({
      next: (data: WagonAllocation[]) => {
        this.allocations = data ?? [];
        this.allocationLoading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.allocationErrorMessage =
          'Unable to load allocation report. Please try again.';

        this.allocationLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  get filteredAllocations(): WagonAllocation[] {
    const search =
      this.allocationSearchTerm.trim().toLowerCase();

    return this.allocations.filter(allocation => {

      const wagonNumber =
        allocation.wagon?.wagonNumber ?? '';

      const consignmentId =
        String(
          allocation.consignment?.consignmentId ?? ''
        );

      const commodity =
        allocation.consignment?.commodity ?? '';

      const allocationId =
        String(allocation.allocationId ?? '');

      const matchesSearch =
        !search ||
        allocationId.toLowerCase().includes(search) ||
        wagonNumber.toLowerCase().includes(search) ||
        consignmentId.toLowerCase().includes(search) ||
        commodity.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedAllocationStatus === 'ALL' ||
        allocation.allocationStatus ===
          this.selectedAllocationStatus;

      const matchesCommodity =
        this.selectedAllocationCommodity === 'ALL' ||
        commodity === this.selectedAllocationCommodity;

      return matchesSearch &&
        matchesStatus &&
        matchesCommodity;
    });
  }


  get allocationStatuses(): string[] {
    return [
      ...new Set(
        this.allocations
          .map(item => item.allocationStatus)
          .filter(
            (status): status is string => Boolean(status)
          )
      )
    ].sort();
  }


  get allocationCommodities(): string[] {
    return [
      ...new Set(
        this.allocations
          .map(item => item.consignment?.commodity)
          .filter(
            (commodity): commodity is string =>
              Boolean(commodity)
          )
      )
    ].sort();
  }


  get allocatedWagonCount(): number {
    return this.allocations.filter(
      item => item.allocationStatus === 'ALLOCATED'
    ).length;
  }


  get loadedAllocationCount(): number {
    return this.allocations.filter(
      item => item.wagon?.status === 'LOADED'
    ).length;
  }


  get distinctAllocatedConsignmentCount(): number {
    return new Set(
      this.allocations
        .map(item => item.consignment?.consignmentId)
        .filter(
          (id): id is number => id != null
        )
    ).size;
  }


  // =====================================================
  // LOADING REPORT
  // =====================================================

  loadLoadings(): void {
    this.loadingLoading = true;
    this.loadingErrorMessage = '';

    this.loadingService.getAllLoadings().subscribe({
      next: (data: Loading[]) => {
        this.loadings = data ?? [];
        this.loadingLoading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.loadingErrorMessage =
          'Unable to load loading report. Please try again.';

        this.loadingLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  get filteredLoadings(): Loading[] {
    const search =
      this.loadingSearchTerm.trim().toLowerCase();

    return this.loadings.filter(item => {

      const loadingId =
        String(item.loadingId ?? '');

      const wagonNumber =
        item.wagon?.wagonNumber ?? '';

      const consignmentId =
        String(item.consignment?.consignmentId ?? '');

      const commodity =
        item.consignment?.commodity ?? '';

      const matchesSearch =
        !search ||
        loadingId.toLowerCase().includes(search) ||
        wagonNumber.toLowerCase().includes(search) ||
        consignmentId.toLowerCase().includes(search) ||
        commodity.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedLoadingStatus === 'ALL' ||
        item.loadingStatus ===
          this.selectedLoadingStatus;

      const matchesCommodity =
        this.selectedLoadingCommodity === 'ALL' ||
        commodity === this.selectedLoadingCommodity;

      return matchesSearch &&
        matchesStatus &&
        matchesCommodity;
    });
  }


  get loadingStatuses(): string[] {
    return [
      ...new Set(
        this.loadings
          .map(item => item.loadingStatus)
          .filter(
            (status): status is string => Boolean(status)
          )
      )
    ].sort();
  }


  get loadingCommodities(): string[] {
    return [
      ...new Set(
        this.loadings
          .map(item => item.consignment?.commodity)
          .filter(
            (commodity): commodity is string =>
              Boolean(commodity)
          )
      )
    ].sort();
  }


  get totalLoadedQuantity(): number {
    return this.loadings.reduce(
      (total, item) =>
        total + (item.loadedQuantity || 0),
      0
    );
  }


  get loadedWagonCountFromLoading(): number {
    return new Set(
      this.loadings
        .filter(item => item.loadingStatus === 'LOADED')
        .map(item => item.wagon?.wagonId)
        .filter(
          (id): id is number => id != null
        )
    ).size;
  }


  get distinctLoadingConsignmentCount(): number {
    return new Set(
      this.loadings
        .map(item => item.consignment?.consignmentId)
        .filter(
          (id): id is number => id != null
        )
    ).size;
  }


    // =====================================================
    // RAKE FORMATION REPORT
    // =====================================================

    loadRakes(): void {
      this.rakeLoading = true;
      this.rakeErrorMessage = '';

      this.rakeService.getAllRakes().subscribe({
        next: (data: Rake[]) => {
          this.rakes = data ?? [];
          this.rakeLoading = false;
          this.cdr.markForCheck();
        },

        error: () => {
          this.rakeErrorMessage =
            'Unable to load rake formation report. Please try again.';

          this.rakeLoading = false;
          this.cdr.markForCheck();
        }
      });
    }


    get filteredRakes(): Rake[] {
      const search =
        this.rakeSearchTerm.trim().toLowerCase();

      return this.rakes.filter(rake => {

        const rakeId =
          String(rake.rakeId ?? '');

        const rakeNumber =
          rake.rakeNumber ?? '';

        const consignmentId =
          String(
            rake.consignment?.consignmentId ?? ''
          );

        const commodity =
          rake.consignment?.commodity ?? '';

        const matchesSearch =
          !search ||
          rakeId.toLowerCase().includes(search) ||
          rakeNumber.toLowerCase().includes(search) ||
          consignmentId.toLowerCase().includes(search) ||
          commodity.toLowerCase().includes(search) ||
          (rake.fromStation?.stationName ?? '')
            .toLowerCase()
            .includes(search) ||
          (rake.toStation?.stationName ?? '')
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          this.selectedRakeStatus === 'ALL' ||
          rake.status === this.selectedRakeStatus;

        const matchesCommodity =
          this.selectedRakeCommodity === 'ALL' ||
          commodity === this.selectedRakeCommodity;

        return matchesSearch &&
          matchesStatus &&
          matchesCommodity;
      });
    }


    get rakeStatuses(): string[] {
      return [
        ...new Set(
          this.rakes
            .map(rake => rake.status)
            .filter(
              (status): status is string => Boolean(status)
            )
        )
      ].sort();
    }


    get rakeCommodities(): string[] {
      return [
        ...new Set(
          this.rakes
            .map(rake => rake.consignment?.commodity)
            .filter(
              (commodity): commodity is string =>
                Boolean(commodity)
            )
        )
      ].sort();
    }


    get formedRakeCount(): number {
      return this.rakes.filter(
        rake => rake.status === 'FORMED'
      ).length;
    }


    get dispatchedRakeCount(): number {
      return this.rakes.filter(
        rake => rake.status === 'DISPATCHED'
      ).length;
    }


    get arrivedRakeCount(): number {
      return this.rakes.filter(
        rake => rake.status === 'ARRIVED'
      ).length;
    }


    get totalRakeWagonCount(): number {
      return this.rakes.reduce(
        (total, rake) =>
          total + (rake.wagonCount || 0),
        0
      );
    }

    // =====================================================
    // MOVEMENT HISTORY REPORT
    // =====================================================

    loadMovements(): void {
      this.movementLoading = true;
      this.movementErrorMessage = '';

      this.movementService.getAllMovements().subscribe({
        next: (data: Movement[]) => {

          const sortedMovements = [...(data ?? [])].sort(
            (a, b) =>
              new Date(b.movementTime).getTime() -
              new Date(a.movementTime).getTime()
          );

          this.movements = sortedMovements;

          this.movementLoading = false;
          this.cdr.markForCheck();
        },

        error: () => {
          this.movementErrorMessage =
            'Unable to load movement history report. Please try again.';

          this.movementLoading = false;
          this.cdr.markForCheck();
        }
      });
    }


    get filteredMovements(): Movement[] {

      const search =
        this.movementSearchTerm.trim().toLowerCase();

      return this.movements.filter(movement => {

        const movementId =
          String(movement.movementId ?? '');

        const wagonNumber =
          movement.wagon?.wagonNumber ?? '';

        const fromStationCode =
          movement.fromStation?.stationCode ?? '';

        const fromStationName =
          movement.fromStation?.stationName ?? '';

        const toStationCode =
          movement.toStation?.stationCode ?? '';

        const toStationName =
          movement.toStation?.stationName ?? '';

        const matchesSearch =
          !search ||
          movementId.toLowerCase().includes(search) ||
          wagonNumber.toLowerCase().includes(search) ||
          fromStationCode.toLowerCase().includes(search) ||
          fromStationName.toLowerCase().includes(search) ||
          toStationCode.toLowerCase().includes(search) ||
          toStationName.toLowerCase().includes(search);

        const matchesOrigin =
          this.selectedMovementOrigin === 'ALL' ||
          fromStationCode === this.selectedMovementOrigin;

        const matchesDestination =
          this.selectedMovementDestination === 'ALL' ||
          toStationCode === this.selectedMovementDestination;

        return (
          matchesSearch &&
          matchesOrigin &&
          matchesDestination
        );
      });
    }


    get movementOrigins(): string[] {

      return [
        ...new Set(
          this.movements
            .map(movement =>
              movement.fromStation?.stationCode
            )
            .filter(
              (code): code is string =>
                Boolean(code)
            )
        )
      ].sort();
    }


    get movementDestinations(): string[] {

      return [
        ...new Set(
          this.movements
            .map(movement =>
              movement.toStation?.stationCode
            )
            .filter(
              (code): code is string =>
                Boolean(code)
            )
        )
      ].sort();
    }


    get todayMovementCount(): number {

      const today = new Date();

      return this.movements.filter(movement => {

        const movementDate =
          new Date(movement.movementTime);

        return (
          movementDate.getFullYear() ===
            today.getFullYear() &&

          movementDate.getMonth() ===
            today.getMonth() &&

          movementDate.getDate() ===
            today.getDate()
        );

      }).length;
    }


    get movementOriginStationCount(): number {

      return new Set(
        this.movements
          .map(movement =>
            movement.fromStation?.stationCode
          )
          .filter(Boolean)
      ).size;
    }


    get movementDestinationStationCount(): number {

      return new Set(
        this.movements
          .map(movement =>
            movement.toStation?.stationCode
          )
          .filter(Boolean)
      ).size;
    }


    exportMovementsToCsv(): void {

      const headers = [
        'Movement ID',
        'Wagon Number',
        'Wagon Type',
        'From Station',
        'From Code',
        'To Station',
        'To Code',
        'Movement Time'
      ];

      const rows = this.filteredMovements.map(
        movement => [

          movement.movementId,

          movement.wagon?.wagonNumber ?? '',

          movement.wagon?.wagonType ?? '',

          movement.fromStation?.stationName ??
            'Not Assigned',

          movement.fromStation?.stationCode ?? '',

          movement.toStation?.stationName ??
            'Not Assigned',

          movement.toStation?.stationCode ?? '',

          movement.movementTime ?? ''
        ]
      );

      this.downloadCsv(
        headers,
        rows,
        'movement-history-report'
      );
    }


    // =====================================================
    // UNLOADING REPORT
    // =====================================================

    loadUnloadings(): void {

      this.unloadingLoading = true;
      this.unloadingErrorMessage = '';

      this.unloadingService.getAllUnloadings().subscribe({

        next: (data: Unloading[]) => {

          const sortedUnloadings = [...(data ?? [])].sort(
            (a, b) =>
              new Date(b.unloadingTime).getTime() -
              new Date(a.unloadingTime).getTime()
          );

          this.unloadings = sortedUnloadings;

          this.unloadingLoading = false;
          this.cdr.markForCheck();
        },

        error: () => {

          this.unloadingErrorMessage =
            'Unable to load unloading report. Please try again.';

          this.unloadingLoading = false;
          this.cdr.markForCheck();
        }
      });
    }


    get filteredUnloadings(): Unloading[] {

      const search =
        this.unloadingSearchTerm.trim().toLowerCase();

      return this.unloadings.filter(item => {

        const unloadingId =
          String(item.unloadingId ?? '');

        const wagonNumber =
          item.wagon?.wagonNumber ?? '';

        const consignmentId =
          String(item.consignment?.consignmentId ?? '');

        const commodity =
          item.consignment?.commodity ?? '';

        const matchesSearch =
          !search ||
          unloadingId.toLowerCase().includes(search) ||
          wagonNumber.toLowerCase().includes(search) ||
          consignmentId.toLowerCase().includes(search) ||
          commodity.toLowerCase().includes(search);

        const matchesStatus =
          this.selectedUnloadingStatus === 'ALL' ||
          item.unloadingStatus ===
            this.selectedUnloadingStatus;

        const matchesCommodity =
          this.selectedUnloadingCommodity === 'ALL' ||
          commodity === this.selectedUnloadingCommodity;

        return matchesSearch &&
          matchesStatus &&
          matchesCommodity;
      });
    }


    get unloadingStatuses(): string[] {

      return [
        ...new Set(
          this.unloadings
            .map(item => item.unloadingStatus)
            .filter(
              (status): status is string =>
                Boolean(status)
            )
        )
      ].sort();
    }


    get unloadingCommodities(): string[] {

      return [
        ...new Set(
          this.unloadings
            .map(item => item.consignment?.commodity)
            .filter(
              (commodity): commodity is string =>
                Boolean(commodity)
            )
        )
      ].sort();
    }


    get totalUnloadedQuantity(): number {

      return this.unloadings.reduce(
        (total, item) =>
          total + (item.unloadedQuantity || 0),
        0
      );
    }


    get unloadedWagonCount(): number {

      return new Set(
        this.unloadings
          .map(item => item.wagon?.wagonId)
          .filter(
            (id): id is number => id != null
          )
      ).size;
    }


    get distinctUnloadingConsignmentCount(): number {

      return new Set(
        this.unloadings
          .map(item => item.consignment?.consignmentId)
          .filter(
            (id): id is number => id != null
          )
      ).size;
    }


  // =====================================================
  // DEMAND REPORT
  // =====================================================

  loadDemands(): void {

    this.demandLoading = true;
    this.demandErrorMessage = '';

    this.demandService.getAllDemands().subscribe({

      next: (data: Demand[]) => {

        const sortedDemands = [...(data ?? [])].sort(
          (a, b) =>
            new Date(b.demandDate).getTime() -
            new Date(a.demandDate).getTime()
        );

        this.demands = sortedDemands;

        this.demandLoading = false;
        this.cdr.markForCheck();
      },

      error: () => {

        this.demandErrorMessage =
          'Unable to load demand report. Please try again.';

        this.demandLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  get filteredDemands(): Demand[] {

    const search =
      this.demandSearchTerm.trim().toLowerCase();

    return this.demands.filter(demand => {

      const demandId =
        String(demand.demandId ?? '');

      const customerName =
        demand.customer?.customerName ?? '';

      const commodity =
        demand.commodity ?? '';

      const fromStationCode =
        demand.fromStation?.stationCode ?? '';

      const fromStationName =
        demand.fromStation?.stationName ?? '';

      const toStationCode =
        demand.toStation?.stationCode ?? '';

      const toStationName =
        demand.toStation?.stationName ?? '';

      const matchesSearch =
        !search ||
        demandId.toLowerCase().includes(search) ||
        customerName.toLowerCase().includes(search) ||
        commodity.toLowerCase().includes(search) ||
        fromStationCode.toLowerCase().includes(search) ||
        fromStationName.toLowerCase().includes(search) ||
        toStationCode.toLowerCase().includes(search) ||
        toStationName.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedDemandStatus === 'ALL' ||
        demand.status === this.selectedDemandStatus;

      const matchesOrigin =
        this.selectedDemandOrigin === 'ALL' ||
        fromStationCode === this.selectedDemandOrigin;

      const matchesDestination =
        this.selectedDemandDestination === 'ALL' ||
        toStationCode === this.selectedDemandDestination;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesOrigin &&
        matchesDestination
      );
    });
  }


  get demandStatuses(): string[] {

    return [
      ...new Set(
        this.demands
          .map(demand => demand.status)
          .filter(
            (status): status is string =>
              Boolean(status)
          )
      )
    ].sort();
  }


  get demandOrigins(): string[] {

    return [
      ...new Set(
        this.demands
          .map(demand => demand.fromStation?.stationCode)
          .filter(
            (code): code is string =>
              Boolean(code)
          )
      )
    ].sort();
  }


  get demandDestinations(): string[] {

    return [
      ...new Set(
        this.demands
          .map(demand => demand.toStation?.stationCode)
          .filter(
            (code): code is string =>
              Boolean(code)
          )
      )
    ].sort();
  }


  get registeredDemandCount(): number {

    return this.demands.filter(
      demand => demand.status === 'REGISTERED'
    ).length;
  }


  get approvedDemandCount(): number {

    return this.demands.filter(
      demand => demand.status === 'APPROVED'
    ).length;
  }


  get totalRequiredWagons(): number {

    return this.demands.reduce(
      (total, demand) =>
        total + (demand.requiredWagons || 0),
      0
    );
  }


  exportDemandsToCsv(): void {

    const headers = [
      'Demand ID',
      'Demand Date',
      'Customer',
      'Commodity',
      'Quantity',
      'Required Wagons',
      'Status',
      'Origin Station',
      'Origin Code',
      'Destination Station',
      'Destination Code'
    ];

    const rows = this.filteredDemands.map(demand => [

      demand.demandId,

      demand.demandDate ?? '',

      demand.customer?.customerName ?? 'Not Available',

      demand.commodity ?? '',

      demand.quantity ?? 0,

      demand.requiredWagons ?? 0,

      this.getStatusLabel(demand.status),

      demand.fromStation?.stationName ?? 'Not Assigned',

      demand.fromStation?.stationCode ?? '',

      demand.toStation?.stationName ?? 'Not Assigned',

      demand.toStation?.stationCode ?? ''
    ]);

    this.downloadCsv(
      headers,
      rows,
      'demand-report'
    );
  }

  // =====================================================
  // COMBINED MIS / OPERATIONS SUMMARY
  // =====================================================

  get misSummaryLoading(): boolean {
    return (
      this.wagonLoading ||
      this.consignmentLoading ||
      this.allocationLoading ||
      this.loadingLoading ||
      this.rakeLoading ||
      this.movementLoading ||
      this.unloadingLoading ||
      this.demandLoading
    );
  }


  refreshMisSummary(): void {
    this.loadWagons();
    this.loadConsignments();
    this.loadAllocations();
    this.loadLoadings();
    this.loadRakes();
    this.loadMovements();
    this.loadUnloadings();
    this.loadDemands();
  }


  get misDataErrorCount(): number {
    return [
      this.wagonErrorMessage,
      this.consignmentErrorMessage,
      this.allocationErrorMessage,
      this.loadingErrorMessage,
      this.rakeErrorMessage,
      this.movementErrorMessage,
      this.unloadingErrorMessage,
      this.demandErrorMessage
    ].filter(Boolean).length;
  }


  get allocatedWagonStatusCount(): number {
    return this.wagons.filter(
      wagon => wagon.status === 'ALLOCATED'
    ).length;
  }


  get inTransitWagonCount(): number {
    return this.wagons.filter(
      wagon => wagon.status === 'IN_TRANSIT'
    ).length;
  }


  get maintenanceWagonCount(): number {
    return this.wagons.filter(
      wagon => wagon.status === 'UNDER_MAINTENANCE'
    ).length;
  }


  get allocatedDemandCount(): number {
    return this.demands.filter(
      demand => demand.status === 'WAGONS_ALLOCATED'
    ).length;
  }


  get loadedDemandCount(): number {
    return this.demands.filter(
      demand => demand.status === 'LOADED'
    ).length;
  }


  get deliveredDemandCount(): number {
    return this.demands.filter(
      demand => demand.status === 'DELIVERED'
    ).length;
  }


  get totalDemandQuantity(): number {
    return this.demands.reduce(
      (total, demand) =>
        total + (demand.quantity || 0),
      0
    );
  }


  get todayMovementSummaryCount(): number {
    return this.todayMovementCount;
  }


  get misWorkflowStages(): {
    label: string;
    value: number;
    description: string;
  }[] {
    return [
      {
        label: 'Registered',
        value: this.registeredDemandCount,
        description: 'Demand records at registration stage'
      },
      {
        label: 'Approved',
        value: this.approvedDemandCount,
        description: 'Demand records approved for allocation'
      },
      {
        label: 'Wagons Allocated',
        value: this.allocatedDemandCount,
        description: 'Demand records with wagon allocation'
      },
      {
        label: 'Loaded',
        value: this.loadedDemandCount,
        description: 'Demand records with loading completed'
      },
      {
        label: 'Delivered',
        value: this.deliveredDemandCount,
        description: 'Demand records completed through delivery'
      }
    ];
  }


  get misRakeStages(): {
    label: string;
    value: number;
    description: string;
  }[] {
    return [
      {
        label: 'Formed',
        value: this.formedRakeCount,
        description: 'Rakes formed and awaiting dispatch'
      },
      {
        label: 'Dispatched',
        value: this.dispatchedRakeCount,
        description: 'Rakes currently in movement workflow'
      },
      {
        label: 'Arrived',
        value: this.arrivedRakeCount,
        description: 'Rakes arrived at destination workflow'
      }
    ];
  }


  getMisPercentage(
    value: number,
    total: number
  ): number {
    if (total <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((value / total) * 100)
    );
  }


  get recentMisMovements(): Movement[] {
    return this.movements.slice(0, 6);
  }


  exportMisSummaryToCsv(): void {
    const headers = [
      'Category',
      'Metric',
      'Value'
    ];

    const rows = [
      ['Fleet', 'Total Wagons', this.wagons.length],
      ['Fleet', 'Available Wagons', this.availableCount],
      ['Fleet', 'Allocated Wagons', this.allocatedWagonStatusCount],
      ['Fleet', 'Loaded Wagons', this.loadedCount],
      ['Fleet', 'In Transit Wagons', this.inTransitWagonCount],
      ['Fleet', 'Maintenance Wagons', this.maintenanceWagonCount],
      ['Freight', 'Total Demands', this.demands.length],
      ['Freight', 'Registered Demands', this.registeredDemandCount],
      ['Freight', 'Approved Demands', this.approvedDemandCount],
      ['Freight', 'Allocated Demands', this.allocatedDemandCount],
      ['Freight', 'Loaded Demands', this.loadedDemandCount],
      ['Freight', 'Delivered Demands', this.deliveredDemandCount],
      ['Freight', 'Total Consignments', this.consignments.length],
      ['Freight', 'Demand Quantity', this.totalDemandQuantity],
      ['Loading', 'Loaded Quantity', this.totalLoadedQuantity],
      ['Unloading', 'Unloaded Quantity', this.totalUnloadedQuantity],
      ['Rakes', 'Total Rakes', this.rakes.length],
      ['Rakes', 'Formed Rakes', this.formedRakeCount],
      ['Rakes', 'Dispatched Rakes', this.dispatchedRakeCount],
      ['Rakes', 'Arrived Rakes', this.arrivedRakeCount],
      ['Rakes', 'Wagons in Rakes', this.totalRakeWagonCount],
      ['Movement', 'Total Movements', this.movements.length],
      ['Movement', "Today's Movements", this.todayMovementSummaryCount],
      ['Movement', 'Origin Stations', this.movementOriginStationCount],
      ['Movement', 'Destination Stations', this.movementDestinationStationCount],
      ['Unloading', 'Unloading Records', this.unloadings.length]
    ];

    this.downloadCsv(
      headers,
      rows,
      'mis-operations-summary'
    );
  }


  // =====================================================
  // SHARED DISPLAY HELPERS
  // =====================================================

  getStatusClass(
    status: string | null | undefined
  ): string {

    return (status ?? 'unknown')
      .toLowerCase()
      .replaceAll('_', '-');
  }


  getStatusLabel(
    status: string | null | undefined
  ): string {

    if (!status) {
      return 'Unknown';
    }

    return status
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        character => character.toUpperCase()
      );
  }


  // =====================================================
  // CSV EXPORT
  // =====================================================

  exportWagonsToCsv(): void {

    const headers = [
      'Wagon Number',
      'Wagon Type',
      'Capacity (tonnes)',
      'Status',
      'Current Station',
      'Station Code',
      'Zone',
      'Division'
    ];

    const rows = this.filteredWagons.map(wagon => [
      wagon.wagonNumber,
      wagon.wagonType,
      wagon.capacity,
      this.getStatusLabel(wagon.status),
      wagon.station?.stationName ?? 'Not Assigned',
      wagon.station?.stationCode ?? '',
      wagon.station?.zone ?? '',
      wagon.station?.division ?? ''
    ]);

    this.downloadCsv(
      headers,
      rows,
      'wagon-status-report'
    );
  }


  exportConsignmentsToCsv(): void {

    const headers = [
      'Consignment ID',
      'Commodity',
      'Quantity',
      'Consignor',
      'Consignee',
      'Origin Station',
      'Origin Code',
      'Destination Station',
      'Destination Code',
      'Demand ID',
      'Demand Status'
    ];

    const rows = this.filteredConsignments.map(item => [
      item.consignmentId,
      item.commodity ?? '',
      item.quantity ?? 0,
      item.consignor?.customerName ?? 'Not Available',
      item.consignee?.customerName ?? 'Not Available',
      item.fromStation?.stationName ?? 'Not Assigned',
      item.fromStation?.stationCode ?? '',
      item.toStation?.stationName ?? 'Not Assigned',
      item.toStation?.stationCode ?? '',
      item.demand?.demandId ?? '',
      item.demand
        ? this.getStatusLabel(item.demand.status)
        : 'No Linked Demand'
    ]);

    this.downloadCsv(
      headers,
      rows,
      'consignment-report'
    );
  }


  exportAllocationsToCsv(): void {

    const headers = [
      'Allocation ID',
      'Allocated At',
      'Allocation Status',
      'Wagon Number',
      'Wagon Type',
      'Wagon Capacity',
      'Wagon Status',
      'Wagon Current Station',
      'Consignment ID',
      'Commodity',
      'Quantity',
      'Origin Station',
      'Origin Code',
      'Destination Station',
      'Destination Code'
    ];

    const rows = this.filteredAllocations.map(item => [
      item.allocationId,
      item.allocatedAt ?? '',
      this.getStatusLabel(item.allocationStatus),
      item.wagon?.wagonNumber ?? '',
      item.wagon?.wagonType ?? '',
      item.wagon?.capacity ?? '',
      this.getStatusLabel(item.wagon?.status),
      item.wagon?.station?.stationName ?? 'Not Assigned',
      item.consignment?.consignmentId ?? '',
      item.consignment?.commodity ?? '',
      item.consignment?.quantity ?? 0,
      item.consignment?.fromStation?.stationName ?? 'Not Assigned',
      item.consignment?.fromStation?.stationCode ?? '',
      item.consignment?.toStation?.stationName ?? 'Not Assigned',
      item.consignment?.toStation?.stationCode ?? ''
    ]);

    this.downloadCsv(
      headers,
      rows,
      'wagon-allocation-report'
    );
  }


  exportLoadingsToCsv(): void {

    const headers = [
      'Loading ID',
      'Loading Time',
      'Loading Status',
      'Wagon Number',
      'Wagon Type',
      'Wagon Capacity',
      'Wagon Status',
      'Wagon Current Station',
      'Consignment ID',
      'Commodity',
      'Consignment Quantity',
      'Loaded Quantity',
      'Origin Station',
      'Origin Code',
      'Destination Station',
      'Destination Code'
    ];

    const rows = this.filteredLoadings.map(item => [
      item.loadingId,
      item.loadingTime ?? '',
      this.getStatusLabel(item.loadingStatus),
      item.wagon?.wagonNumber ?? '',
      item.wagon?.wagonType ?? '',
      item.wagon?.capacity ?? '',
      this.getStatusLabel(item.wagon?.status),
      item.wagon?.station?.stationName ?? 'Not Assigned',
      item.consignment?.consignmentId ?? '',
      item.consignment?.commodity ?? '',
      item.consignment?.quantity ?? 0,
      item.loadedQuantity ?? 0,
      item.consignment?.fromStation?.stationName ?? 'Not Assigned',
      item.consignment?.fromStation?.stationCode ?? '',
      item.consignment?.toStation?.stationName ?? 'Not Assigned',
      item.consignment?.toStation?.stationCode ?? ''
    ]);

    this.downloadCsv(
      headers,
      rows,
      'wagon-loading-report'
    );
  }


    exportRakesToCsv(): void {

      const headers = [
        'Rake ID',
        'Rake Number',
        'Formation Time',
        'Dispatch Time',
        'Status',
        'Wagon Count',
        'Consignment ID',
        'Commodity',
        'Quantity',
        'Origin Station',
        'Origin Code',
        'Destination Station',
        'Destination Code'
      ];

      const rows = this.filteredRakes.map(rake => [
        rake.rakeId,
        rake.rakeNumber ?? '',
        rake.formationTime ?? '',
        rake.dispatchTime ?? '',
        this.getStatusLabel(rake.status),
        rake.wagonCount ?? 0,
        rake.consignment?.consignmentId ?? '',
        rake.consignment?.commodity ?? '',
        rake.consignment?.quantity ?? 0,
        rake.fromStation?.stationName ?? 'Not Assigned',
        rake.fromStation?.stationCode ?? '',
        rake.toStation?.stationName ?? 'Not Assigned',
        rake.toStation?.stationCode ?? ''
      ]);

      this.downloadCsv(
        headers,
        rows,
        'rake-formation-report'
      );
    }


    exportUnloadingsToCsv(): void {

      const headers = [
        'Unloading ID',
        'Unloading Time',
        'Unloading Status',
        'Wagon Number',
        'Wagon Type',
        'Wagon Capacity',
        'Wagon Status',
        'Consignment ID',
        'Commodity',
        'Consignment Quantity',
        'Unloaded Quantity'
      ];

      const rows = this.filteredUnloadings.map(item => [
        item.unloadingId,
        item.unloadingTime ?? '',
        this.getStatusLabel(item.unloadingStatus),
        item.wagon?.wagonNumber ?? '',
        item.wagon?.wagonType ?? '',
        item.wagon?.capacity ?? '',
        this.getStatusLabel(item.wagon?.status),
        item.consignment?.consignmentId ?? '',
        item.consignment?.commodity ?? '',
        item.consignment?.quantity ?? 0,
        item.unloadedQuantity ?? 0
      ]);

      this.downloadCsv(
        headers,
        rows,
        'wagon-unloading-report'
      );
    }

  private downloadCsv(
    headers: string[],
    rows: (string | number)[][],
    filename: string
  ): void {

    const quote = (
      value: string | number
    ): string => {

      return `"${String(value ?? '')
        .replaceAll('"', '""')}"`;
    };

    const csv = [
      headers.map(quote).join(','),
      ...rows.map(
        row => row.map(quote).join(',')
      )
    ].join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csv],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;

    link.download =
      `${filename}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}