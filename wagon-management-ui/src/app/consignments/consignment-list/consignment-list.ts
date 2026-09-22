import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  LucideArrowRight,
  LucideCircleAlert,
  LucideClipboardList,
  LucideEye,
  LucideInfo,
  LucidePackagePlus,
  LucideRefreshCw
} from '@lucide/angular';

import {
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
  selector: 'app-consignment-list',

  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    LucideArrowRight,
    LucideCircleAlert,
    LucideClipboardList,
    LucideEye,
    LucideInfo,
    LucidePackagePlus,
    LucideRefreshCw
  ],

  templateUrl: './consignment-list.html',

  styleUrl: './consignment-list.css'
})
export class ConsignmentList implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  consignments = signal<Consignment[]>([]);


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = signal(true);

  errorMessage = signal('');

  lastRefreshTime = signal<Date | null>(null);


  // =====================================================
  // STATISTICS
  // =====================================================

  totalConsignments = signal(0);

  totalQuantity = signal(0);


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private consignmentService: ConsignmentService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadConsignments();

  }


  // =====================================================
  // LOAD CONSIGNMENTS
  // =====================================================

  loadConsignments(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data) => {

          this.consignments.set(data);

          this.calculateStatistics(data);

          this.loading.set(false);

          this.lastRefreshTime.set(
            new Date()
          );

        },

        error: (error) => {

          console.error(
            'Error loading consignments:',
            error
          );

          this.errorMessage.set(
            'Unable to load consignment information.'
          );

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // STATISTICS
  // =====================================================

  calculateStatistics(
    consignments: Consignment[]
  ): void {

    this.totalConsignments.set(
      consignments.length
    );

    const quantity = consignments.reduce(
      (total, consignment) =>
        total + (consignment.quantity || 0),
      0
    );

    this.totalQuantity.set(quantity);

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshConsignments(): void {

    this.loadConsignments();

  }


  // =====================================================
  // STATUS
  // =====================================================

  getConsignmentStatus(
    consignment: Consignment
  ): string {

    return consignment.demand?.status || 'UNKNOWN';

  }


  getStatusClass(
    status: string
  ): string {

    switch (status) {

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


  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'WAGONS_ALLOCATED':
        return 'ALLOCATED';

      default:
        return status;

    }

  }

}