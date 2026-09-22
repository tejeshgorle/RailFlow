import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeftRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideClock3,
  LucideMapPin,
  LucideMapPinCheck,
  LucideRefreshCw
} from '@lucide/angular';

import {
  Movement,
  MovementService
} from '../movement.service';


@Component({
  selector: 'app-movement-history',

  imports: [
    DatePipe,
    RouterLink,
    LucideArrowLeftRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideClock3,
    LucideMapPin,
    LucideMapPinCheck,
    LucideRefreshCw
  ],

  templateUrl: './movement-history.html',

  styleUrl: './movement-history.css'
})
export class MovementHistory implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  movements =
    signal<Movement[]>([]);


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading =
    signal(true);

  errorMessage =
    signal('');

  lastRefreshTime =
    signal<Date | null>(null);


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private movementService: MovementService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadMovements();

  }


  // =====================================================
  // LOAD MOVEMENT HISTORY
  // =====================================================

  loadMovements(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.movementService
      .getAllMovements()
      .subscribe({

        next: (data) => {

          const sortedMovements =
            [...data].sort(
              (a, b) =>
                new Date(b.movementTime).getTime() -
                new Date(a.movementTime).getTime()
            );

          this.movements.set(
            sortedMovements
          );

          this.loading.set(false);

          this.lastRefreshTime.set(
            new Date()
          );

        },

        error: (error) => {

          console.error(
            'Error loading movement history:',
            error
          );

          this.errorMessage.set(
            'Unable to load movement history.'
          );

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refreshMovements(): void {

    this.loadMovements();

  }


  getTodayMovementCount(): number {

    const today = new Date();

    return this.movements().filter(movement => {

      const movementDate =
        new Date(movement.movementTime);

      return (
        movementDate.getFullYear() === today.getFullYear() &&
        movementDate.getMonth() === today.getMonth() &&
        movementDate.getDate() === today.getDate()
      );

    }).length;

  }


  getOriginStationCount(): number {

    return new Set(
      this.movements()
        .map(movement => movement.fromStation?.stationCode)
        .filter(Boolean)
    ).size;

  }


  getDestinationStationCount(): number {

    return new Set(
      this.movements()
        .map(movement => movement.toStation?.stationCode)
        .filter(Boolean)
    ).size;

  }

}
