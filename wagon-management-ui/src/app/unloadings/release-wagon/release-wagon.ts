import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  LucideArrowRight,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideTrainFront
} from '@lucide/angular';

import {
  Wagon,
  WagonService
} from '../../wagons/wagon.service';

import {
  UnloadingService
} from '../unloading.service';

@Component({
  selector: 'app-release-wagon',
  imports: [
    LucideArrowRight,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideTrainFront
  ],
  templateUrl: './release-wagon.html',
  styleUrl: './release-wagon.css'
})
export class ReleaseWagon implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  wagons = signal<Wagon[]>([]);

  loading = signal(true);

  successMessage = signal('');

  errorMessage = signal('');

  releasingWagonId = signal<number | null>(null);


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private wagonService: WagonService,
    private unloadingService: UnloadingService
  ) {}


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  ngOnInit(): void {

    this.loadEmptyWagons();

  }


  // =====================================================
  // LOAD EMPTY WAGONS
  // =====================================================

  loadEmptyWagons(): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (data) => {

          console.log(
            'Wagons received:',
            data.length
          );

          /*
           * Only EMPTY wagons are eligible
           * for release.
           */
          const emptyWagons =
            data.filter(
              wagon =>
                wagon.status === 'EMPTY'
            );

          console.log(
            'Release-ready wagons:',
            emptyWagons.length
          );

          this.wagons.set(
            emptyWagons
          );

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading wagons:',
            error
          );

          this.errorMessage.set(
            'Unable to load release-ready wagons.'
          );

          this.loading.set(false);

        }

      });

  }


  // =====================================================
  // RELEASE WAGON
  // =====================================================

  releaseWagon(wagon: Wagon): void {

    if (
      this.releasingWagonId() !== null
    ) {

      return;

    }


    const confirmed = confirm(
      `Release wagon ${wagon.wagonNumber}?\n\n` +
      `Current station: ${wagon.station.stationCode} - ${wagon.station.stationName}\n` +
      `Current status: EMPTY\n\n` +
      `After release, the wagon will become AVAILABLE.`
    );


    if (!confirmed) {

      return;

    }


    this.successMessage.set('');

    this.errorMessage.set('');

    this.releasingWagonId.set(
      wagon.wagonId
    );


    console.log(
      'Release requested for wagon:',
      wagon
    );


    this.unloadingService
      .releaseWagon(wagon.wagonId)
      .subscribe({

        next: (releasedWagon) => {

          console.log(
            'Wagon released:',
            releasedWagon
          );


          this.successMessage.set(

            `Wagon ${releasedWagon.wagonNumber} ` +
            `released successfully. ` +
            `Status is now AVAILABLE at ` +
            `${releasedWagon.station.stationCode}.`

          );


          this.releasingWagonId.set(
            null
          );


          /*
           * Refresh the release queue.
           */
          this.loadEmptyWagons();

        },


        error: (error) => {

          console.error(
            'Error releasing wagon:',
            error
          );


          this.releasingWagonId.set(
            null
          );


          if (
            error.error?.message
          ) {

            this.errorMessage.set(
              error.error.message
            );

          } else if (
            typeof error.error === 'string' &&
            error.error
          ) {

            this.errorMessage.set(
              error.error
            );

          } else {

            this.errorMessage.set(
              'Unable to release wagon.'
            );

          }

        }

      });

  }

}
