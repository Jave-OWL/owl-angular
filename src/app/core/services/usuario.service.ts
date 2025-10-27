import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarPrediccion(perfilRiesgo: string, rangoDias: string, pactoPermanencia: string) {
    const body = {
      perfilRiesgo,
      rangoDias,
      pactoPermanencia
    };
    return this.http.post(`${this.apiUrl}/prediccion`, body);
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/me`);
  }
}
