import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucidePackage,
  LucideTrainFront
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
  UnloadingService,
  CreateUnloadingRequest
} from '../unloading.service';

@Component({
  selector: 'app-add-unloading',
  imports: [
    FormsModule,
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucidePackage,
    LucideTrainFront
  ],
  templateUrl: './add-unloading.html',
  styleUrl: './add-unloading.css'
})
export class AddUnloading implements OnInit {

  // -------------------------------------------------
  // DATA
  // -------------------------------------------------

  wagons = signal<Wagon[]>([]);

  consignments = signal<Consignment[]>([]);

  loading = signal(true);

  submitting = signal(false);

  // -------------------------------------------------
  // FORM
  // -------------------------------------------------

  selectedWagonId: number | null = null;

  selectedConsignmentId: number | null = null;

  unloadedQuantity: number | null = null;

  // -------------------------------------------------
  // MESSAGES
  // -------------------------------------------------

  message = '';

  errorMessage = '';

  constructor(
    private wagonService: WagonService,
    private consignmentService: ConsignmentService,
    private unloadingService: UnloadingService
  ) {}

  ngOnInit(): void {

    this.loadData();

  }

  // -------------------------------------------------
  // LOAD DATA
  // -------------------------------------------------

  loadData(): void {

    this.loading.set(true);

    this.errorMessage = '';

    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (wagons) => {

          /*
           * Only LOADED wagons can be unloaded.
           */
          const loadedWagons =
            wagons.filter(
              wagon => wagon.status === 'LOADED'
            );

          console.log(
            'Loaded wagons available for unloading:',
            loadedWagons.length
          );

          this.wagons.set(
            loadedWagons
          );

          this.loadConsignments();

        },

        error: (error) => {

          console.error(
            'Error loading wagons:',
            error
          );

          this.errorMessage =
            'Unable to load wagon information.';

          this.loading.set(false);

        }

      });

  }

  // -------------------------------------------------
  // LOAD CONSIGNMENTS
  // -------------------------------------------------

  loadConsignments(): void {

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data) => {

          console.log(
            'Consignments received:',
            data.length
          );

          this.consignments.set(data);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading consignments:',
            error
          );

          this.errorMessage =
            'Unable to load consignment information.';

          this.loading.set(false);

        }

      });

  }

  // -------------------------------------------------
  // SELECTED WAGON
  // -------------------------------------------------

  getSelectedWagon(): Wagon | null {

    const wagonId =
      this.selectedWagonId;

    if (wagonId === null) {

      return null;

    }

    return this.wagons().find(
      wagon =>
        wagon.wagonId === wagonId
    ) ?? null;

  }

  // -------------------------------------------------
  // SELECTED CONSIGNMENT
  // -------------------------------------------------

  getSelectedConsignment(): Consignment | null {

    const consignmentId =
      this.selectedConsignmentId;

    if (consignmentId === null) {

      return null;

    }

    return this.consignments().find(
      consignment =>
        consignment.consignmentId === consignmentId
    ) ?? null;

  }

  // -------------------------------------------------
  // WAGON CHANGE
  // -------------------------------------------------

  onWagonChange(): void {

    this.message = '';

    this.errorMessage = '';

    console.log(
      'Selected wagon:',
      this.getSelectedWagon()
    );

  }

  // -------------------------------------------------
  // CONSIGNMENT CHANGE
  // -------------------------------------------------

  onConsignmentChange(): void {

    this.message = '';

    this.errorMessage = '';

    console.log(
      'Selected consignment:',
      this.getSelectedConsignment()
    );

  }

  // -------------------------------------------------
  // UNLOAD WAGON
  // -------------------------------------------------

  unloadWagon(): void {

    this.message = '';

    this.errorMessage = '';

    // -----------------------------------------------
    // Validate wagon
    // -----------------------------------------------

    if (
      this.selectedWagonId === null ||
      this.selectedWagonId <= 0
    ) {

      this.errorMessage =
        'Please select a wagon.';

      return;

    }

    // -----------------------------------------------
    // Validate consignment
    // -----------------------------------------------

    if (
      this.selectedConsignmentId === null ||
      this.selectedConsignmentId <= 0
    ) {

      this.errorMessage =
        'Please select a consignment.';

      return;

    }

    // -----------------------------------------------
    // Validate quantity
    // -----------------------------------------------

    if (
      this.unloadedQuantity === null ||
      this.unloadedQuantity <= 0
    ) {

      this.errorMessage =
        'Unloaded quantity must be greater than zero.';

      return;

    }

    // -----------------------------------------------
    // Prepare request
    // -----------------------------------------------

    const request: CreateUnloadingRequest = {

      wagonId:
        this.selectedWagonId,

      consignmentId:
        this.selectedConsignmentId,

      unloadedQuantity:
        this.unloadedQuantity

    };

    console.log(
      'Unloading request:',
      request
    );

    this.submitting.set(true);

    // -----------------------------------------------
    // API CALL
    // -----------------------------------------------

    this.unloadingService
      .unloadWagon(request)
      .subscribe({

        next: (unloading) => {

          console.log(
            'Wagon unloaded successfully:',
            unloading
          );

          this.message =
            `Wagon ${unloading.wagon.wagonNumber} ` +
            `unloaded successfully.`;

          // Clear form

          this.selectedWagonId = null;

          this.selectedConsignmentId = null;

          this.unloadedQuantity = null;

          this.submitting.set(false);

          // Refresh available wagons

          this.loadData();

        },

        error: (error) => {

          console.error(
            'Error unloading wagon:',
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
              'Unable to unload wagon.';

          }

        }

      });

  }

}
