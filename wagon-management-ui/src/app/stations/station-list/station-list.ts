import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';

import {
  Station,
  StationService
} from '../station.service';

import { RouterLink } from '@angular/router';

import {
  LucideBuilding2,
  LucideCheckCircle,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideDatabase,
  LucideEye,
  LucideMapPin,
  LucideMapPinOff,
  LucideRefreshCw
} from '@lucide/angular';

@Component({
  selector: 'app-station-list',
  imports: [
    RouterLink,
    DatePipe,
    LucideBuilding2,
    LucideCheckCircle,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideDatabase,
    LucideEye,
    LucideMapPin,
    LucideMapPinOff,
    LucideRefreshCw
  ],
  templateUrl: './station-list.html',
  styleUrl: './station-list.css'
})
export class StationList implements OnInit {

  stations = signal<Station[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  lastRefreshTime = signal<Date | null>(null);

  constructor(
    private stationService: StationService
  ) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.stationService.getAllStations().subscribe({

      next: (data) => {

        console.log(
          'Stations received:',
          data.length
        );

        this.stations.set(data);
        this.lastRefreshTime.set(new Date());

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Error loading stations:',
          error
        );

        this.errorMessage.set(
          'Unable to load stations.'
        );

        this.loading.set(false);
      }

    });
  }

  refreshStations(): void {
    this.loadStations();
  }

  getTotalStations(): number {
    return this.stations().length;
  }

  getTotalZones(): number {

    return new Set(
      this.stations()
        .map(station => station.zone)
        .filter(zone => !!zone)
    ).size;
  }

  getTotalDivisions(): number {

    return new Set(
      this.stations()
        .map(station => station.division)
        .filter(division => !!division)
    ).size;
  }

}
