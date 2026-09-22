import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  LucideRefreshCw,
  LucideTrainFront,
  LucideClipboardCheck,
  LucideTruck,
  LucideCircleCheck,
  LucideCircleAlert,
  LucideEye,
  LucideArrowRight
} from '@lucide/angular';



import {
  Rake,
  RakeService
} from '../rake.service';

@Component({
  selector: 'app-rake-list',
  imports: [DatePipe,RouterLink,LucideRefreshCw,
          LucideTrainFront,
          LucideClipboardCheck,
          LucideTruck,
          LucideCircleCheck,
          LucideCircleAlert,
          LucideEye,
          LucideArrowRight],
  templateUrl: './rake-list.html',
  styleUrl: './rake-list.css'
})
export class RakeList implements OnInit {

  /* =====================================================
     DATA
  ====================================================== */

  rakes = signal<Rake[]>([]);

  loading = signal(true);

  actionLoading = signal<number | null>(null);

  errorMessage = signal('');

  successMessage = signal('');


  /* =====================================================
     CONSTRUCTOR
  ====================================================== */

  constructor(
    private rakeService: RakeService
  ) {}


  /* =====================================================
     INITIALIZATION
  ====================================================== */

  ngOnInit(): void {

    this.loadRakes();

  }


  /* =====================================================
     LOAD RAKES
  ====================================================== */

  loadRakes(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.rakeService
      .getAllRakes()
      .subscribe({

        next: (data) => {

          console.log(
            'Rakes received:',
            data.length
          );

          this.rakes.set(data);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading rakes:',
            error
          );

          this.errorMessage.set(
            'Unable to load rake movement data.'
          );

          this.loading.set(false);

        }

      });

  }


  /* =====================================================
     REFRESH
  ====================================================== */

  refreshRakes(): void {

    this.successMessage.set('');

    this.errorMessage.set('');

    this.loadRakes();

  }


  /* =====================================================
     SUMMARY
  ====================================================== */

  getTotalRakes(): number {

    return this.rakes().length;

  }


  getFormedCount(): number {

    return this.rakes()
      .filter(
        rake => rake.status === 'FORMED'
      )
      .length;

  }


  getDispatchedCount(): number {

    return this.rakes()
      .filter(
        rake => rake.status === 'DISPATCHED'
      )
      .length;

  }


  getArrivedCount(): number {

    return this.rakes()
      .filter(
        rake => rake.status === 'ARRIVED'
      )
      .length;

  }


  /* =====================================================
     STATUS
  ====================================================== */

  getStatusLabel(status: string): string {

    switch (status) {

      case 'FORMED':
        return 'FORMED';

      case 'DISPATCHED':
        return 'DISPATCHED';

      case 'ARRIVED':
        return 'ARRIVED';

      default:
        return status;

    }

  }


  /* =====================================================
     DISPATCH
  ====================================================== */

  dispatchRake(rake: Rake): void {

    const confirmed = confirm(
      `Dispatch rake ${rake.rakeNumber} from ` +
      `${rake.fromStation.stationCode} to ` +
      `${rake.toStation.stationCode}?`
    );

    if (!confirmed) {

      return;

    }

    this.successMessage.set('');

    this.errorMessage.set('');

    this.actionLoading.set(rake.rakeId);


    this.rakeService
      .dispatchRake(rake.rakeId)
      .subscribe({

        next: (updatedRake) => {

          console.log(
            'Rake dispatched:',
            updatedRake
          );

          this.successMessage.set(
            `Rake ${updatedRake.rakeNumber} dispatched successfully.`
          );

          this.actionLoading.set(null);

          this.loadRakes();

        },

        error: (error) => {

          console.error(
            'Error dispatching rake:',
            error
          );

          this.actionLoading.set(null);

          this.handleError(
            error,
            'Unable to dispatch rake.'
          );

        }

      });

  }


  /* =====================================================
     ARRIVAL
  ====================================================== */

  arriveRake(rake: Rake): void {

    const confirmed = confirm(
      `Mark rake ${rake.rakeNumber} as arrived at ` +
      `${rake.toStation.stationCode}?`
    );

    if (!confirmed) {

      return;

    }

    this.successMessage.set('');

    this.errorMessage.set('');

    this.actionLoading.set(rake.rakeId);


    this.rakeService
      .arriveRake(rake.rakeId)
      .subscribe({

        next: (updatedRake) => {

          console.log(
            'Rake arrived:',
            updatedRake
          );

          this.successMessage.set(
            `Rake ${updatedRake.rakeNumber} arrived successfully at ` +
            `${updatedRake.toStation.stationCode}.`
          );

          this.actionLoading.set(null);

          this.loadRakes();

        },

        error: (error) => {

          console.error(
            'Error arriving rake:',
            error
          );

          this.actionLoading.set(null);

          this.handleError(
            error,
            'Unable to arrive rake.'
          );

        }

      });

  }


  /* =====================================================
     COMMON ERROR HANDLER
  ====================================================== */

  private handleError(
    error: any,
    defaultMessage: string
  ): void {

    if (
      error.error?.message
    ) {

      this.errorMessage.set(
        error.error.message
      );

    }

    else if (
      typeof error.error === 'string' &&
      error.error
    ) {

      this.errorMessage.set(
        error.error
      );

    }

    else {

      this.errorMessage.set(
        defaultMessage
      );

    }

  }

}