import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Wagon {
  wagonId: number;
  wagonNumber: string;
  wagonType: string;
  capacity: number;
  status: string;

  station: {
    stationId: number;
    stationCode: string | null;
    stationName: string | null;
    zone: string | null;
    division: string | null;
  };
}

export interface CreateWagonRequest {
  wagonNumber: string;
  wagonType: string;
  capacity: number;

  station: {
    stationId: number;
  };
}

export interface UpdateWagonRequest {
  wagonNumber: string;
  wagonType: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class WagonService {

  private apiUrl = 'http://localhost:8080/api/wagons';

  constructor(private http: HttpClient) {}

  getAllWagons(): Observable<Wagon[]> {

    return this.http.get<Wagon[]>(this.apiUrl);

  }

  createWagon(wagon: CreateWagonRequest): Observable<Wagon> {

    return this.http.post<Wagon>(
      this.apiUrl,
      wagon
    );

  }

  updateWagon(
    wagonId: number,
    wagon: UpdateWagonRequest
  ): Observable<Wagon> {

    return this.http.put<Wagon>(
      `${this.apiUrl}/${wagonId}`,
      wagon
    );

  }

  deleteWagon(wagonId: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${wagonId}`,
      {
        responseType: 'text'
      }
    );

  }

  getWagonById(wagonId: number): Observable<Wagon> {

    return this.http.get<Wagon>(
      `${this.apiUrl}/${wagonId}`
    );

  }

}