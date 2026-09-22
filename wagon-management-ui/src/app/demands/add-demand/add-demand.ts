import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  LucideArrowLeftRight,
  LucideArrowRight,
  LucideCircleCheck,
  LucideTriangleAlert
} from '@lucide/angular';

import {
  Customer,
  CustomerService
} from '../../customers/customer.service';

import {
  Station,
  StationService
} from '../../stations/station.service';

import {
  CreateDemandRequest,
  DemandService
} from '../demand.service';

@Component({
  selector: 'app-add-demand',
  imports: [
    FormsModule,
    LucideArrowLeftRight,
    LucideArrowRight,
    LucideCircleCheck,
    LucideTriangleAlert
  ],
  templateUrl: './add-demand.html',
  styleUrl: './add-demand.css'
})
export class AddDemand implements OnInit {

  customers = signal<Customer[]>([]);
  stations = signal<Station[]>([]);

  loading = signal(true);
  submitting = signal(false);

  customerId: number | null = null;
  commodity = '';
  quantity: number | null = null;
  requiredWagons: number | null = null;
  fromStationId: number | null = null;
  toStationId: number | null = null;

  message = '';
  errorMessage = '';

  constructor(
    private demandService: DemandService,
    private customerService: CustomerService,
    private stationService: StationService
  ) {}

  ngOnInit(): void {
    this.loadReferenceData();
  }

  // =====================================================
  // LOAD CUSTOMERS + STATIONS
  // =====================================================

  loadReferenceData(): void {

    this.loading.set(true);
    this.errorMessage = '';

    let customersLoaded = false;
    let stationsLoaded = false;

    this.customerService.getAllCustomers().subscribe({

      next: (data) => {

        console.log('Customers received:', data);

        this.customers.set(data);

        customersLoaded = true;

        if (customersLoaded && stationsLoaded) {
          this.loading.set(false);
        }
      },

      error: (error) => {

        console.error('Error loading customers:', error);

        this.errorMessage =
          'Unable to load customer information.';

        this.loading.set(false);
      }

    });

    this.stationService.getAllStations().subscribe({

      next: (data) => {

        console.log('Stations received:', data);

        this.stations.set(data);

        stationsLoaded = true;

        if (customersLoaded && stationsLoaded) {
          this.loading.set(false);
        }
      },

      error: (error) => {

        console.error('Error loading stations:', error);

        this.errorMessage =
          'Unable to load station information.';

        this.loading.set(false);
      }

    });
  }

  // =====================================================
  // REGISTER DEMAND
  // =====================================================

  addDemand(): void {

    this.message = '';
    this.errorMessage = '';

    // ---------------------------------------------
    // Required field validation
    // ---------------------------------------------

    if (
      this.customerId === null ||
      !this.commodity.trim() ||
      this.quantity === null ||
      this.requiredWagons === null ||
      this.fromStationId === null ||
      this.toStationId === null
    ) {

      this.errorMessage =
        'Please complete all required demand details.';

      return;
    }

    // ---------------------------------------------
    // Quantity validation
    // ---------------------------------------------

    if (this.quantity <= 0) {

      this.errorMessage =
        'Demand quantity must be greater than zero.';

      return;
    }

    // ---------------------------------------------
    // Wagon count validation
    // ---------------------------------------------

    if (this.requiredWagons <= 0) {

      this.errorMessage =
        'Required wagon count must be greater than zero.';

      return;
    }

    // ---------------------------------------------
    // Origin / destination validation
    // ---------------------------------------------

    if (this.fromStationId === this.toStationId) {

      this.errorMessage =
        'Origin and destination stations must be different.';

      return;
    }

    const demand: CreateDemandRequest = {

      customerId: this.customerId,

      commodity: this.commodity.trim(),

      quantity: this.quantity,

      requiredWagons: this.requiredWagons,

      fromStationId: this.fromStationId,

      toStationId: this.toStationId
    };

    console.log('Creating demand:', demand);

    this.submitting.set(true);

    this.demandService.createDemand(demand).subscribe({

      next: (createdDemand) => {

        console.log('Demand created:', createdDemand);

        this.message =
          `Demand #${createdDemand.demandId} registered successfully.`;

        this.clearForm();

        this.submitting.set(false);
      },

      error: (error) => {

        console.error(
          'Error creating demand:',
          error
        );

        if (error.error?.message) {

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
            'Unable to register demand.';
        }

        this.submitting.set(false);
      }

    });
  }

  // =====================================================
  // CLEAR FORM
  // =====================================================

  clearForm(): void {

    this.customerId = null;

    this.commodity = '';

    this.quantity = null;

    this.requiredWagons = null;

    this.fromStationId = null;

    this.toStationId = null;
  }
}
