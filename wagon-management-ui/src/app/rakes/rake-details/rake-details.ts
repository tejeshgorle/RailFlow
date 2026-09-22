import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  RakeDetails,
  RakeService
} from '../rake.service';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideTrainFront
} from '@lucide/angular';

@Component({
  selector: 'app-rake-details',
  imports: [
    RouterLink,
    DatePipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideTrainFront
  ],
  templateUrl: './rake-details.html',
  styleUrl: './rake-details.css'
})
export class RakeDetailsComponent implements OnInit {

  rake = signal<RakeDetails | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private rakeService: RakeService
  ) {}

  ngOnInit(): void {

    const rakeId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!rakeId || rakeId <= 0) {
      this.errorMessage.set('Invalid rake ID.');
      this.loading.set(false);
      return;
    }

    this.loadRakeDetails(rakeId);
  }

  // ---------------------------------------------
  // Load rake details
  // ---------------------------------------------

  loadRakeDetails(rakeId: number): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.rakeService.getRakeDetails(rakeId).subscribe({

      next: (data) => {

        console.log('Rake details received:', data);

        this.rake.set(data);
        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Error loading rake details:',
          error
        );

        if (typeof error.error === 'string' && error.error) {

          this.errorMessage.set(error.error);

        } else if (error.error?.message) {

          this.errorMessage.set(
            error.error.message
          );

        } else {

          this.errorMessage.set(
            'Unable to load rake details.'
          );
        }

        this.loading.set(false);
      }
    });
  }

  // ---------------------------------------------
  // Status helpers
  // ---------------------------------------------

  getStatusClass(status: string): string {

    switch (status) {

      case 'FORMED':
        return 'status-formed';

      case 'DISPATCHED':
        return 'status-dispatched';

      case 'ARRIVED':
        return 'status-arrived';

      default:
        return 'status-default';
    }
  }

  // ---------------------------------------------
  // Track whether dispatch happened
  // ---------------------------------------------

  isDispatched(): boolean {

    return !!this.rake()?.dispatchTime;
  }

  // ---------------------------------------------
  // Calculate wagon capacity
  // ---------------------------------------------

  getTotalCapacity(): number {

    return this.rake()
      ?.wagons
      ?.reduce(
        (total, wagon) =>
          total + (wagon.capacity || 0),
        0
      ) ?? 0;
  }

  // ---------------------------------------------
  // Back to rake movement
  // ---------------------------------------------

  backToRakes(): void {
    // RouterLink handles navigation from template.
  }
}