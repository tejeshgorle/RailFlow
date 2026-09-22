import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  LucideArrowRight,
  LucideCheck,
  LucideCircleCheck,
  LucideCircleDot,
  LucideClipboardCheck,
  LucideClipboardList,
  LucideClipboardPenLine,
  LucideEye,
  LucideHash,
  LucideMapPin,
  LucidePackage,
  LucidePackageCheck,
  LucidePackagePlus,
  LucideRoute,
  LucideScale,
  LucideSearch,
  LucideTrainFront,
  LucideTriangleAlert,
  LucideUsers,
  LucideZap
} from '@lucide/angular';

import {
  Demand,
  DemandService
} from '../demand.service';


@Component({
  selector: 'app-demand-list',
  imports: [
    RouterLink,
    DatePipe,
    LucideArrowRight,
    LucideCheck,
    LucideCircleCheck,
    LucideCircleDot,
    LucideClipboardCheck,
    LucideClipboardList,
    LucideClipboardPenLine,
    LucideEye,
    LucideHash,
    LucideMapPin,
    LucidePackage,
    LucidePackageCheck,
    LucidePackagePlus,
    LucideRoute,
    LucideScale,
    LucideSearch,
    LucideTrainFront,
    LucideTriangleAlert,
    LucideUsers,
    LucideZap
  ],
  templateUrl: './demand-list.html',
  styleUrl: './demand-list.css'
})
export class DemandList implements OnInit {

  demands = signal<Demand[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  successMessage = signal('');

  searchText = signal('');

  selectedStatus = signal('ALL');

  statusOptions = [
    'ALL',
    'REGISTERED',
    'APPROVED',
    'WAGONS_ALLOCATED',
    'LOADED',
    'DELIVERED'
  ];

  constructor(
    private demandService: DemandService
  ) {}

  ngOnInit(): void {
    this.loadDemands();
  }

  loadDemands(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.demandService.getAllDemands().subscribe({
      next: (data) => {
        this.demands.set(data);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error loading demands:', error);

        this.errorMessage.set(
          'Unable to load demands.'
        );

        this.loading.set(false);
      }
    });
  }

  filteredDemands(): Demand[] {
    const search =
      this.searchText()
        .trim()
        .toLowerCase();

    const status = this.selectedStatus();

    return this.demands().filter(demand => {
      const matchesStatus =
        status === 'ALL' ||
        demand.status === status;

      const matchesSearch =
        !search ||
        String(demand.demandId)
          .toLowerCase()
          .includes(search) ||

        demand.customer?.customerName
          ?.toLowerCase()
          .includes(search) ||

        demand.commodity
          ?.toLowerCase()
          .includes(search) ||

        demand.fromStation?.stationCode
          ?.toLowerCase()
          .includes(search) ||

        demand.toStation?.stationCode
          ?.toLowerCase()
          .includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  onSearch(event: Event): void {
    const input =
      event.target as HTMLInputElement;

    this.searchText.set(input.value);
  }

  onStatusChange(event: Event): void {
    const select =
      event.target as HTMLSelectElement;

    this.selectedStatus.set(select.value);
  }

  approveDemand(demand: Demand): void {
    const confirmed =
      confirm(
        `Approve Demand #${demand.demandId}?`
      );

    if (!confirmed) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    this.demandService
      .approveDemand(demand.demandId)
      .subscribe({
        next: (updatedDemand) => {
          this.successMessage.set(
            `Demand #${updatedDemand.demandId} approved successfully.`
          );

          this.loadDemands();
        },

        error: (error) => {
          console.error(
            'Error approving demand:',
            error
          );

          if (
            typeof error.error === 'string' &&
            error.error
          ) {
            this.errorMessage.set(
              error.error
            );
          }

          else if (
            error.error?.message
          ) {
            this.errorMessage.set(
              error.error.message
            );
          }

          else {
            this.errorMessage.set(
              'Unable to approve demand.'
            );
          }
        }
      });
  }

  getTotalCount(): number {
    return this.demands().length;
  }

  getRegisteredCount(): number {
    return this.demands()
      .filter(
        demand =>
          demand.status === 'REGISTERED'
      )
      .length;
  }

  getApprovedCount(): number {
    return this.demands()
      .filter(
        demand =>
          demand.status === 'APPROVED'
      )
      .length;
  }

  getLoadedCount(): number {
    return this.demands()
      .filter(
        demand =>
          demand.status === 'LOADED'
      )
      .length;
  }

  getDeliveredCount(): number {
    return this.demands()
      .filter(
        demand =>
          demand.status === 'DELIVERED'
      )
      .length;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'WAGONS_ALLOCATED':
        return 'WAGONS ALLOCATED';

      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'REGISTERED':
        return 'status-registered';

      case 'APPROVED':
        return 'status-approved';

      case 'WAGONS_ALLOCATED':
        return 'status-allocated';

      case 'LOADED':
        return 'status-loaded';

      case 'DELIVERED':
        return 'status-delivered';

      default:
        return 'status-default';
    }
  }
}
