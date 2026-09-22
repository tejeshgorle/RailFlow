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
  DatePipe
} from '@angular/common';

import {
  Station,
  StationService
} from '../station.service';

import {
  LucideArrowLeft,
  LucideCircleAlert,
  LucideMapPin
} from '@lucide/angular';

@Component({
  selector: 'app-station-details',
  imports: [
    RouterLink,
    DatePipe,
    LucideArrowLeft,
    LucideCircleAlert,
    LucideMapPin
  ],
  templateUrl: './station-details.html',
  styleUrl: './station-details.css'
})
export class StationDetails implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  station = signal<Station | null>(null);

  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = signal(true);

  errorMessage = signal('');

  lastRefreshTime = signal<Date | null>(null);

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,
    private stationService: StationService
  ) {}

  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    const stationId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log(
      'Station ID from URL:',
      stationId
    );

    if (!stationId || stationId <= 0) {

      this.errorMessage.set(
        'Invalid station ID.'
      );

      this.loading.set(false);

      return;
    }

    this.loadStation(stationId);
  }

  // =====================================================
  // LOAD
  // =====================================================

  loadStation(stationId: number): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.stationService
      .getStationById(stationId)
      .subscribe({

        next: (data) => {

          console.log(
            'Station received:',
            data
          );

          this.station.set(data);

          this.lastRefreshTime.set(
            new Date()
          );

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading station:',
            error
          );

          this.errorMessage.set(
            error.error?.message ||
            error.error ||
            'Unable to load station.'
          );

          this.loading.set(false);

        }

      });

  }
}
