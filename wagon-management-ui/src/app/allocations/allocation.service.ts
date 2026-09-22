import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WagonAllocation {

  allocationId: number;

  wagon: {
    wagonId: number;
    wagonNumber: string;
    wagonType: string;
    capacity: number;
    status: string;
  };

  consignment: {
    consignmentId: number;
    commodity: string;
    quantity: number;
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