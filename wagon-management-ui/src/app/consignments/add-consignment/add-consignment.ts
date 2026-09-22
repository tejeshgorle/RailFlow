import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  LucideArrowRight,
  LucideCheck,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClipboardList,
  LucideRoute,
  LucideUserRound
} from '@lucide/angular';

import {
  Demand,
  DemandService
} from '../../demands/demand.service';

import {
  Customer,
  CustomerService
} from '../../customers/customer.service';

import {
  Consignment,
  CreateConsignmentFromDemandRequest,
  ConsignmentService
} from '../consignment.service';

@Component({
  selector: 'app-add-consignment',
  imports: [FormsModule,
    LucideArrowRight,
    LucideCheck,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideClipboardList,
    LucideRoute,
    LucideUserRound
  ],
  templateUrl: './add-consignment.html',
  styleUrl: './add-consignment.css'
})
export class AddConsignment implements OnInit {

  // -------------------------------------------------
  // DATA
  // -------------------------------------------------

  demands: Demand[] = [];

  customers: Customer[] = [];

  approvedDemands: Demand[] = [];


  // -------------------------------------------------
  // FORM
  // -------------------------------------------------

  demandId: number | null = null;

  consigneeId: number | null = null;


  // -------------------------------------------------
  // UI STATE
  // -------------------------------------------------

  loading = true;

  submitting = false;

  message = '';

  errorMessage = '';


  constructor(
    private consignmentService: ConsignmentService,
    private demandService: DemandService,
    private customerService: CustomerService
  ) {}


  // -------------------------------------------------
  // INIT
  // -------------------------------------------------

  ngOnInit(): void {

    this.loadDemands();

    this.loadCustomers();

  }


  // -------------------------------------------------
  // LOAD DEMANDS
  // -------------------------------------------------

  loadDemands(): void {

    this.loading = true;

    this.demandService
      .getAllDemands()
      .subscribe({

        next: (data) => {

          console.log(
            'Demands received:',
            data
          );

          this.demands = data;

          /*
           * Only APPROVED demands are ready
           * for consignment creation.
           */
          this.approvedDemands =
            data.filter(
              demand =>
                demand.status === 'APPROVED'
            );

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error loading demands:',
            error
          );

          this.errorMessage =
            'Unable to load demands.';

          this.loading = false;

        }

      });

  }


  // -------------------------------------------------
  // LOAD CUSTOMERS
  // -------------------------------------------------

  loadCustomers(): void {

    this.customerService
      .getAllCustomers()
      .subscribe({

        next: (data) => {

          console.log(
            'Customers received:',
            data
          );

          this.customers = data;

        },

        error: (error) => {

          console.error(
            'Error loading customers:',
            error
          );

          this.errorMessage =
            'Unable to load customers.';

        }

      });

  }


  // -------------------------------------------------
  // SELECTED DEMAND
  // -------------------------------------------------

  getSelectedDemand(): Demand | null {

    if (this.demandId === null) {

      return null;

    }

    return (
      this.approvedDemands.find(
        demand =>
          demand.demandId === this.demandId
      ) ?? null
    );

  }


  // -------------------------------------------------
  // SELECTED CONSIGNEE
  // -------------------------------------------------

  getSelectedConsignee(): Customer | null {

    if (this.consigneeId === null) {

      return null;

    }

    return (
      this.customers.find(
        customer =>
          customer.customerId === this.consigneeId
      ) ?? null
    );

  }


  // -------------------------------------------------
  // DEMAND CHANGE
  // -------------------------------------------------

  onDemandChange(): void {

    this.message = '';

    this.errorMessage = '';

  }


  // -------------------------------------------------
  // CREATE CONSIGNMENT
  // -------------------------------------------------

  createConsignment(): void {

    this.message = '';

    this.errorMessage = '';


    // -----------------------------------------------
    // VALIDATE DEMAND
    // -----------------------------------------------

    if (
      this.demandId === null ||
      this.demandId <= 0
    ) {

      this.errorMessage =
        'Please select an approved demand.';

      return;

    }


    // -----------------------------------------------
    // VALIDATE CONSIGNEE
    // -----------------------------------------------

    if (
      this.consigneeId === null ||
      this.consigneeId <= 0
    ) {

      this.errorMessage =
        'Please select a consignee.';

      return;

    }


    // -----------------------------------------------
    // CREATE REQUEST
    // -----------------------------------------------

    const request:
      CreateConsignmentFromDemandRequest = {

      demandId:
        this.demandId,

      consigneeId:
        this.consigneeId

    };


    console.log(
      'Creating consignment from demand:',
      request
    );


    this.submitting = true;


    this.consignmentService
      .createConsignmentFromDemand(request)
      .subscribe({

        next: (createdConsignment: Consignment) => {

          console.log(
            'Consignment created:',
            createdConsignment
          );

          this.message =
            `Consignment #${createdConsignment.consignmentId} ` +
            `created successfully from Demand #${this.demandId}.`;


          // Clear form

          this.demandId = null;

          this.consigneeId = null;

          this.submitting = false;

        },


        error: (error) => {

          console.error(
            'Error creating consignment:',
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
              'Unable to create consignment.';

          }

          this.submitting = false;

        }

      });

  }

}