import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import {
  Wagon,
  WagonService
} from '../../wagons/wagon.service';

import {
  Consignment,
  ConsignmentService
} from '../../consignments/consignment.service';

import {
  LucideArrowRight,
  LucideCheck,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClipboardList,
  LucidePackageCheck,
  LucidePackageMinus,
  LucideTrainFront
} from '@lucide/angular';

import {
  AllocationService,
  CreateAllocationRequest,
  WagonAllocation
} from '../allocation.service';


@Component({
  selector: 'app-add-allocation',
  imports: [
    FormsModule,

    LucideArrowRight,
    LucideCheck,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideClipboardList,
    LucidePackageCheck,
    LucidePackageMinus,
    LucideTrainFront
  ],
  templateUrl: './add-allocation.html',
  styleUrl: './add-allocation.css'
})
export class AddAllocation implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  wagons = signal<Wagon[]>([]);

  consignments = signal<Consignment[]>([]);

  allocations = signal<WagonAllocation[]>([]);


  // =====================================================
  // UI STATE
  // =====================================================

  loading = signal(true);

  submitting = signal(false);

  message = '';

  errorMessage = '';


  // =====================================================
  // SELECTION
  // =====================================================

  selectedWagonId: number | null = null;

  selectedConsignmentId: number | null = null;


  // =====================================================
  // OPTIONAL DEMAND CONTEXT
  // =====================================================

  demandId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private allocationService: AllocationService,
    private wagonService: WagonService,
    private consignmentService: ConsignmentService,
    private route: ActivatedRoute
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      const demandParam =
        params.get('demandId');

      this.demandId =
        demandParam
          ? Number(demandParam)
          : null;

      console.log(
        'Allocation demand context:',
        this.demandId
      );

      this.refresh();

    });

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loading.set(true);

    this.message = '';

    this.errorMessage = '';

    this.loadConsignments();

  }


  // =====================================================
  // LOAD CONSIGNMENTS
  // =====================================================

  loadConsignments(): void {

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data) => {

          console.log(
            'Consignments received:',
            data
          );


          /*
           * Only consignments whose demand is
           * currently APPROVED can enter
           * wagon allocation.
           */
          let approvedConsignments =
            data.filter(consignment =>
              consignment.demand?.status === 'APPROVED'
            );


          /*
           * If this screen was opened from
           * Demand Details, restrict the list
           * to that demand.
           */
          if (this.demandId !== null) {

            approvedConsignments =
              approvedConsignments.filter(
                consignment =>
                  consignment.demand?.demandId === this.demandId
              );

          }


          this.consignments.set(
            approvedConsignments
          );


          /*
           * If the previously selected consignment
           * no longer exists, clear the selection.
           */
          const selectedStillExists =
            approvedConsignments.some(
              consignment =>
                consignment.consignmentId ===
                this.selectedConsignmentId
            );


          if (!selectedStillExists) {

            this.selectedConsignmentId = null;

            this.selectedWagonId = null;

          }


          /*
           * If exactly one consignment is available,
           * select it automatically.
           */
          if (
            this.selectedConsignmentId === null &&
            approvedConsignments.length === 1
          ) {

            this.selectedConsignmentId =
              approvedConsignments[0].consignmentId;

          }


          this.loadAllocations();

        },

        error: (error) => {

          console.error(
            'Error loading consignments:',
            error
          );

          this.errorMessage =
            'Unable to load consignments.';

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // LOAD ALLOCATION HISTORY
  // =====================================================

  loadAllocations(): void {

    this.allocationService
      .getAllAllocations()
      .subscribe({

        next: (data) => {

          console.log(
            'Allocations received:',
            data
          );

          this.allocations.set(data);

          this.loadWagons();

        },

        error: (error) => {

          console.error(
            'Error loading allocations:',
            error
          );

          this.errorMessage =
            'Unable to load allocation records.';

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // LOAD SUITABLE WAGONS
  // =====================================================

  loadWagons(): void {

    /*
     * No consignment selected.
     * Therefore there is no origin station
     * against which wagons can be filtered.
     */
    if (
      this.selectedConsignmentId === null
    ) {

      this.wagons.set([]);

      this.selectedWagonId = null;

      this.loading.set(false);

      return;

    }


    const consignment =
      this.getSelectedConsignment();


    if (!consignment) {

      this.wagons.set([]);

      this.selectedWagonId = null;

      this.loading.set(false);

      return;

    }


    const originStationId =
      consignment.fromStation?.stationId;


    if (!originStationId) {

      this.wagons.set([]);

      this.selectedWagonId = null;

      this.loading.set(false);

      return;

    }


    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (data) => {

          console.log(
            'Wagons received:',
            data
          );


          /*
           * Only AVAILABLE wagons can be allocated.
           *
           * They must also be physically present
           * at the consignment's originating station.
           */
          const availableWagons =
            data.filter(wagon =>

              wagon.status === 'AVAILABLE' &&

              wagon.station?.stationId ===
                originStationId

            );


          /*
           * Remove wagons that already have an
           * allocation for this consignment.
           *
           * This is mainly a UI safeguard.
           * Backend validation remains authoritative.
           */
          const allocatedWagonIds =
            this.allocations()
              .filter(allocation =>
                allocation.consignment?.consignmentId ===
                this.selectedConsignmentId
              )
              .map(allocation =>
                allocation.wagon.wagonId
              );


          const suitableWagons =
            availableWagons.filter(wagon =>
              !allocatedWagonIds.includes(
                wagon.wagonId
              )
            );


          this.wagons.set(
            suitableWagons
          );


          /*
           * If selected wagon is no longer available,
           * clear the selection.
           */
          const selectedStillAvailable =
            suitableWagons.some(
              wagon =>
                wagon.wagonId ===
                this.selectedWagonId
            );


          if (!selectedStillAvailable) {

            this.selectedWagonId = null;

          }


          /*
           * If there is exactly one suitable wagon,
           * select it automatically.
           */
          if (
            this.selectedWagonId === null &&
            suitableWagons.length === 1
          ) {

            this.selectedWagonId =
              suitableWagons[0].wagonId;

          }


          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading wagons:',
            error
          );

          this.errorMessage =
            'Unable to load wagons.';

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // CONSIGNMENT CHANGE
  // =====================================================

  onConsignmentChange(): void {

    this.message = '';

    this.errorMessage = '';

    this.selectedWagonId = null;

    this.loadWagons();

  }


  // =====================================================
  // SELECTED CONSIGNMENT
  // =====================================================

  getSelectedConsignment(): Consignment | null {

    if (
      this.selectedConsignmentId === null
    ) {

      return null;

    }


    return (
      this.consignments()
        .find(consignment =>
          consignment.consignmentId ===
          this.selectedConsignmentId
        ) ?? null
    );

  }


  // =====================================================
  // REQUIRED WAGONS
  // =====================================================

  getRequiredWagons(): number {

    const consignment =
      this.getSelectedConsignment();


    return (
      consignment?.demand?.requiredWagons ?? 0
    );

  }


  // =====================================================
  // ALLOCATED COUNT
  // =====================================================

  getAllocatedCount(): number {

    if (
      this.selectedConsignmentId === null
    ) {

      return 0;

    }


    return this.allocations()
      .filter(allocation =>
        allocation.consignment?.consignmentId ===
        this.selectedConsignmentId
      )
      .length;

  }


  // =====================================================
  // REMAINING WAGONS
  // =====================================================

  getRemainingWagons(): number {

    const required =
      this.getRequiredWagons();

    const allocated =
      this.getAllocatedCount();


    return Math.max(
      required - allocated,
      0
    );

  }


  // =====================================================
  // ALLOCATION PERCENTAGE
  // =====================================================

  getAllocationPercentage(): number {

    const required =
      this.getRequiredWagons();


    if (required <= 0) {

      return 0;

    }


    const allocated =
      this.getAllocatedCount();


    return Math.min(
      Math.round(
        (allocated / required) * 100
      ),
      100
    );

  }


  // =====================================================
  // ALLOCATION COMPLETE
  // =====================================================

  isAllocationComplete(): boolean {

    const required =
      this.getRequiredWagons();


    if (required <= 0) {

      return false;

    }


    return (
      this.getAllocatedCount() >=
      required
    );

  }


  // =====================================================
  // ALLOCATE WAGON
  // =====================================================

  allocateWagon(): void {

    this.message = '';

    this.errorMessage = '';


    if (
      this.selectedWagonId === null ||
      this.selectedConsignmentId === null
    ) {

      this.errorMessage =
        'Please select a consignment and wagon.';

      return;

    }


    if (this.isAllocationComplete()) {

      this.errorMessage =
        'All required wagons have already been allocated.';

      return;

    }


    const request: CreateAllocationRequest = {

      wagonId:
        this.selectedWagonId,

      consignmentId:
        this.selectedConsignmentId

    };


    console.log(
      'Creating allocation:',
      request
    );


    this.submitting.set(true);


    this.allocationService
      .allocateWagon(request)
      .subscribe({

        next: (createdAllocation) => {

          console.log(
            'Wagon allocated:',
            createdAllocation
          );


          this.message =
            `Wagon ${createdAllocation.wagon.wagonNumber} ` +
            `allocated successfully.`;


          this.selectedWagonId = null;


          this.submitting.set(false);


          /*
           * Reload everything because:
           *
           * 1. Wagon status changes AVAILABLE → ALLOCATED
           * 2. Allocation history increases
           * 3. Demand may change to WAGONS_ALLOCATED
           * 4. Remaining wagon count changes
           */
          this.refresh();

        },


        error: (error) => {

          console.error(
            'Error allocating wagon:',
            error
          );


          this.submitting.set(false);


          if (
            error.error?.message
          ) {

            this.errorMessage =
              error.error.message;

          } else if (
            typeof error.error === 'string' &&
            error.error
          ) {

            this.errorMessage =
              error.error;

          } else {

            this.errorMessage =
              'Unable to allocate wagon.';

          }

        }

      });

  }

}