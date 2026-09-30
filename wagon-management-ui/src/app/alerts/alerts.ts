import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';


import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  LucideRefreshCw,
  LucideSearch,
  LucideAlertTriangle,
  LucideInfo,
  LucideCircleAlert,
  LucideCheckCircle2,
  LucideArrowRight
} from '@lucide/angular';

import {
  WagonService
} from '../wagons/wagon.service';

import type {
  Wagon
} from '../wagons/wagon.service';

import {
  DemandService
} from '../demands/demand.service';

import type {
  Demand
} from '../demands/demand.service';

import {
  RakeService
} from '../rakes/rake.service';

import type {
  Rake
} from '../rakes/rake.service';

import {
  ConsignmentService
} from '../consignments/consignment.service';

import type {
  Consignment
} from '../consignments/consignment.service';

import {
  UnloadingService
} from '../unloadings/unloading.service';


type AlertType =
  | 'APPROVAL'
  | 'ALLOCATION'
  | 'LOADING'
  | 'RAKE_FORMATION'
  | 'DISPATCH'
  | 'ARRIVAL'
  | 'UNLOADING';


type AlertPriority =
  | 'WARNING'
  | 'ACTION'
  | 'INFO';


type AlertFilter =
  | 'ALL'
  | 'WARNING'
  | 'ACTION'
  | 'INFO';


type AlertModule =
  | 'ALL'
  | 'DEMAND'
  | 'ALLOCATION'
  | 'LOADING'
  | 'RAKE'
  | 'MOVEMENT'
  | 'UNLOADING';


interface OperationalAlert {

  id: string;

  type: AlertType;

  priority: AlertPriority;

  title: string;

  description: string;

  referenceType:
    | 'DEMAND'
    | 'WAGON'
    | 'RAKE';

  referenceId: number | string;

  actionLabel: string;

  route: string;

  createdAt: Date;

}


@Component({

  selector: 'app-alerts',

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    DatePipe,

    RouterLink,

    LucideRefreshCw,

    LucideSearch,

    LucideAlertTriangle,

    LucideInfo,

    LucideCircleAlert,

    LucideCheckCircle2,

    LucideArrowRight

  ],

  templateUrl: './alerts.html',

  styleUrl: './alerts.css'

})


