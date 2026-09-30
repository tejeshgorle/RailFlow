import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AllocationStation {
  stationId: number;
  stationCode: string;
  stationName: string;
  zone: string;
  division: string;
}

export interface AllocationCustomer {
  customerId: number;
  customerName: string;
  customerType: string;
  address: string;
  contactNumber: string;
}

export interface AllocationWagon {
  wagonId: number;
  wagonNumber: string;
  wagonType: string;
  capacity: number;
  status: string;
  station?: AllocationStation | null;
}

export interface AllocationConsignment {
  consignmentId: number;
  commodity: string;
  quantity: number;
  consignor?: AllocationCustomer | null;
  consignee?: AllocationCustomer | null;
  fromStation?: AllocationStation | null;
  toStation?: AllocationStation | null;
  demand?: {
    demandId: number;
    status: string;
    requiredWagons: number;
  } | null;
}

export interface WagonAllocation {
  allocationId: number;
  allocatedAt: string;
  allocationStatus: string;

  wagon: {
    wagonId: number;
    wagonNumber: string;
    wagonType: string;
    capacity: number;
    status: string;
    station?: {
      stationId: number;
      stationCode: string;
      stationName: string;
      zone: string;
      division: string;
    } | null;
  };

  consignment: {
    consignmentId: number;
    commodity: string;
    quantity: number;
    fromStation?: {
      stationId: number;
      stationCode: string;
      stationName: string;
      zone: string;
      division: string;
    } | null;
    toStation?: {
      stationId: number;
      stationCode: string;
      stationName: string;
      zone: string;
      division: string;
    } | null;
  };
}

export interface CreateAllocationRequest {
  wagonId: number;
  consignmentId: number;
}
@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  private apiUrl = 'http://localhost:8080/api/allocations';

  constructor(
    private http: HttpClient
  ) {}

  getAllAllocations(): Observable<WagonAllocation[]> {

    return this.http.get<WagonAllocation[]>(
      this.apiUrl
    );

  }

  allocateWagon(
    allocation: CreateAllocationRequest
  ): Observable<WagonAllocation> {

    return this.http.post<WagonAllocation>(
      this.apiUrl,
      allocation
    );

  }

}