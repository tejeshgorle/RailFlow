import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { AppLayout } from './layout/app-layout/app-layout';

import { Dashboard } from './dashboard/dashboard';

import { WagonList } from './wagons/wagon-list/wagon-list';
import { AddWagon } from './wagons/add-wagon/add-wagon';
import { WagonDetails } from './wagons/wagon-details/wagon-details';

import { StationList } from './stations/station-list/station-list';
import { StationDetails } from './stations/station-details/station-details';

import { CustomerList } from './customers/customer-list/customer-list';
import { CustomerDetails } from './customers/customer-details/customer-details';

import { DemandList } from './demands/demand-list/demand-list';
import { DemandDetails } from './demands/demand-details/demand-details';
import { AddDemand } from './demands/add-demand/add-demand';

import { AddAllocation } from './allocations/add-allocation/add-allocation';

import { AddConsignment } from './consignments/add-consignment/add-consignment';
import { ConsignmentList } from './consignments/consignment-list/consignment-list';
import { ConsignmentDetails } from './consignments/consignment-details/consignment-details';

import { AddLoading } from './loadings/add-loading/add-loading';

import { FormRake } from './rakes/form-rake/form-rake';
import { RakeList } from './rakes/rake-list/rake-list';
import { RakeDetailsComponent } from './rakes/rake-details/rake-details';

import { AddUnloading } from './unloadings/add-unloading/add-unloading';
import { ReleaseWagon } from './unloadings/release-wagon/release-wagon';

import { MovementHistory } from './movements/movement-history/movement-history';


export const routes: Routes = [

  // =====================================================
  // ROOT
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  {
    path: 'login',
    component: Login
  },


  // =====================================================
  // APPLICATION LAYOUT
  // =====================================================

  {
    path: '',
    component: AppLayout,

    children: [

      // ===================================================
      // DASHBOARD
      // ===================================================

      {
        path: 'dashboard',
        component: Dashboard
      },


      // ===================================================
      // DEMANDS
      // ===================================================

      {
        path: 'demands',
        component: DemandList
      },

      {
        path: 'demands/add',
        component: AddDemand
      },

      {
        path: 'demands/:id',
        component: DemandDetails
      },


      // ===================================================
      // CONSIGNMENT
      // ===================================================

      {
        path: 'consignments',
        component: ConsignmentList
      },

      {
        path: 'consignments/add',
        component: AddConsignment
      },

      {
        path: 'consignments/:id',
        component: ConsignmentDetails
      },


      // ===================================================
      // WAGON ALLOCATION
      // ===================================================

      {
        path: 'allocations/add',
        component: AddAllocation
      },


      // ===================================================
      // LOADING
      // ===================================================

      {
        path: 'loadings/add',
        component: AddLoading
      },


      // ===================================================
      // RAKE OPERATIONS
      // ===================================================

      {
        path: 'rakes/form',
        component: FormRake
      },

      {
        path: 'rakes',
        component: RakeList
      },

      {
        path: 'rakes/:id',
        component: RakeDetailsComponent
      },


      // ===================================================
      // UNLOADING
      // ===================================================

      {
        path: 'unloadings/add',
        component: AddUnloading
      },

      {
        path: 'unloadings/release',
        component: ReleaseWagon
      },


      // ===================================================
      // WAGONS
      // ===================================================

      {
        path: 'wagons',
        component: WagonList
      },

      {
        path: 'wagons/add',
        component: AddWagon
      },

      {
        path: 'wagons/:id',
        component: WagonDetails
      },


      // ===================================================
      // STATIONS
      // ===================================================

      {
        path: 'stations',
        component: StationList
      },

      {
        path: 'stations/:id',
        component: StationDetails
      },


      // ===================================================
      // CUSTOMERS
      // ===================================================

      {
        path: 'customers',
        component: CustomerList
      },

      {
        path: 'customers/:id',
        component: CustomerDetails
      },


      // ===================================================
      // MOVEMENT HISTORY
      // ===================================================

      {
        path: 'movements',
        component: MovementHistory
      }

    ]
  },


  // =====================================================
  // UNKNOWN ROUTES
  // =====================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];