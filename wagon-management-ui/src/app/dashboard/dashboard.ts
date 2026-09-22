
import {
  LucideArrowRight,
  LucideCircleCheck,
  LucideClipboardCheck,
  LucideClipboardList,
  LucideInfo,
  LucideMapPin,
  LucidePackageCheck,
  LucidePackageMinus,
  LucidePackagePlus,
  LucideRefreshCw,
  LucideSend,
  LucideTrainFront,
  LucideTriangleAlert
} from '@lucide/angular';

import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  DatePipe
} from '@angular/common';

import {
  Wagon,
  WagonService
} from '../wagons/wagon.service';

import {
  Demand,
  DemandService
} from '../demands/demand.service';

import {
  Rake,
  RakeService
} from '../rakes/rake.service';

import {
  Consignment,
  ConsignmentService
} from '../consignments/consignment.service';

import {
  UnloadingService
} from '../unloadings/unloading.service';

import {
  Subscription
} from 'rxjs';


type DemandFilter =
  | 'ALL'
  | 'REGISTERED'
  | 'APPROVED'
  | 'WAGONS_ALLOCATED'
  | 'LOADED'
  | 'DELIVERED';

type DashboardRole =
  | 'OPERATOR'
  | 'SUPERVISOR'
  | 'ADMIN';

