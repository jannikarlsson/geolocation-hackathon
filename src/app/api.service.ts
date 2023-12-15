import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface HiddenObject {
  id: string;
  latitude: number;
  longitude: number;
  found: boolean;
  nameOfFinder: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient)
  private baseUrl = 'http://localhost:8199/api/'
  // private baseUrl = 'http://localhost:5000/'

  getHiddenObject(): Observable<HiddenObject[]> {
    return this.http.get<HiddenObject[]>(`${this.baseUrl}hidden-object`)
  }

  claimHiddenObject(object: HiddenObject) {
    const body = {
      ...object,
      latitude: object.latitude.toString(),
      longitude: object.longitude.toString(),
    }
    return this.http.patch(`${this.baseUrl}hidden-object/${object.id}`, body).subscribe();
  }
}
