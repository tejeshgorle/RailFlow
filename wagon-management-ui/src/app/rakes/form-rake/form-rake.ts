import { Component, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClipboardList,
  LucideClock3
} from '@lucide/angular';




import {
  Consignment,
  ConsignmentService
} from '../../consignments/consignment.service';

import {
  Loading,
  LoadingService
} from '../../loadings/loading.service';

import {
  RakeService,
  CreateRakeRequest
} from '../rake.service';

@Component({
  selector: 'app-form-rake',
  imports: [
    FormsModule,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideClipboardList,
    LucideClock3
  ],
  templateUrl: './form-rake.html',
  styleUrl: './form-rake.css'
})
export class FormRake implements OnInit {

  /* =====================================================
     DATA
  ===================================================== */

  consignments = signal<Consignment[]>([]);
  loadings = signal<Loading[]>([]);

  loading = signal(true);
  forming = signal(false);

  demandId: number | null = null;
  selectedConsignmentId: number | null = null;

  rakeNumber = '';

  message = '';
  errorMessage = '';


  /* =====================================================
     CONSTRUCTOR
  ===================================================== */

  constructor(
    private consignmentService: ConsignmentService,
    private loadingService: LoadingService,
    private rakeService: RakeService,
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
        'Rake formation opened for demand:',
        this.demandId
      );

