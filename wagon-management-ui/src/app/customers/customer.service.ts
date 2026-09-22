import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  customerId: number;
  customerName: string;
  customerType: string;
  address: string;
  contactNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(
    private http: HttpClient
  ) {}

  getAllCustomers(): Observable<Customer[]> {

    return this.http.get<Customer[]>(
      this.apiUrl
    );

  }

  getCustomerById(customerId: number): Observable<Customer> {

    return this.http.get<Customer>(
        `${this.apiUrl}/${customerId}`
    );

    }

}