import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Customer } from '../customers/customer.service';
import { Station } from '../stations/station.service';

export interface Demand {

  demandId: number;

  customer: Customer;

  commodity: string;

  quantity: number;

  requiredWagons: number;

  fromStation: Station;

  toStation: Station;

  status: string;

  demandDate: string;
}

export interface CreateDemandRequest {

  customerId: number;

  commodity: string;

  quantity: number;

  requiredWagons: number;

  fromStationId: number;

  toStationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandService {

  private apiUrl = 'http://localhost:8080/api/demands';

  constructor(
    private http: HttpClient
  ) {}

  getAllDemands(): Observable<Demand[]> {

    return this.http.get<Demand[]>(
      this.apiUrl
    );

  }

  getDemandById(demandId: number): Observable<Demand> {

    return this.http.get<Demand>(
      `${this.apiUrl}/${demandId}`
    );

  }

  createDemand(
    demand: CreateDemandRequest
  ): Observable<Demand> {

    return this.http.post<Demand>(
      this.apiUrl,
      demand
    );

  }

  approveDemand(demandId: number): Observable<Demand> {

    return this.http.put<Demand>(
        `${this.apiUrl}/${demandId}/approve`,
        {}
    );

    }

}