export class Alerts implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  wagons: Wagon[] = [];

  demands: Demand[] = [];

  rakes: Rake[] = [];

  consignments: Consignment[] = [];

  unloadings: any[] = [];


  alerts: OperationalAlert[] = [];


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = false;

  isRefreshing = false;

  errorMessage = '';

  lastRefreshTime: Date | null = null;


  // =====================================================
  // FILTERS
  // =====================================================

  selectedPriority: AlertFilter = 'ALL';

  selectedModule: AlertModule = 'ALL';

  searchTerm = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private wagonService: WagonService,

    private demandService: DemandService,

    private rakeService: RakeService,

    private consignmentService: ConsignmentService,

    private unloadingService: UnloadingService,

    private cdr: ChangeDetectorRef

  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadAlerts();

  }


  // =====================================================
  // LOAD DATA
  // =====================================================

  loadAlerts(): void {

    this.loading = true;

    this.errorMessage = '';


    let completedRequests = 0;

    const totalRequests = 5;

    const errors: string[] = [];


    const checkComplete = (): void => {

      completedRequests++;


      if (completedRequests >= totalRequests) {

        this.buildAlerts();

        this.loading = false;

        this.isRefreshing = false;

        this.lastRefreshTime = new Date();


        if (errors.length > 0) {

          this.errorMessage =
            `${errors.length} operational data source${errors.length > 1 ? 's are' : ' is'} unavailable. Some alerts may be incomplete.`;

        }


        this.cdr.markForCheck();

      }

    };


    // ===================================================
    // WAGONS
    // ===================================================

    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (data: Wagon[]) => {

          this.wagons = data ?? [];

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Alerts wagon error:',
            error
          );

          errors.push('wagon');

          checkComplete();

        }

      });


    // ===================================================
    // DEMANDS
    // ===================================================

    this.demandService
      .getAllDemands()
      .subscribe({

        next: (data: Demand[]) => {

          this.demands = data ?? [];

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Alerts demand error:',
            error
          );

          errors.push('demand');

          checkComplete();

        }

      });


    // ===================================================
    // RAKES
    // ===================================================

    this.rakeService
      .getAllRakes()
      .subscribe({

        next: (data: Rake[]) => {

          this.rakes = data ?? [];

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Alerts rake error:',
            error
          );

          errors.push('rake');

          checkComplete();

        }

      });


    // ===================================================
    // CONSIGNMENTS
    // ===================================================

    this.consignmentService
      .getAllConsignments()
      .subscribe({

        next: (data: Consignment[]) => {

          this.consignments = data ?? [];

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Alerts consignment error:',
            error
          );

          errors.push('consignment');

          checkComplete();

        }

      });


    // ===================================================
    // UNLOADING
    // ===================================================

    this.unloadingService
      .getAllUnloadings()
      .subscribe({

        next: (data) => {

          this.unloadings = data ?? [];

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Alerts unloading error:',
            error
          );

          errors.push('unloading');

          checkComplete();

        }

      });

  }


  // =====================================================
  // MANUAL REFRESH
  // =====================================================

  refreshAlerts(): void {

    if (this.loading || this.isRefreshing) {

      return;

    }


    this.isRefreshing = true;

    this.loadAlerts();

  }


  // =====================================================
  // BUILD OPERATIONAL ALERTS
  // =====================================================

  buildAlerts(): void {

    const generatedAlerts: OperationalAlert[] = [];


    // ===================================================
    // 1. REGISTERED DEMANDS
    // ===================================================

    this.demands

      .filter(
        demand =>
          demand.status === 'REGISTERED'
      )

      .forEach(
        demand => {

          generatedAlerts.push({

            id:
              `DEMAND-${demand.demandId}-APPROVAL`,

            type:
              'APPROVAL',

            priority:
              'WARNING',

            title:
              'Demand awaiting approval',

            description:
              `Demand #${demand.demandId} is registered and requires approval before wagon allocation.`,

            referenceType:
              'DEMAND',

            referenceId:
              demand.demandId,

            actionLabel:
              'Review Demand',

            route:
              '/demands',

            createdAt:
              this.getDateValue(
                demand.demandDate
              )

          });

        }

      );


    // ===================================================
    // 2. APPROVED DEMANDS
    // ===================================================

    this.demands

      .filter(
        demand =>
          demand.status === 'APPROVED'
      )

      .forEach(
        demand => {

          generatedAlerts.push({

            id:
              `DEMAND-${demand.demandId}-ALLOCATION`,

            type:
              'ALLOCATION',

            priority:
              'WARNING',

            title:
              'Demand awaiting wagon allocation',

            description:
              `Demand #${demand.demandId} is approved and requires wagon allocation.`,

            referenceType:
              'DEMAND',

            referenceId:
              demand.demandId,

            actionLabel:
              'Allocate Wagon',

            route:
              '/allocations',

            createdAt:
              this.getDateValue(
                demand.demandDate
              )

          });

        }

      );


    // ===================================================
    // 3. ALLOCATED DEMANDS
    // ===================================================

    this.demands

      .filter(
        demand =>
          demand.status === 'WAGONS_ALLOCATED'
      )

      .forEach(
        demand => {

          generatedAlerts.push({

            id:
              `DEMAND-${demand.demandId}-LOADING`,

            type:
              'LOADING',

            priority:
              'ACTION',

            title:
              'Wagon loading pending',

            description:
              `Wagons allocated for demand #${demand.demandId} are awaiting loading.`,

            referenceType:
              'DEMAND',

            referenceId:
              demand.demandId,

            actionLabel:
              'Open Loading',

            route:
              '/loadings',

            createdAt:
              this.getDateValue(
                demand.demandDate
              )

          });

        }

      );


    // ===================================================
    // 4. LOADED DEMANDS WITHOUT RAKE
    // ===================================================

    const rakeConsignmentIds =
      new Set<number>(

        this.rakes

          .map(
            rake =>
              rake.consignment?.consignmentId
          )

          .filter(
            (
              id
            ): id is number =>
              typeof id === 'number'
          )

      );


    this.demands

      .filter(
        demand =>
          demand.status === 'LOADED'
      )

      .forEach(
        demand => {

          const demandConsignment =
            this.consignments.find(

              consignment =>
                consignment.demand?.demandId ===
                demand.demandId

            );


          const alreadyInRake =
            demandConsignment?.consignmentId
              ? rakeConsignmentIds.has(
                  demandConsignment.consignmentId
                )
              : false;


          if (!alreadyInRake) {

            generatedAlerts.push({

              id:
                `DEMAND-${demand.demandId}-RAKE`,

              type:
                'RAKE_FORMATION',

              priority:
                'ACTION',

              title:
                'Loaded demand awaiting rake formation',

              description:
                `Demand #${demand.demandId} is loaded but its consignment has not been assigned to a rake.`,

              referenceType:
                'DEMAND',

              referenceId:
                demand.demandId,

              actionLabel:
                'Form Rake',

              route:
                '/rakes',

              createdAt:
                this.getDateValue(
                  demand.demandDate
                )

            });

          }

        }

      );


    // ===================================================
    // 5. FORMED RAKES
    // ===================================================

    this.rakes

      .filter(
        rake =>
          rake.status === 'FORMED'
      )

      .forEach(
        rake => {

          generatedAlerts.push({

            id:
              `RAKE-${rake.rakeId}-DISPATCH`,

            type:
              'DISPATCH',

            priority:
              'WARNING',

            title:
              'Rake awaiting dispatch',

            description:
              `Rake #${rake.rakeId} has been formed and is ready for dispatch.`,

            referenceType:
              'RAKE',

            referenceId:
              rake.rakeId,

            actionLabel:
              'Open Rake',

            route:
              '/rakes',

            createdAt:
              new Date()

          });

        }

      );


    // ===================================================
    // 6. DISPATCHED RAKES
    // ===================================================

    this.rakes

      .filter(
        rake =>
          rake.status === 'DISPATCHED'
      )

      .forEach(
        rake => {

          generatedAlerts.push({

            id:
              `RAKE-${rake.rakeId}-ARRIVAL`,

            type:
              'ARRIVAL',

            priority:
              'INFO',

            title:
              'Rake awaiting arrival update',

            description:
              `Rake #${rake.rakeId} has been dispatched and is awaiting arrival confirmation.`,

            referenceType:
              'RAKE',

            referenceId:
              rake.rakeId,

            actionLabel:
              'Open Rake',

            route:
              '/rakes',

            createdAt:
              new Date()

          });

        }

      );


    // ===================================================
    // 7. ARRIVED RAKES AWAITING UNLOADING
    // ===================================================

    this.rakes

      .filter(
        rake =>
          rake.status === 'ARRIVED'
      )

      .forEach(
        rake => {

          const unloadedCount =
            this.unloadings.filter(

              unloading =>

                unloading.consignment?.consignmentId ===
                rake.consignment?.consignmentId

            ).length;


          if (
            unloadedCount <
            rake.wagonCount
          ) {

            generatedAlerts.push({

              id:
                `RAKE-${rake.rakeId}-UNLOADING`,

              type:
                'UNLOADING',

              priority:
                'ACTION',

              title:
                'Rake awaiting unloading',

              description:
                `Rake #${rake.rakeId} has arrived and has pending unloading operations.`,

              referenceType:
                'RAKE',

              referenceId:
                rake.rakeId,

              actionLabel:
                'Open Unloading',

              route:
                '/unloadings',

              createdAt:
                new Date()

            });

          }

        }

      );


    // ===================================================
    // SORT
    // ===================================================

    this.alerts =
      generatedAlerts.sort(

        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime()

      );

  }


  // =====================================================
  // DATE HELPER
  // =====================================================

  private getDateValue(
    value: string | Date | undefined | null
  ): Date {

    if (!value) {

      return new Date();

    }


    const date =
      new Date(value);


    return isNaN(
      date.getTime()
    )
      ? new Date()
      : date;

  }


  // =====================================================
  // FILTERED ALERTS
  // =====================================================

  get filteredAlerts(): OperationalAlert[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.alerts.filter(
      alert => {

        const matchesPriority =
          this.selectedPriority === 'ALL' ||
          alert.priority ===
            this.selectedPriority;


        const matchesModule =
          this.selectedModule === 'ALL' ||
          this.getAlertModule(alert) ===
            this.selectedModule;


        const matchesSearch =
          !search ||
          alert.title
            .toLowerCase()
            .includes(search) ||
          alert.description
            .toLowerCase()
            .includes(search) ||
          String(
            alert.referenceId
          )
            .toLowerCase()
            .includes(search);


        return (
          matchesPriority &&
          matchesModule &&
          matchesSearch
        );

      }

    );

  }


  // =====================================================
  // MODULE
  // =====================================================

  getAlertModule(
    alert: OperationalAlert
  ): AlertModule {

    switch (alert.type) {

      case 'APPROVAL':
        return 'DEMAND';

      case 'ALLOCATION':
        return 'ALLOCATION';

      case 'LOADING':
        return 'LOADING';

      case 'RAKE_FORMATION':
      case 'DISPATCH':
      case 'ARRIVAL':
        return 'RAKE';

      case 'UNLOADING':
        return 'UNLOADING';

      default:
        return 'ALL';

    }

  }


  // =====================================================
  // COUNTS
  // =====================================================

  get totalAlertCount(): number {

    return this.alerts.length;

  }


  get warningAlertCount(): number {

    return this.alerts.filter(
      alert =>
        alert.priority === 'WARNING'
    ).length;

  }


  get actionAlertCount(): number {

    return this.alerts.filter(
      alert =>
        alert.priority === 'ACTION'
    ).length;

  }


  get infoAlertCount(): number {

    return this.alerts.filter(
      alert =>
        alert.priority === 'INFO'
    ).length;

  }


  // =====================================================
  // DISPLAY HELPERS
  // =====================================================

  getPriorityLabel(
    priority: AlertPriority
  ): string {

    switch (priority) {

      case 'WARNING':
        return 'Warning';

      case 'ACTION':
        return 'Action Required';

      case 'INFO':
        return 'Information';

      default:
        return priority;

    }

  }


  getPriorityClass(
    priority: AlertPriority
  ): string {

    switch (priority) {

      case 'WARNING':
        return 'priority-warning';

      case 'ACTION':
        return 'priority-action';

      case 'INFO':
        return 'priority-info';

      default:
        return '';

    }

  }


  getModuleLabel(
    alert: OperationalAlert
  ): string {

    switch (
      this.getAlertModule(alert)
    ) {

      case 'DEMAND':
        return 'Demand';

      case 'ALLOCATION':
        return 'Allocation';

      case 'LOADING':
        return 'Loading';

      case 'RAKE':
        return 'Rake';

      case 'MOVEMENT':
        return 'Movement';

      case 'UNLOADING':
        return 'Unloading';

      default:
        return 'Operations';

    }

  }


}