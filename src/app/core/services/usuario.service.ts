import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private http: HttpClient) { }

  enviarPrediccion(perfilRiesgo: string, rangoDias: string, pactoPermanencia: string) {
    const body = {
      perfilRiesgo,
      rangoDias,
      pactoPermanencia
    };
    return this.http.post('/prediccion', body);
  }
}
