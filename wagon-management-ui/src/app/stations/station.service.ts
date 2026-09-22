import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Station {
  stationId: number;
  stationCode: string;
  stationName: string;
  zone: string;
  division: string;
}

@Injectable({
  providedIn: 'root'
})
export class StationService {

  private apiUrl = 'http://localhost:8080/api/stations';

  constructor(private http: HttpClient) {}

  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.apiUrl);
  }

  getStationById(stationId: number): Observable<Station> {

    return this.http.get<Station>(
      `${this.apiUrl}/${stationId}`
    );

  }
}