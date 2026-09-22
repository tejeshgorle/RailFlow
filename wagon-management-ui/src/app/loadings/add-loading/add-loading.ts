import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck
} from '@lucide/angular';

import {
  Wagon,
  WagonService
} from '../../wagons/wagon.service';

import {
  Consignment,
  ConsignmentService
} from '../../consignments/consignment.service';

import {
  AllocationService
} from '../../allocations/allocation.service';

import {
  CreateLoadingRequest,
  LoadingService,
  Loading
} from '../loading.service';


@Component({
  selector: 'app-add-loading',
  imports: [
    FormsModule,
    DecimalPipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck
  ],
  templateUrl: './add-loading.html',
  styleUrl: './add-loading.css'
})
export class AddLoading implements OnInit {

  /* =====================================================
     DATA
  ===================================================== */

  wagons = signal<Wagon[]>([]);
  consignments = signal<Consignment[]>([]);
  loadings = signal<Loading[]>([]);

  demandId: number | null = null;

  wagonId: number | null = null;
  consignmentId: number | null = null;
  loadedQuantity: number | null = null;

  loading = signal(false);
  progressLoading = signal(false);

  message = '';
  errorMessage = '';


  /* =====================================================
     CONSTRUCTOR
  ===================================================== */

  constructor(
    private wagonService: WagonService,
    private consignmentService: ConsignmentService,
    private allocationService: AllocationService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  /* =====================================================
     INITIALIZATION
  ===================================================== */

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {

      const id = Number(
        params.get('demandId')
      );

      this.demandId =
        id > 0 ? id : null;

      console.log(
        'Loading screen opened for demand:',
        this.demandId
      );

      this.loadConsignments();
    });
  }


  /* =====================================================
     CONSIGNMENTS
  ===================================================== */

  loadConsignments(): void {

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data) => {

          if (this.demandId !== null) {

            const filteredConsignments =
              data.filter(
                consignment =>
                  consignment.demand?.demandId ===
                  this.demandId
              );

            this.consignments.set(
              filteredConsignments
            );

            if (
              filteredConsignments.length === 1
            ) {

              this.consignmentId =
                filteredConsignments[0]
                  .consignmentId;

              this.loadLoadingProgress();
              this.loadWagons();

            } else {

              this.consignmentId = null;
              this.wagonId = null;

              this.wagons.set([]);
              this.loadings.set([]);
            }

          } else {

            this.consignments.set(data);

            this.loadWagons();

          }
        },

        error: (error) => {

          console.error(
            'Error loading consignments:',
            error
          );

          this.errorMessage =
            'Unable to load consignments.';
        }
      });
  }


  /* =====================================================
     LOADING HISTORY / PROGRESS
  ===================================================== */

  loadLoadingProgress(): void {

    if (this.consignmentId === null) {

      this.loadings.set([]);

      return;
    }

    this.progressLoading.set(true);

    this.loadingService
      .getAllLoadings()
      .subscribe({

        next: (data) => {

          const relevantLoadings =
            data.filter(
              loading =>
                loading.consignment?.consignmentId ===
                this.consignmentId
            );

          this.loadings.set(
            relevantLoadings
          );

          this.progressLoading.set(false);

          console.log(
            'Loading history for consignment:',
            relevantLoadings
          );
        },

        error: (error) => {

          console.error(
            'Error loading loading history:',
            error
          );

          this.loadings.set([]);

          this.progressLoading.set(false);
        }
      });
  }


  getLoadedQuantity(): number {

    return this.loadings().reduce(
      (total, loading) =>
        total + (loading.loadedQuantity || 0),
      0
    );
  }


  getRequiredQuantity(): number {

    const consignment =
      this.getSelectedConsignment();

    return consignment?.quantity || 0;
  }


  getRemainingQuantity(): number {

    return Math.max(
      0,
      this.getRequiredQuantity() -
      this.getLoadedQuantity()
    );
  }


  getLoadingPercentage(): number {

    const required =
      this.getRequiredQuantity();

    if (
      required <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      (this.getLoadedQuantity() / required) * 100
    );
  }


  getLoadedWagonCount(): number {

    return this.loadings().length;
  }


  isLoadingComplete(): boolean {

    const required =
      this.getRequiredQuantity();

    return (
      required > 0 &&
      this.getLoadedQuantity() >= required
    );
  }


  /* =====================================================
     WAGONS
  ===================================================== */

  loadWagons(): void {

    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (data) => {

          const allocatedWagons =
            data.filter(
              wagon =>
                wagon.status === 'ALLOCATED'
            );

          if (this.consignmentId === null) {

            this.wagons.set(
              allocatedWagons
            );

            return;
          }

          this.allocationService
            .getAllAllocations()
            .subscribe({

              next: (allocations) => {

                const relevantAllocations =
                  allocations.filter(
                    allocation =>
                      allocation.consignment
                        ?.consignmentId ===
                        this.consignmentId &&
                      allocation.wagon?.status ===
                        'ALLOCATED'
                  );

                const allocatedWagonIds =
                  new Set(
                    relevantAllocations.map(
                      allocation =>
                        allocation.wagon.wagonId
                    )
                  );

                const relevantWagons =
                  allocatedWagons.filter(
                    wagon =>
                      allocatedWagonIds.has(
                        wagon.wagonId
                      )
                  );

                this.wagons.set(
                  relevantWagons
                );

                if (
                  relevantWagons.length === 1
                ) {

                  this.wagonId =
                    relevantWagons[0].wagonId;

                } else if (
                  this.wagonId !== null &&
                  !relevantWagons.some(
                    wagon =>
                      wagon.wagonId ===
                      this.wagonId
                  )
                ) {

                  this.wagonId = null;
                }

              },

              error: (error) => {

                console.error(
                  'Error loading allocations:',
                  error
                );

                this.errorMessage =
                  'Unable to load wagon allocation information.';
              }
            });
        },

        error: (error) => {

          console.error(
            'Error loading wagons:',
            error
          );

          this.errorMessage =
            'Unable to load wagons.';
        }
      });
  }


  /* =====================================================
     SELECTION HELPERS
  ===================================================== */

  getSelectedWagon(): Wagon | null {

    if (this.wagonId === null) {
      return null;
    }

    return this.wagons().find(
      wagon =>
        wagon.wagonId ===
        this.wagonId
    ) ?? null;
  }


  getSelectedConsignment(): Consignment | null {

    if (this.consignmentId === null) {
      return null;
    }

    return this.consignments().find(
      consignment =>
        consignment.consignmentId ===
        this.consignmentId
    ) ?? null;
  }


  getCapacityPercentage(): number {

    const wagon =
      this.getSelectedWagon();

    if (
      !wagon ||
      !wagon.capacity ||
      this.loadedQuantity === null ||
      this.loadedQuantity <= 0
    ) {

      return 0;
    }

    return Math.min(
      100,
      (this.loadedQuantity / wagon.capacity) * 100
    );
  }


  /* =====================================================
     CONSIGNMENT CHANGE
  ===================================================== */

  onConsignmentChange(): void {

    this.wagonId = null;
    this.loadedQuantity = null;

    this.message = '';
    this.errorMessage = '';

    this.loadLoadingProgress();
    this.loadWagons();
  }


  /* =====================================================
     REFRESH AVAILABILITY
  ===================================================== */

  refreshAvailability(): void {

    this.message = '';
    this.errorMessage = '';

    this.loadLoadingProgress();
    this.loadWagons();
  }


  /* =====================================================
     RETURN TO DEMAND
  ===================================================== */

  backToDemand(): void {

    if (this.demandId !== null) {

      this.router.navigate(
        ['/demands', this.demandId]
      );

      return;
    }

    this.router.navigate(['/demands']);
  }


  /* =====================================================
     SUBMIT LOADING
  ===================================================== */

  submitLoading(): void {

    this.message = '';
    this.errorMessage = '';

    if (
      this.wagonId === null ||
      this.consignmentId === null ||
      this.loadedQuantity === null
    ) {

      this.errorMessage =
        'Please complete all loading fields.';

      return;
    }

    if (
      this.loadedQuantity <= 0
    ) {

      this.errorMessage =
        'Loaded quantity must be greater than zero.';

      return;
    }

    const selectedWagon =
      this.getSelectedWagon();

    if (
      !selectedWagon
    ) {

      this.errorMessage =
        'Please select a valid allocated wagon.';

      return;
    }

    if (
      !selectedWagon.capacity ||
      selectedWagon.capacity <= 0
    ) {

      this.errorMessage =
        'Selected wagon has an invalid capacity.';

      return;
    }

    if (
      this.loadedQuantity >
      selectedWagon.capacity
    ) {

      this.errorMessage =
        `Loaded quantity cannot exceed wagon capacity of ${selectedWagon.capacity} tons.`;

      return;
    }

    const remainingQuantity =
      this.getRemainingQuantity();

    if (
      remainingQuantity > 0 &&
      this.loadedQuantity >
      remainingQuantity
    ) {

      this.errorMessage =
        `Loaded quantity cannot exceed the remaining consignment quantity of ${remainingQuantity} tons.`;

      return;
    }

    if (
      this.isLoadingComplete()
    ) {

      this.errorMessage =
        'This consignment has already reached its required loading quantity.';

      return;
    }

    const request: CreateLoadingRequest = {

      wagonId:
        this.wagonId,

      consignmentId:
        this.consignmentId,

      loadedQuantity:
        this.loadedQuantity
    };

    console.log(
      'Creating loading:',
      request
    );

    this.loading.set(true);

    this.loadingService
      .loadWagon(request)
      .subscribe({

        next: (savedLoading) => {

          this.message =
            `Wagon ${savedLoading.wagon.wagonNumber} loaded successfully.`;

          this.wagonId = null;
          this.loadedQuantity = null;

          this.loading.set(false);

          this.loadLoadingProgress();
          this.loadWagons();
        },

        error: (error) => {

          console.error(
            'Error loading wagon:',
            error
          );

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
              'Unable to load wagon.';
          }

          this.loading.set(false);
        }
      });
  }
}
