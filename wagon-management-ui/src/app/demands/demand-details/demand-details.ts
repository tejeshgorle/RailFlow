import { Component, OnInit, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCheck,
  LucideCircleAlert,
  LucideCircleCheck
} from '@lucide/angular';

import { DatePipe } from '@angular/common';

import {
  Demand,
  DemandService
} from '../demand.service';


@Component({
  selector: 'app-demand-details',
  imports: [
    RouterLink,
    DatePipe,
    LucideArrowLeft,
    LucideArrowRight,
    LucideCheck,
    LucideCircleAlert,
    LucideCircleCheck
  ],
  templateUrl: './demand-details.html',
  styleUrl: './demand-details.css'
})
export class DemandDetails implements OnInit {

  /* =====================================================
     DEMAND
  ===================================================== */

  demand = signal<Demand | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  successMessage = signal('');


  /* =====================================================
     CONSTRUCTOR
  ===================================================== */

  constructor(
    private route: ActivatedRoute,
    private demandService: DemandService,
    private router: Router
  ) {}


  /* =====================================================
     INITIALIZATION
  ===================================================== */

  ngOnInit(): void {

    const demandId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!demandId || demandId <= 0) {

      this.errorMessage.set(
        'Invalid demand ID.'
      );

      this.loading.set(false);

      return;
    }

    this.loadDemand(demandId);
  }


  /* =====================================================
     LOAD DEMAND
  ===================================================== */

  loadDemand(demandId: number): void {

    this.loading.set(true);

    this.errorMessage.set('');

    this.demandService
      .getDemandById(demandId)
      .subscribe({

        next: (data) => {

          console.log(
            'Demand loaded:',
            data
          );

          this.demand.set(data);

          this.loading.set(false);
        },

        error: (error) => {

          console.error(
            'Error loading demand:',
            error
          );

          if (
            typeof error.error === 'string' &&
            error.error
          ) {

            this.errorMessage.set(
              error.error
            );

          } else if (
            error.error?.message
          ) {

            this.errorMessage.set(
              error.error.message
            );

          } else {

            this.errorMessage.set(
              'Unable to load demand details.'
            );
          }

          this.loading.set(false);
        }
      });
  }


  /* =====================================================
     STATUS
  ===================================================== */

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


  /* =====================================================
     WORKFLOW
  ===================================================== */

  getCurrentStep(): number {

    const status = this.demand()?.status;

    switch (status) {

      case 'REGISTERED':
        return 1;

      case 'APPROVED':
        return 2;

      case 'WAGONS_ALLOCATED':
        return 3;

      case 'LOADED':
        return 4;

      /*
       * DELIVERED means the entire workflow is complete.
       * Returning 9 makes all 8 displayed steps completed.
       */
      case 'DELIVERED':
        return 9;

      default:
        return 1;
    }
  }


  isStepCompleted(step: number): boolean {

    return step < this.getCurrentStep();
  }


  isCurrentStep(step: number): boolean {

    return step === this.getCurrentStep();
  }


  isStepPending(step: number): boolean {

    return step > this.getCurrentStep();
  }


  /* =====================================================
     NEXT ACTION
  ===================================================== */

  getNextActionLabel(): string {

    const status = this.demand()?.status;

    switch (status) {

      case 'REGISTERED':
        return 'Approve Demand';

      case 'APPROVED':
        return 'Allocate Wagon';

      case 'WAGONS_ALLOCATED':
        return 'Load Wagon';

      case 'LOADED':
        return 'Form Rake';

      case 'DELIVERED':
        return 'Demand Completed';

      default:
        return 'View Details';
    }
  }

  hasNextAction(): boolean {

    const status = this.demand()?.status;

    return status !== 'DELIVERED';
  }

  /* =====================================================
     NEXT ACTION NAVIGATION
  ===================================================== */

  goToNextAction(): void {

    const currentDemand = this.demand();

    if (!currentDemand) {

      console.warn(
        'Cannot navigate: demand is not loaded.'
      );

      return;
    }

    const demandId = currentDemand.demandId;

    console.log(
      'Next action clicked:',
      currentDemand.status,
      'Demand ID:',
      demandId
    );


    switch (currentDemand.status) {

      /* ---------------------------------------------
         APPROVED
         → Allocate Wagon
      --------------------------------------------- */

      case 'APPROVED':

        console.log(
          'Navigating to allocation screen...'
        );

        this.router.navigate(
          ['/allocations/add'],
          {
            queryParams: {
              demandId: demandId
            }
          }
        ).then(
          success => console.log(
            'Allocation navigation result:',
            success
          )
        ).catch(
          error => console.error(
            'Allocation navigation failed:',
            error
          )
        );

        break;


      /* ---------------------------------------------
         WAGONS ALLOCATED
         → Load Wagon
      --------------------------------------------- */

      case 'WAGONS_ALLOCATED':

        console.log(
          'Navigating to loading screen...'
        );

        this.router.navigate(
          ['/loadings/add'],
          {
            queryParams: {
              demandId: demandId
            }
          }
        ).then(
          success => console.log(
            'Loading navigation result:',
            success
          )
        ).catch(
          error => console.error(
            'Loading navigation failed:',
            error
          )
        );

        break;


      /* ---------------------------------------------
         LOADED
         → Form Rake
      --------------------------------------------- */

      case 'LOADED':

        console.log(
          'Navigating to rake formation screen...'
        );

        this.router.navigate(
          ['/rakes/form'],
          {
            queryParams: {
              demandId: demandId
            }
          }
        ).then(
          success => console.log(
            'Rake navigation result:',
            success
          )
        ).catch(
          error => console.error(
            'Rake navigation failed:',
            error
          )
        );

        break;


      /* ---------------------------------------------
         REGISTERED / DELIVERED / UNKNOWN
      --------------------------------------------- */

      default:

        console.log(
          'No direct operation available for status:',
          currentDemand.status
        );

        this.router.navigate(['/demands']);

        break;
    }
  }


  /* =====================================================
     APPROVE DEMAND
  ===================================================== */

  approveDemand(): void {

    const currentDemand = this.demand();

    if (!currentDemand) {
      return;
    }

    const confirmed = confirm(
      `Approve Demand #${currentDemand.demandId}?`
    );

    if (!confirmed) {
      return;
    }

    this.successMessage.set('');

    this.errorMessage.set('');


    this.demandService
      .approveDemand(
        currentDemand.demandId
      )
      .subscribe({

        next: (updatedDemand) => {

          console.log(
            'Demand approved:',
            updatedDemand
          );

          this.demand.set(
            updatedDemand
          );

          this.successMessage.set(
            `Demand #${updatedDemand.demandId} approved successfully.`
          );
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

          } else if (
            error.error?.message
          ) {

            this.errorMessage.set(
              error.error.message
            );

          } else {

            this.errorMessage.set(
              'Unable to approve demand.'
            );
          }
        }
      });
  }
}