      this.loadConsignments();
    });
  }


  /* =====================================================
     LOAD ELIGIBLE CONSIGNMENTS
  ===================================================== */

  loadConsignments(): void {

    this.loading.set(true);
    this.errorMessage = '';

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data) => {

          const loadedConsignments =
            data.filter(
              consignment =>
                consignment.demand?.status === 'LOADED' &&
                (
                  this.demandId === null ||
                  consignment.demand?.demandId ===
                    this.demandId
                )
            );

          this.consignments.set(
            loadedConsignments
          );

          if (
            loadedConsignments.length === 1
          ) {

            this.selectedConsignmentId =
              loadedConsignments[0].consignmentId;

            this.loadLoadingHistory();

          } else {

            this.selectedConsignmentId = null;
            this.loadings.set([]);
          }

          this.loading.set(false);

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


  /* =====================================================
     SELECTED CONSIGNMENT
  ===================================================== */

  getSelectedConsignment(): Consignment | null {

    if (
      this.selectedConsignmentId === null
    ) {
      return null;
    }

    return this.consignments().find(
      consignment =>
        consignment.consignmentId ===
        this.selectedConsignmentId
    ) ?? null;
  }


  onConsignmentChange(): void {

    this.message = '';
    this.errorMessage = '';
    this.rakeNumber = '';

    this.loadLoadingHistory();
  }


  /* =====================================================
     LOADING HISTORY
  ===================================================== */

  loadLoadingHistory(): void {

    if (
      this.selectedConsignmentId === null
    ) {

      this.loadings.set([]);

      return;
    }

    this.loadingService
      .getAllLoadings()
      .subscribe({

        next: (data) => {

          const relevantLoadings =
            data.filter(
              loading =>
                loading.consignment?.consignmentId ===
                this.selectedConsignmentId
            );

          this.loadings.set(
            relevantLoadings
          );

        },

        error: (error) => {

          console.error(
            'Error loading loading history:',
            error
          );

          this.loadings.set([]);

        }
      });
  }


  /* =====================================================
     FORMATION METRICS
  ===================================================== */

  getRequiredWagons(): number {

    return this.getSelectedConsignment()
      ?.demand?.requiredWagons ?? 0;
  }


  getLoadedWagonCount(): number {

    return this.loadings().length;
  }


  getRequiredQuantity(): number {

    return this.getSelectedConsignment()
      ?.quantity ?? 0;
  }


  getLoadedQuantity(): number {

    return this.loadings().reduce(
      (total, loading) =>
        total + (loading.loadedQuantity || 0),
      0
    );
  }


  getWagonReadinessPercentage(): number {

    const required =
      this.getRequiredWagons();

    if (required <= 0) {
      return 0;
    }

    return Math.min(
      100,
      (this.getLoadedWagonCount() / required) * 100
    );
  }


  getQuantityPercentage(): number {

    const required =
      this.getRequiredQuantity();

    if (required <= 0) {
      return 0;
    }

    return Math.min(
      100,
      (this.getLoadedQuantity() / required) * 100
    );
  }


  isFormationReady(): boolean {

    const requiredWagons =
      this.getRequiredWagons();

    const requiredQuantity =
      this.getRequiredQuantity();

    return (
      requiredWagons > 0 &&
      this.getLoadedWagonCount() >= requiredWagons &&
      requiredQuantity > 0 &&
      this.getLoadedQuantity() >= requiredQuantity
    );
  }


  getRemainingWagons(): number {

    return Math.max(
      0,
      this.getRequiredWagons() -
      this.getLoadedWagonCount()
    );
  }


  getRemainingQuantity(): number {

    return Math.max(
      0,
      this.getRequiredQuantity() -
      this.getLoadedQuantity()
    );
  }


  /* =====================================================
     STATUS
  ===================================================== */

  getReadinessClass(): string {

    return this.isFormationReady()
      ? 'ready'
      : 'waiting';
  }


  getReadinessLabel(): string {

    return this.isFormationReady()
      ? 'READY FOR FORMATION'
      : 'WAITING FOR LOADING';
  }


  /* =====================================================
     FORM RAKE
  ===================================================== */

  formRake(): void {

    this.message = '';
    this.errorMessage = '';

    const consignment =
      this.getSelectedConsignment();

    if (!consignment) {

      this.errorMessage =
        'Please select a valid loaded consignment.';

      return;
    }

    const requiredWagons =
      this.getRequiredWagons();

    if (
      requiredWagons <= 0
    ) {

      this.errorMessage =
        'The consignment does not have a valid required wagon count.';

      return;
    }

    if (
      this.getLoadedWagonCount() <
      requiredWagons
    ) {

      this.errorMessage =
        `Rake formation requires ${requiredWagons} loaded wagons. ` +
        `${this.getRemainingWagons()} wagon(s) still required.`;

      return;
    }

    if (
      this.getLoadedQuantity() <
      this.getRequiredQuantity()
    ) {

      this.errorMessage =
        `Rake formation requires ${this.getRequiredQuantity()} tons loaded. ` +
        `${this.getRemainingQuantity()} tons still required.`;

      return;
    }

    const trimmedRakeNumber =
      this.rakeNumber.trim();

    if (!trimmedRakeNumber) {

      this.errorMessage =
        'Please enter a rake number.';

      return;
    }

    if (
      trimmedRakeNumber.length < 3 ||
      trimmedRakeNumber.length > 30
    ) {

      this.errorMessage =
        'Rake number must be between 3 and 30 characters.';

      return;
    }

    const request: CreateRakeRequest = {

      consignmentId:
        this.selectedConsignmentId!,

      rakeNumber:
        trimmedRakeNumber
    };

    console.log(
      'Forming rake:',
      request
    );

    this.forming.set(true);

    this.rakeService
      .formRake(request)
      .subscribe({

        next: (rake) => {

          console.log(
            'Rake formed successfully:',
            rake
          );

          this.message =
            `Rake ${rake.rakeNumber} formed successfully. ` +
            `Rake ID: ${rake.rakeId}`;

          this.forming.set(false);

          this.rakeNumber = '';

          this.loadConsignments();
        },

        error: (error) => {

          console.error(
            'Error forming rake:',
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
              'Unable to form rake.';
          }

          this.forming.set(false);
        }
      });
  }


  /* =====================================================
     NAVIGATION
  ===================================================== */

  backToDemand(): void {

    if (
      this.demandId !== null
    ) {

      this.router.navigate(
        ['/demands', this.demandId]
      );

      return;
    }

    this.router.navigate(
      ['/rakes']
    );
  }
}
