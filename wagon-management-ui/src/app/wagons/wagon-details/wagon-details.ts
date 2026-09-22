import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideCircleAlert,
  LucideInfo,
  LucideMapPinOff
} from '@lucide/angular';

import {
  Wagon,
  WagonService
} from '../wagon.service';

@Component({
  selector: 'app-wagon-details',
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucideCircleAlert,
    LucideInfo,
    LucideMapPinOff
  ],
  templateUrl: './wagon-details.html',
  styleUrl: './wagon-details.css'
})
export class WagonDetails implements OnInit {

  wagon = signal<Wagon | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private wagonService: WagonService
  ) {}

  ngOnInit(): void {

    const wagonId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!wagonId || wagonId <= 0) {

      this.errorMessage.set(
        'Invalid wagon ID.'
      );

      this.loading.set(false);

      return;
    }

    this.loadWagon(wagonId);
  }

  loadWagon(wagonId: number): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.wagonService.getWagonById(wagonId).subscribe({

      next: (data) => {

        console.log(
          'Wagon details received:',
          data
        );

        this.wagon.set(data);

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Error loading wagon details:',
          error
        );

        if (
          typeof error.error === 'string' &&
          error.error
        ) {

          this.errorMessage.set(
            error.error
          );

        } else if (error.error?.message) {

          this.errorMessage.set(
            error.error.message
          );

        } else {

          this.errorMessage.set(
            'Unable to load wagon details.'
          );
        }

        this.loading.set(false);
      }

    });
  }

  getStatusClass(status: string | undefined): string {

    switch (status) {

      case 'AVAILABLE':
        return 'status-available';

      case 'ALLOCATED':
        return 'status-allocated';

      case 'LOADED':
        return 'status-loaded';

      case 'EMPTY':
        return 'status-empty';

      default:
        return 'status-unknown';
    }
  }

  getStatusDescription(status: string | undefined): string {

    switch (status) {

      case 'AVAILABLE':
        return 'Wagon is available for allocation.';

      case 'ALLOCATED':
        return 'Wagon has been assigned to a consignment.';

      case 'LOADED':
        return 'Wagon is currently carrying freight.';

      case 'EMPTY':
        return 'Wagon has completed unloading and is empty.';

      default:
        return 'Current operational status is unavailable.';
    }
  }

  getLifecycleStep(status: string | undefined): number {

    switch (status) {

      case 'AVAILABLE':
        return 1;

      case 'ALLOCATED':
        return 2;

      case 'LOADED':
        return 3;

      case 'EMPTY':
        return 4;

      default:
        return 1;
    }
  }

  isLifecycleCompleted(step: number): boolean {

    return step < this.getLifecycleStep(
      this.wagon()?.status
    );
  }

  isLifecycleCurrent(step: number): boolean {

    return step === this.getLifecycleStep(
      this.wagon()?.status
    );
  }

}
