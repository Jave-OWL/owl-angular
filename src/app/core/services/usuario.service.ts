import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = `${environment.apiUrl}/usuario`;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  enviarPrediccion(perfilRiesgo: string, rangoDias: string, pactoPermanencia: string) {
    const body = {
      perfilRiesgo,
      rangoDias,
      pactoPermanencia
    };
    return this.http.post(`${this.apiUrl}/prediccion`, body);
  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/list`);
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/me`);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  actualizarUsuario(datosActualizados: Partial<Usuario>): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<Usuario>(`${this.url}/me`, datosActualizados, { headers });
  }

  crearUsuario(nuevoUsuario: Partial<Usuario>): Observable<Usuario> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Usuario>(`${this.url}/create`, nuevoUsuario, { headers });
  }
}
