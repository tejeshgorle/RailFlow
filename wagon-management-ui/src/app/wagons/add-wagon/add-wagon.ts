import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideInfo,
  LucidePlus
} from '@lucide/angular';

import {
  Station,
  StationService
} from '../../stations/station.service';

import {
  CreateWagonRequest,
  WagonService
} from '../wagon.service';

@Component({
  selector: 'app-add-wagon',
  imports: [
    FormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideInfo,
    LucidePlus
  ],
  templateUrl: './add-wagon.html',
  styleUrl: './add-wagon.css'
})
export class AddWagon implements OnInit {

  @Output() wagonAdded = new EventEmitter<void>();

  stations = signal<Station[]>([]);

  wagonNumber = '';
  wagonType = '';
  capacity: number | null = null;
  stationId = signal<number | null>(null);

  message = '';
  errorMessage = '';

  constructor(
    private wagonService: WagonService,
    private stationService: StationService
  ) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.stationService.getAllStations().subscribe({
      next: (data) => {
        console.log('Stations received:', data);
        this.stations.set(data);
      },
      error: (error) => {
        console.error('Error loading stations:', error);
        this.errorMessage = 'Unable to load stations.';
      }
    });
  }

  addWagon(): void {
    this.message = '';
    this.errorMessage = '';

    if (
      !this.wagonNumber.trim() ||
      !this.wagonType.trim() ||
      this.capacity === null ||
      this.stationId() === null
    ) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    if (this.capacity <= 0) {
      this.errorMessage = 'Capacity must be greater than zero.';
      return;
    }

    const wagon: CreateWagonRequest = {
      wagonNumber: this.wagonNumber.trim(),
      wagonType: this.wagonType.trim(),
      capacity: this.capacity,
      station: {
        stationId: this.stationId()!
      }
    };

    this.wagonService.createWagon(wagon).subscribe({
      next: (createdWagon) => {
        console.log('Wagon created:', createdWagon);

        this.message =
          `Wagon ${createdWagon.wagonNumber} has been registered successfully.`;

        this.wagonNumber = '';
        this.wagonType = '';
        this.capacity = null;
        this.stationId.set(null);

        this.wagonAdded.emit();
      },

      error: (error) => {
        console.error('Error creating wagon:', error);

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (
          typeof error.error === 'string' &&
          error.error
        ) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage =
            'Unable to register wagon. Please try again.';
        }
      }
    });
  }
}
