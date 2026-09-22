import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Wagon } from '../wagons/wagon.service';
import { Station } from '../stations/station.service';

export interface Movement {

  movementId: number;

  wagon: Wagon;

  fromStation: Station;

  toStation: Station;

  movementTime: string;
}


@Injectable({
  providedIn: 'root'
})
export class MovementService {

  private apiUrl =
    'http://localhost:8080/api/movements';


  constructor(
    private http: HttpClient
  ) {}


  getAllMovements(): Observable<Movement[]> {

    return this.http.get<Movement[]>(
      this.apiUrl
    );

  }

}