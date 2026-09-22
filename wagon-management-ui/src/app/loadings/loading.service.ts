import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Wagon } from '../wagons/wagon.service';
import { Consignment } from '../consignments/consignment.service';

export interface Loading {
  loadingId: number;
  wagon: Wagon;
  consignment: Consignment;
  loadedQuantity: number;
  loadingTime: string;
  loadingStatus: string;
}

export interface CreateLoadingRequest {
  wagonId: number;
  consignmentId: number;
  loadedQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private apiUrl = 'http://localhost:8080/api/loadings';

  constructor(private http: HttpClient) {}

  getAllLoadings(): Observable<Loading[]> {
    return this.http.get<Loading[]>(this.apiUrl);
  }

  loadWagon(request: CreateLoadingRequest): Observable<Loading> {
    return this.http.post<Loading>(this.apiUrl, request);
  }
}