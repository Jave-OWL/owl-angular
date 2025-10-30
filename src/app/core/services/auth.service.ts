import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user?: Usuario;
  email?: string;
  admin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(correo: string, contrasenia: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { correo, contrasenia })
      .pipe(
        tap(response => {
          localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
          
          let userToStore: any;
          if (response.user) {
            userToStore = response.user;
          } else if (response.email) {
            userToStore = {
              correo: response.email,
              is_admin: response.admin || false
            };
          }
          
          if (userToStore) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
            this.currentUserSubject.next(userToStore);
          }
        }),
        catchError(error => throwError(() => error))
      );
  }

  register(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string):
     Observable<AuthResponse> {
      console.log('Registering user with data:', { nombre, correo, contrasenia, fecha_nacimiento: fechaNacimiento });
      return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, { 
        nombre, 
        correo, 
        contrasenia, 
        fecha_nacimiento: fechaNacimiento,
        is_admin: false,  // Los nuevos usuarios nunca son admin
      }).pipe(
        tap(response => {
          localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
          
          let userToStore: any;
          if (response.user) {
            userToStore = response.user;
          } else if (response.email) {
            userToStore = {
              correo: response.email,
              is_admin: response.admin || false,
              nombre: nombre
            };
          }
          
          if (userToStore) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userToStore));
            this.currentUserSubject.next(userToStore);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_admin ?? false;
  }

  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}