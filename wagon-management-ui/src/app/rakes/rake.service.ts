import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rake {
  rakeId: number;
  rakeNumber: string;
  status: string;
  wagonCount: number;

  formationTime: string;
  dispatchTime: string | null;

  fromStation: {
    stationId: number;
    stationCode: string;
    stationName: string;
    zone: string;
    division: string;
  };

  toStation: {
    stationId: number;
    stationCode: string;
    stationName: string;
    zone: string;
    division: string;
  };

  consignment: {
    consignmentId: number;
    commodity: string;
    quantity: number;
    demandId: number;

    consignorId: number;
    consignorName: string;

    consigneeId: number;
    consigneeName: string;
  };
}

export interface RakeDetails extends Rake {
  wagons: RakeWagonDetails[];
}

export interface RakeWagonDetails {
  sequenceNumber: number;
  wagonId: number;
  wagonNumber: string;
  wagonType: string;
  capacity: number;
  status: string;
}

export interface CreateRakeRequest {
  consignmentId: number;
  rakeNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class RakeService {

  private apiUrl = 'http://localhost:8080/api/rakes';

  constructor(private http: HttpClient) {}

  // ---------------------------------------------
  // Get all rakes
  // ---------------------------------------------

  getAllRakes(): Observable<Rake[]> {
    return this.http.get<Rake[]>(this.apiUrl);
  }

  // ---------------------------------------------
  // Get rake details
  // ---------------------------------------------

  getRakeDetails(rakeId: number): Observable<RakeDetails> {
    return this.http.get<RakeDetails>(
      `${this.apiUrl}/${rakeId}`
    );
  }

  // ---------------------------------------------
  // Form rake
  // ---------------------------------------------

  formRake(request: CreateRakeRequest): Observable<Rake> {
    return this.http.post<Rake>(
      this.apiUrl,
      request
    );
  }

  // ---------------------------------------------
  // Dispatch rake
  // ---------------------------------------------

  dispatchRake(rakeId: number): Observable<Rake> {
    return this.http.put<Rake>(
      `${this.apiUrl}/${rakeId}/dispatch`,
      {}
    );
  }

  // ---------------------------------------------
  // Arrive rake
  // ---------------------------------------------

  arriveRake(rakeId: number): Observable<Rake> {
    return this.http.put<Rake>(
      `${this.apiUrl}/${rakeId}/arrive`,
      {}
    );
  }
}