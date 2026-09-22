import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Customer } from '../customers/customer.service';
import { Station } from '../stations/station.service';


export interface Consignment {

  consignmentId: number;

  consignor: Customer;

  consignee: Customer;

  commodity: string;

  quantity: number;

  fromStation: Station;

  toStation: Station;

  demand: {
    demandId: number;
    status: string;
    requiredWagons: number;
  } | null;

}


export interface CreateConsignmentFromDemandRequest {

  demandId: number;

  consigneeId: number;

}


@Injectable({
  providedIn: 'root'
})
export class ConsignmentService {

  private apiUrl = 'http://localhost:8080/api/consignments';


  constructor(
    private http: HttpClient
  ) {}


  getAllConsignments(): Observable<Consignment[]> {

    return this.http.get<Consignment[]>(
      this.apiUrl
    );

  }


  getConsignmentById(
    consignmentId: number
  ): Observable<Consignment> {

    return this.http.get<Consignment>(
      `${this.apiUrl}/${consignmentId}`
    );

  }


  createConsignmentFromDemand(
    request: CreateConsignmentFromDemandRequest
  ): Observable<Consignment> {

    return this.http.post<Consignment>(
      `${this.apiUrl}/from-demand`,
      request
    );

  }

}