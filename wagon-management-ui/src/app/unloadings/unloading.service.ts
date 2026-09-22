import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Wagon } from '../wagons/wagon.service';
import { Consignment } from '../consignments/consignment.service';


// =====================================================
// UNLOADING RESPONSE
// =====================================================

export interface Unloading {

  unloadingId: number;

  wagon: Wagon;

  consignment: Consignment;

  unloadedQuantity: number;

  unloadingTime: string;

  unloadingStatus: string;

}


// =====================================================
// CREATE UNLOADING REQUEST
// =====================================================

export interface CreateUnloadingRequest {

  wagonId: number;

  consignmentId: number;

  unloadedQuantity: number;

}


// =====================================================
// SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class UnloadingService {

  private apiUrl =
    'http://localhost:8080/api/unloadings';

  constructor(
    private http: HttpClient
  ) {}


  // -------------------------------------------------
  // GET ALL UNLOADING RECORDS
  // -------------------------------------------------

  getAllUnloadings(): Observable<Unloading[]> {

    return this.http.get<Unloading[]>(
      this.apiUrl
    );

  }


  // -------------------------------------------------
  // UNLOAD WAGON
  // -------------------------------------------------

  unloadWagon(
    request: CreateUnloadingRequest
  ): Observable<Unloading> {

    return this.http.post<Unloading>(
      this.apiUrl,
      request
    );

  }


  // -------------------------------------------------
  // RELEASE WAGON
  // -------------------------------------------------

  releaseWagon(
    wagonId: number
  ): Observable<Wagon> {

    return this.http.put<Wagon>(
      `${this.apiUrl}/release/${wagonId}`,
      {}
    );

  }

}