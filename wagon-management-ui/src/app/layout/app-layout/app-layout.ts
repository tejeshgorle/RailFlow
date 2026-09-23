import { Component, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../auth/auth.service';

import {
  LucideLayoutDashboard,
  LucideClipboardList,
  LucideFileText,
  LucidePackageCheck,
  LucidePackagePlus,
  LucideTrainFront,
  LucideRoute,
  LucideHistory,
  LucidePackageMinus,
  LucideMapPin,
  LucideUsers,
  LucideLogOut
} from '@lucide/angular';

@Component({
  selector: 'app-layout',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,

    LucideLayoutDashboard,
    LucideClipboardList,
    LucideFileText,
    LucidePackageCheck,
    LucidePackagePlus,
    LucideTrainFront,
    LucideRoute,
    LucideHistory,
    LucidePackageMinus,
    LucideMapPin,
    LucideUsers,
    LucideLogOut
  ],

  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css'
})
export class AppLayout {

  sidebarCollapsed = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed.update(
      value => !value
    );
  }

  currentSection(): string {

    const url = this.router.url.split('?')[0];

    if (
      url.startsWith('/wagons') ||
      url.startsWith('/stations') ||
      url.startsWith('/customers')
    ) {
      return 'Master Data';
    }

    return 'Operations';
  }

  currentPage(): string {

    const url = this.router.url.split('?')[0];

    if (url === '/dashboard') {
      return 'Dashboard';
    }

    if (url === '/demands') {
      return 'Demand Management';
    }

    if (url === '/demands/add') {
      return 'Register Demand';
    }

    if (url.startsWith('/demands/')) {
      return 'Demand Details';
    }

    if (url === '/consignments') {
      return 'Consignment';
    }

    if (url === '/consignments/add') {
      return 'Create Consignment';
    }

    if (url.startsWith('/consignments/')) {
      return 'Consignment Details';
    }

    if (url === '/allocations/add') {
      return 'Wagon Allocation';
    }

    if (url === '/loadings/add') {
      return 'Wagon Loading';
    }

    if (url === '/rakes/form') {
      return 'Rake Formation';
    }

    if (url === '/rakes') {
      return 'Rake Movement';
    }

    if (url.startsWith('/rakes/')) {
      return 'Rake Details';
    }

    if (url === '/movements') {
      return 'Movement History';
    }

    if (url === '/unloadings/add') {
      return 'Unloading';
    }

    if (url === '/unloadings/release') {
      return 'Wagon Release';
    }

    if (url === '/wagons') {
      return 'Wagons';
    }

    if (url === '/wagons/add') {
      return 'Add Wagon';
    }

    if (url.startsWith('/wagons/')) {
      return 'Wagon Details';
    }

    if (url === '/stations') {
      return 'Stations';
    }

    if (url.startsWith('/stations/')) {
      return 'Station Details';
    }

    if (url === '/customers') {
      return 'Customers';
    }

    if (url.startsWith('/customers/')) {
      return 'Customer Details';
    }

    return 'Operations';
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  get loggedInUsername(): string {
    return localStorage.getItem(
      'railflow_username'
    ) || 'Operator';
  }

  get loggedInRole(): string {
    return localStorage.getItem(
      'railflow_role'
    ) || 'OPERATOR';
  }

  get userInitials(): string {
    return this.loggedInUsername
      .substring(0, 2)
      .toUpperCase();
  }
}