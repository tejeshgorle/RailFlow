import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCircleAlert,
  LucideClipboardList,
  LucideExternalLink,
  LucideMapPin,
  LucidePackage,
  LucideRoute,
  LucideTruck
} from '@lucide/angular';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';

import {
  Consignment,
  ConsignmentService
} from '../consignment.service';

@Component({
  selector: 'app-consignment-details',

  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCircleAlert,
    LucideClipboardList,
    LucideExternalLink,
    LucideMapPin,
    LucidePackage,
    LucideRoute,
    LucideTruck
  ],

  templateUrl: './consignment-details.html',

  styleUrl: './consignment-details.css'
})
export class ConsignmentDetails implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  consignment = signal<Consignment | null>(null);


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = signal(true);

  errorMessage = signal('');


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,
    private consignmentService: ConsignmentService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    const consignmentId =
      Number(idParam);

    if (
      !consignmentId ||
      consignmentId <= 0
    ) {

      this.errorMessage.set(
        'Invalid consignment ID.'
      );

      this.loading.set(false);

      return;

    }

    this.loadConsignment(consignmentId);

  }


  // =====================================================
  // LOAD
  // =====================================================

  loadConsignment(
    consignmentId: number
  ): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.consignmentService
      .getConsignmentById(consignmentId)
      .subscribe({

        next: (data) => {

          this.consignment.set(data);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading consignment:',
            error
          );

          this.errorMessage.set(
            error.error?.message ||
            error.error ||
            'Unable to load consignment details.'
          );

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // STATUS
  // =====================================================

  getStatus(): string {

    return this.consignment()
      ?.demand?.status || 'UNKNOWN';

  }


  getStatusClass(): string {

    switch (this.getStatus()) {

      case 'REGISTERED':
        return 'registered';

      case 'APPROVED':
        return 'approved';

      case 'WAGONS_ALLOCATED':
        return 'allocated';

      case 'LOADED':
        return 'loaded';

      case 'DELIVERED':
        return 'delivered';

      default:
        return 'unknown';

    }

  }


  getStatusLabel(): string {

    if (
      this.getStatus() === 'WAGONS_ALLOCATED'
    ) {

      return 'ALLOCATED';

    }

    return this.getStatus();

  }


  // =====================================================
  // DEMAND
  // =====================================================

  getDemandId(): number | null {

    return this.consignment()
      ?.demand?.demandId || null;

  }


  // =====================================================
  // ROUTE
  // =====================================================

  getRoute(): string {

    const consignment =
      this.consignment();

    if (!consignment) {

      return '';

    }

    return `${consignment.fromStation?.stationCode || '—'} → ${consignment.toStation?.stationCode || '—'}`;

  }

}