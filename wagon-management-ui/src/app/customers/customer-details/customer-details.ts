import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  Customer,
  CustomerService
} from '../customer.service';

import {
  LucideArrowLeft,
  LucideCircleAlert,
  LucideUserRound
} from '@lucide/angular';

@Component({
  selector: 'app-customer-details',
  imports: [
    RouterLink,
    LucideArrowLeft,
    LucideCircleAlert,
    LucideUserRound
  ],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css'
})
export class CustomerDetails implements OnInit {

  customer = signal<Customer | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {

    const customerId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log(
      'Customer ID from URL:',
      customerId
    );

    if (!customerId) {

      this.errorMessage.set(
        'Invalid customer ID.'
      );

      this.loading.set(false);

      return;
    }

    this.loadCustomer(customerId);
  }

  loadCustomer(customerId: number): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.customerService
      .getCustomerById(customerId)
      .subscribe({

        next: (data) => {

          console.log(
            'Customer received:',
            data
          );

          this.customer.set(data);

          this.loading.set(false);

        },

        error: (error) => {

          console.error(
            'Error loading customer:',
            error
          );

          this.errorMessage.set(
            'Unable to load customer.'
          );

          this.loading.set(false);

        }

      });

  }

}