type DashboardAction =
  | 'REGISTER_DEMAND'
  | 'APPROVE_DEMAND'
  | 'ALLOCATE_WAGON'
  | 'LOAD_WAGON'
  | 'FORM_RAKE'
  | 'DISPATCH_RAKE'
  | 'ARRIVE_RAKE'
  | 'UNLOAD_WAGON';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe,
    LucideArrowRight,
    LucideCircleCheck,
    LucideClipboardCheck,
    LucideClipboardList,
    LucideInfo,
    LucideMapPin,
    LucidePackageCheck,
    LucidePackageMinus,
    LucidePackagePlus,
    LucideRefreshCw,
    LucideSend,
    LucideTrainFront,
    LucideTriangleAlert
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  // =====================================================
  // DATA
  // =====================================================

  wagons = signal<Wagon[]>([]);
  demands = signal<Demand[]>([]);
  rakes = signal<Rake[]>([]);
  consignments = signal<Consignment[]>([]);
  unloadings = signal<any[]>([]);


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = signal(true);

  isRefreshing = signal(false);

  hasLoadedOnce = signal(false);

  errorMessage = signal('');

  lastRefreshTime = signal<Date | null>(null);


  // =====================================================
  // FUTURE AUTHENTICATION / RBAC
  // =====================================================

  /*
   * Temporary role bridge.
   *
   * Later this should come from the actual authentication
   * service / JWT instead of localStorage.
   *
   * Example:
   *
   * localStorage.setItem('railflow.userRole', 'SUPERVISOR');
   */

  userRole = signal<DashboardRole>(
    this.resolveUserRole()
  );


  // =====================================================
  // LIVE REFRESH
  // =====================================================

  /*
   * Dashboard refreshes automatically every 15 seconds.
   *
   * This makes changes performed from other screens
   * appear on the dashboard without requiring the user
   * to manually press Refresh.
   */

  private readonly liveRefreshIntervalMs = 15000;

  private liveRefreshSubscription?: Subscription;


  // =====================================================
  // DEMAND FILTERING
  // =====================================================

  selectedDemandFilter =
    signal<DemandFilter>('ALL');


  // =====================================================
  // WAGON STATISTICS
  // =====================================================

  availableWagons = signal(0);

  allocatedWagons = signal(0);

  loadedWagons = signal(0);

  emptyWagons = signal(0);

  totalWagons = signal(0);


  // =====================================================
  // DEMAND STATISTICS
  // =====================================================

  registeredDemands = signal(0);

  approvedDemands = signal(0);

  allocatedDemands = signal(0);

  loadedDemands = signal(0);

  deliveredDemands = signal(0);

  totalDemands = signal(0);


  // =====================================================
  // RAKE STATISTICS
  // =====================================================

  formedRakes = signal(0);

  dispatchedRakes = signal(0);

  arrivedRakes = signal(0);

  totalRakes = signal(0);


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private wagonService: WagonService,
    private demandService: DemandService,
    private rakeService: RakeService,
    private consignmentService: ConsignmentService,
    private unloadingService: UnloadingService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    /*
     * Initial dashboard load.
     */

    this.loadDashboard();


    /*
     * Automatic live refresh.
     *
     * We use polling because the current backend does not
     * expose WebSocket/SSE events yet.
     */

    this.liveRefreshSubscription =
      new Subscription();


    const refreshTimer =
      window.setInterval(() => {

        /*
         * Do not start another refresh while one is
         * already running.
         */

        if (
          !this.loading() &&
          !this.isRefreshing()
        ) {

          this.loadDashboard();

        }

      }, this.liveRefreshIntervalMs);


    /*
     * Add the browser timer to the subscription so
     * it can be cleaned up when the dashboard is destroyed.
     */

    this.liveRefreshSubscription.add({

      unsubscribe: () => {

        window.clearInterval(refreshTimer);

      }

    });

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.liveRefreshSubscription?.unsubscribe();

  }


  // =====================================================
  // LOAD / REFRESH DASHBOARD
  // =====================================================

  loadDashboard(): void {

    const firstLoad =
      !this.hasLoadedOnce();


    /*
     * First load:
     *
     * Show skeleton loading.
     *
     * Subsequent refresh:
     *
     * Keep the existing dashboard visible and show
     * refresh state instead.
     */

    if (firstLoad) {

      this.loading.set(true);

    } else {

      this.isRefreshing.set(true);

    }


    this.errorMessage.set('');


    let completedRequests = 0;

    /*
     * Five backend data sources:
     *
     * 1. Wagons
     * 2. Demands
     * 3. Rakes
     * 4. Consignments
     * 5. Unloadings
     */

    const totalRequests = 5;

    const errors: string[] = [];


    const checkComplete = (): void => {

      completedRequests++;


      if (
        completedRequests ===
        totalRequests
      ) {

        this.loading.set(false);

        this.isRefreshing.set(false);

        this.hasLoadedOnce.set(true);

        this.lastRefreshTime.set(
          new Date()
        );


        /*
         * Partial failure should not destroy the
         * complete dashboard.
         */

        if (errors.length > 0) {

          this.errorMessage.set(
            `${errors.length} dashboard data source${errors.length > 1 ? 's are' : ' is'} unavailable. Showing the available data.`
          );

        }

      }

    };


    // ===================================================
    // WAGONS
    // ===================================================

    this.wagonService
      .getAllWagons()
      .subscribe({

        next: (data) => {

          this.wagons.set(data);

          this.calculateWagonStatistics(
            data
          );

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Dashboard wagon error:',
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

        next: (data) => {

          this.demands.set(data);

          this.calculateDemandStatistics(
            data
          );

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Dashboard demand error:',
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

        next: (data) => {

          this.rakes.set(data);

          this.calculateRakeStatistics(
            data
          );

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Dashboard rake error:',
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

        next: (data) => {

          this.consignments.set(data);

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Dashboard consignment error:',
            error
          );

          errors.push('consignment');

          checkComplete();

        }

      });


    // ===================================================
    // UNLOADING RECORDS
    // ===================================================

    /*
     * Used to determine whether an ARRIVED rake still
     * has unloading work pending.
     */

    this.unloadingService
      .getAllUnloadings()
      .subscribe({

        next: (data) => {

          this.unloadings.set(data);

          checkComplete();

        },

        error: (error) => {

          console.error(
            'Dashboard unloading error:',
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

  refreshDashboard(): void {

    if (
      this.loading() ||
      this.isRefreshing()
    ) {

      return;

    }

    this.loadDashboard();

  }


  // =====================================================
  // WAGON STATISTICS
  // =====================================================

  calculateWagonStatistics(
    wagons: Wagon[]
  ): void {

    this.totalWagons.set(
      wagons.length
    );


    this.availableWagons.set(
      wagons.filter(
        wagon =>
          wagon.status === 'AVAILABLE'
      ).length
    );


    this.allocatedWagons.set(
      wagons.filter(
        wagon =>
          wagon.status === 'ALLOCATED'
      ).length
    );


    this.loadedWagons.set(
      wagons.filter(
        wagon =>
          wagon.status === 'LOADED'
      ).length
    );


    this.emptyWagons.set(
      wagons.filter(
        wagon =>
          wagon.status === 'EMPTY'
      ).length
    );

  }


  // =====================================================
  // DEMAND STATISTICS
  // =====================================================

  calculateDemandStatistics(
    demands: Demand[]
  ): void {

    this.totalDemands.set(
      demands.length
    );


    this.registeredDemands.set(
      demands.filter(
        demand =>
          demand.status === 'REGISTERED'
      ).length
    );


    this.approvedDemands.set(
      demands.filter(
        demand =>
          demand.status === 'APPROVED'
      ).length
    );


    this.allocatedDemands.set(
      demands.filter(
        demand =>
          demand.status === 'WAGONS_ALLOCATED'
      ).length
    );


    this.loadedDemands.set(
      demands.filter(
        demand =>
          demand.status === 'LOADED'
      ).length
    );


    this.deliveredDemands.set(
      demands.filter(
        demand =>
          demand.status === 'DELIVERED'
      ).length
    );

  }


  // =====================================================
  // RAKE STATISTICS
  // =====================================================

  calculateRakeStatistics(
    rakes: Rake[]
  ): void {

    this.totalRakes.set(
      rakes.length
    );


    this.formedRakes.set(
      rakes.filter(
        rake =>
          rake.status === 'FORMED'
      ).length
    );


    this.dispatchedRakes.set(
      rakes.filter(
        rake =>
          rake.status === 'DISPATCHED'
      ).length
    );


    this.arrivedRakes.set(
      rakes.filter(
        rake =>
          rake.status === 'ARRIVED'
      ).length
    );

  }


  // =====================================================
  // ACTIVE DEMANDS
  // =====================================================

  getActiveDemands(): number {

    return (

      this.registeredDemands() +

      this.approvedDemands() +

      this.allocatedDemands() +

      this.loadedDemands()

    );

  }


  // =====================================================
  // ACTIVE RAKES
  // =====================================================

  getActiveRakes(): number {

    return (

      this.formedRakes() +

      this.dispatchedRakes()

    );

  }


  // =====================================================
  // LOADED DEMANDS AWAITING RAKE
  // =====================================================

  getLoadedDemandsAwaitingRake(): number {

    /*
     * Collect consignments that already have a rake.
     */

    const rakeConsignmentIds =
      new Set(

        this.rakes()

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


    /*
     * A LOADED demand requires rake formation
     * when its consignment does not already belong
     * to a rake.
     */

    return this.demands()
      .filter(
        demand =>

          demand.status === 'LOADED' &&

          this.consignments()

            .filter(
              consignment =>

                consignment.demand?.demandId ===
                demand.demandId

            )

            .some(
              consignment =>

                !rakeConsignmentIds.has(
                  consignment.consignmentId
                )

            )

      ).length;

  }


  // =====================================================
  // ARRIVED RAKES AWAITING UNLOADING
  // =====================================================

  getArrivedRakesAwaitingUnloading(): number {

    return this.rakes()

      .filter(
        rake =>
          rake.status === 'ARRIVED'
      )

      .filter(
        rake => {

          const unloadedCount =
            this.unloadings()

              .filter(
                unloading =>

                  unloading.consignment?.consignmentId ===
                  rake.consignment?.consignmentId

              ).length;


          return (
            unloadedCount <
            rake.wagonCount
          );

        }

      ).length;

  }


  // =====================================================
  // TOTAL OPERATIONAL ATTENTION
  // =====================================================

  getAttentionTotal(): number {

    return (

      /*
       * Demands awaiting approval
       */

      this.registeredDemands() +

      /*
       * Approved demands awaiting allocation
       */

      this.approvedDemands() +

      /*
       * Allocated demands awaiting loading
       */

      this.allocatedDemands() +

      /*
       * Loaded demands awaiting rake formation
       */

      this.getLoadedDemandsAwaitingRake() +

      /*
       * Formed rakes awaiting dispatch
       */

      this.formedRakes() +

      /*
       * Dispatched rakes awaiting arrival
       */

      this.dispatchedRakes() +

      /*
       * Arrived rakes awaiting unloading
       */

      this.getArrivedRakesAwaitingUnloading()

    );

  }


  // =====================================================
  // WAGON UTILIZATION
  // =====================================================

  getWagonUtilization(): number {

    const total =
      this.totalWagons();


    if (total === 0) {

      return 0;

    }


    const active =
      this.allocatedWagons() +
      this.loadedWagons();


    return Math.round(
      (active / total) * 100
    );

  }


  // =====================================================
  // FLEET PERCENTAGE
  // =====================================================

  getFleetPercentage(
    count: number
  ): number {

    const total =
      this.totalWagons();


    if (total === 0) {

      return 0;

    }


    return Math.round(
      (count / total) * 100
    );

  }


  // =====================================================
  // DEMAND FILTER
  // =====================================================

  setDemandFilter(
    filter: DemandFilter
  ): void {

    this.selectedDemandFilter.set(
      filter
    );

  }


  // =====================================================
  // FILTERED DEMANDS
  // =====================================================

  getFilteredDemands(): Demand[] {

    const filter =
      this.selectedDemandFilter();


    const filtered =
      filter === 'ALL'

        ? this.demands()

        : this.demands().filter(
            demand =>
              demand.status === filter
          );


    return [...filtered]

      .sort(
        (a, b) =>

          new Date(
            b.demandDate
          ).getTime() -

          new Date(
            a.demandDate
          ).getTime()

      )

      .slice(0, 6);

  }


  // =====================================================
  // ATTENTION LABEL
  // =====================================================

  getAttentionLabel(
    action: DashboardAction
  ): string {

    switch (action) {

      case 'APPROVE_DEMAND':

        return 'Review and approve registered demands';

      case 'ALLOCATE_WAGON':

        return 'Assign available wagons to approved demands';

      case 'LOAD_WAGON':

        return 'Record loading for allocated wagons';

      case 'FORM_RAKE':

        return 'Form rakes from fully loaded consignments';

      case 'DISPATCH_RAKE':

        return 'Dispatch formed rakes';

      case 'ARRIVE_RAKE':

        return 'Mark dispatched rakes as arrived';

      case 'UNLOAD_WAGON':

        return 'Record unloading for arrived rakes';

      default:

        return '';

    }

  }


  // =====================================================
  // FILTER FROM ATTENTION
  // =====================================================

  filterFromAttention(
    filter: DemandFilter
  ): void {

    this.selectedDemandFilter.set(
      filter
    );


    setTimeout(() => {

      document
        .getElementById(
          'recent-demands'
        )
        ?.scrollIntoView({

          behavior: 'smooth',

          block: 'start'

        });

    });

  }


  // =====================================================
  // DEMAND FILTER COUNT
  // =====================================================

  getDemandFilterCount(
    filter: DemandFilter
  ): number {

    switch (filter) {

      case 'REGISTERED':

        return this.registeredDemands();

      case 'APPROVED':

        return this.approvedDemands();

      case 'WAGONS_ALLOCATED':

        return this.allocatedDemands();

      case 'LOADED':

        return this.loadedDemands();

      case 'DELIVERED':

        return this.deliveredDemands();

      default:

        return this.totalDemands();

    }

  }


  // =====================================================
  // CURRENT TRANSIT RAKES
  // =====================================================

  getTransitRakes(): Rake[] {

    /*
     * Only actual DISPATCHED rakes are displayed.
     *
     * The newest dispatched rake is shown first.
     */

    return [...this.rakes()]

      .filter(
        rake =>
          rake.status === 'DISPATCHED'
      )

      .sort(
        (a, b) =>

          new Date(
            b.dispatchTime ?? 0
          ).getTime() -

          new Date(
            a.dispatchTime ?? 0
          ).getTime()

      )

      .slice(0, 3);

  }


  // =====================================================
  // ROLE / PERMISSION BRIDGE
  // =====================================================

  /*
   * Temporary frontend permission map.
   *
   * IMPORTANT:
   *
   * This is only for controlling dashboard visibility.
   * The Spring Boot backend must remain the authoritative
   * authorization layer.
   *
   * When JWT authentication is implemented, this map can
   * be replaced by permissions received from the backend.
   */

  private readonly rolePermissions:
    Record<
      DashboardRole,
      DashboardAction[]
    > = {

      OPERATOR: [

        'REGISTER_DEMAND',

        'APPROVE_DEMAND',

        'ALLOCATE_WAGON',

        'LOAD_WAGON',

        'FORM_RAKE',

        'DISPATCH_RAKE',

        'ARRIVE_RAKE',

        'UNLOAD_WAGON'

      ],


      SUPERVISOR: [

        'REGISTER_DEMAND',

        'APPROVE_DEMAND',

        'ALLOCATE_WAGON',

        'LOAD_WAGON',

        'FORM_RAKE',

        'DISPATCH_RAKE',

        'ARRIVE_RAKE',

        'UNLOAD_WAGON'

      ],


      ADMIN: [

        'REGISTER_DEMAND',

        'APPROVE_DEMAND',

        'ALLOCATE_WAGON',

        'LOAD_WAGON',

        'FORM_RAKE',

        'DISPATCH_RAKE',

        'ARRIVE_RAKE',

        'UNLOAD_WAGON'

      ]

    };


  // =====================================================
  // CHECK PERMISSION
  // =====================================================

  canPerformAction(
    action: DashboardAction
  ): boolean {

    return this.rolePermissions[
      this.userRole()
    ].includes(action);

  }


  // =====================================================
  // RESOLVE CURRENT USER ROLE
  // =====================================================

  private resolveUserRole():
    DashboardRole {

    /*
     * Temporary authentication bridge.
     *
     * Future:
     *
     * Replace this with something like:
     *
     * authService.getCurrentUserRole()
     *
     * or a JWT claim.
     */

    const storedRole =
      localStorage.getItem(
        'railflow.userRole'
      );


    if (

      storedRole === 'OPERATOR' ||

      storedRole === 'SUPERVISOR' ||

      storedRole === 'ADMIN'

    ) {

      return storedRole;

    }


    /*
     * Default role while authentication is
     * not yet implemented.
     */

    return 'OPERATOR';

  }


  // =====================================================
  // DEMAND STATUS CLASS
  // =====================================================

  getDemandStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'REGISTERED':

        return 'registered';

      case 'APPROVED':

        return 'approved';

      case 'WAGONS_ALLOCATED':

        return 'allocated';

      case 'LOADED':

        return 'loaded';

      case 'DELIVERED':

        return 'delivered';

      default:

        return '';

    }

  }


  // =====================================================
  // DEMAND STATUS LABEL
  // =====================================================

  getDemandStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'REGISTERED':

        return 'REGISTERED';

      case 'APPROVED':

        return 'APPROVED';

      case 'WAGONS_ALLOCATED':

        return 'ALLOCATED';

      case 'LOADED':

        return 'LOADED';

      case 'DELIVERED':

        return 'DELIVERED';

      default:

        return status;

    }

  }

}