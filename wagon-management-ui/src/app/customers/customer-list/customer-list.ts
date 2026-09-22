import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Customer,
  CustomerService
} from '../customer.service';

import { RouterLink } from '@angular/router';

import {
  LucideCircleAlert,
  LucideCircleCheck,
  LucideDatabase,
  LucideEye,
  LucideRefreshCw,
  LucideTags,
  LucideUsers
} from '@lucide/angular';

@Component({
  selector: 'app-customer-list',
  imports: [
    RouterLink,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideDatabase,
    LucideEye,
    LucideRefreshCw,
    LucideTags,
    LucideUsers
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css'
})
export class CustomerList implements OnInit {

  customers = signal<Customer[]>([]);

  loading = signal(true);

  errorMessage = signal('');

  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.customerService.getAllCustomers().subscribe({

      next: (data) => {

        console.log(
          'Customers received:',
          data.length
        );

        this.customers.set(data);

        this.loading.set(false);

      },

      error: (error) => {

        console.error(
          'Error loading customers:',
          error
        );

        this.errorMessage.set(
          'Unable to load customers.'
        );

        this.loading.set(false);

      }

    });

  }

  getCustomerTypeCount(): number {

    return new Set(
      this.customers()
        .map(customer => customer.customerType)
        .filter(type => !!type)
    ).size;

  }

}
