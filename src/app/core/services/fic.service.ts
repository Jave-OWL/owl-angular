import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FIC } from '../models/FIC.model';

@Injectable({
  providedIn: 'root'
})
export class FICService {

  constructor(
    private http: HttpClient
  ) { }

  url = 'http://localhost:8080/fic';

  findAll(): Observable<FIC[]> {
    return this.http.get<FIC[]>(`${this.url}/list`);
  }

  findById(id: number): Observable<FIC> {
    return this.http.get<FIC>(`${this.url}/${id}`);
  }


  findByRecomendacion(): Observable<FIC[]> {
  return this.http.get<FIC[]>(`${this.url}/listRecomendados`);
  }

}
