import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';

import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideEye,
  LucidePlus,
  LucideRefreshCw,
  LucideTrainFront
} from '@lucide/angular';

import {
  Wagon,
  WagonService,
  UpdateWagonRequest
} from '../wagon.service';

@Component({
  selector: 'app-wagon-list',
  imports: [
    FormsModule,
    RouterLink,
    DecimalPipe,
    DatePipe,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideEye,
    LucidePlus,
    LucideRefreshCw,
    LucideTrainFront
  ],
  templateUrl: './wagon-list.html',
  styleUrl: './wagon-list.css'
})
export class WagonList implements OnInit {

  wagons = signal<Wagon[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  lastRefreshTime = signal<Date | null>(null);

  editingWagonId: number | null = null;

  editWagonNumber = '';
  editWagonType = '';
  editCapacity: number | null = null;

  editMessage = '';
  editErrorMessage = '';

  constructor(
    private wagonService: WagonService
  ) {}

  ngOnInit(): void {
    this.loadWagons();
  }

  loadWagons(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.wagonService.getAllWagons().subscribe({

      next: (data) => {

        console.log('Wagons received:', data.length);

        this.wagons.set(data);
        this.lastRefreshTime.set(new Date());

        this.loading.set(false);

      },

      error: (error) => {

        console.error('Error loading wagons:', error);

        this.errorMessage.set(
          'Unable to load wagon fleet data.'
        );

        this.loading.set(false);

      }

    });
  }

  refreshWagons(): void {
    this.loadWagons();
  }

  /* =====================================================
     FLEET SUMMARY
     ===================================================== */

  getTotalWagons(): number {
    return this.wagons().length;
  }

  getAvailableWagons(): number {
    return this.wagons().filter(
      wagon => wagon.status === 'AVAILABLE'
    ).length;
  }

  getAllocatedWagons(): number {
    return this.wagons().filter(
      wagon => wagon.status === 'ALLOCATED'
    ).length;
  }

  getLoadedWagons(): number {
    return this.wagons().filter(
      wagon => wagon.status === 'LOADED'
    ).length;
  }

  getEmptyWagons(): number {
    return this.wagons().filter(
      wagon => wagon.status === 'EMPTY'
    ).length;
  }

  /* =====================================================
     STATUS
     ===================================================== */

  getStatusClass(status: string): string {

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
        return 'status-default';

    }

  }

  /* =====================================================
     EDIT
     ===================================================== */

  editWagon(wagon: Wagon): void {

    this.editingWagonId = wagon.wagonId;

    this.editWagonNumber = wagon.wagonNumber;
    this.editWagonType = wagon.wagonType;
    this.editCapacity = wagon.capacity;

    this.editMessage = '';
    this.editErrorMessage = '';

    console.log('Editing wagon:', wagon);
  }

  getEditingWagon(): Wagon | undefined {

    if (this.editingWagonId === null) {
      return undefined;
    }

    return this.wagons().find(
      wagon => wagon.wagonId === this.editingWagonId
    );

  }

  updateWagon(): void {

    if (this.editingWagonId === null) {
      return;
    }

    this.editMessage = '';
    this.editErrorMessage = '';

    if (
      !this.editWagonNumber.trim() ||
      !this.editWagonType.trim() ||
      this.editCapacity === null
    ) {

      this.editErrorMessage =
        'Please fill all editable fields.';

      return;

    }

    if (this.editCapacity <= 0) {

      this.editErrorMessage =
        'Capacity must be greater than zero.';

      return;

    }

    const wagon: UpdateWagonRequest = {

      wagonNumber: this.editWagonNumber.trim(),
      wagonType: this.editWagonType.trim(),
      capacity: this.editCapacity

    };

    this.wagonService.updateWagon(
      this.editingWagonId,
      wagon
    ).subscribe({

      next: (updatedWagon) => {

        console.log('Wagon updated:', updatedWagon);

        this.editMessage =
          `Wagon ${updatedWagon.wagonNumber} updated successfully.`;

        this.editingWagonId = null;

        this.loadWagons();

      },

      error: (error) => {

        console.error(
          'Error updating wagon:',
          error
        );

        if (error.error?.message) {

          this.editErrorMessage =
            error.error.message;

        } else if (
          typeof error.error === 'string' &&
          error.error
        ) {

          this.editErrorMessage =
            error.error;

        } else {

          this.editErrorMessage =
            'Unable to update wagon.';

        }

      }

    });

  }

  cancelEdit(): void {

    this.editingWagonId = null;

    this.editWagonNumber = '';
    this.editWagonType = '';
    this.editCapacity = null;

    this.editMessage = '';
    this.editErrorMessage = '';

  }

  /* =====================================================
     DELETE
     ===================================================== */

  deleteWagon(wagon: Wagon): void {

    console.log(
      'Delete requested for wagon:',
      wagon
    );

    const confirmed = confirm(
      `Are you sure you want to delete wagon ${wagon.wagonNumber}?`
    );

    if (!confirmed) {
      return;
    }

    this.wagonService.deleteWagon(
      wagon.wagonId
    ).subscribe({

      next: () => {

        console.log(
          'Wagon deleted:',
          wagon.wagonId
        );

        this.loadWagons();

      },

      error: (error) => {

        console.error(
          'Error deleting wagon. HTTP status:',
          error.status,
          'Backend response:',
          error.error,
          error
        );

        if (
          typeof error.error === 'string' &&
          error.error
        ) {

          alert(error.error);

        } else if (error.error?.message) {

          alert(error.error.message);

        } else {

          alert(
            `Unable to delete wagon ${wagon.wagonNumber}. ` +
            `HTTP status: ${error.status || 'unknown'}.`
          );

        }

      }

    });

  }

}
