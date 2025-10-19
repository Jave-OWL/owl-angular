import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  user: Usuario;
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
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => throwError(() => error))
      );
  }

  register(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signup`, { 
      nombre, 
      correo, 
      contrasenia, 
      fechaNacimiento,
      is_admin: false,  // Los nuevos usuarios siempre son usuarios regulares
    }).pipe(
      tap(response => {
        localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
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

// ==========================================
// CÓDIGO MOCK
// ==========================================
/*
  // Variable para alternar entre mock y API real
  private useMock = false;

  // Lista de usuarios mock
  private mockUsers: Usuario[] = [
    {
      id: 1,
      nombre: 'Admin User',
      correo: 'admin@example.com',
      contrasenia: 'admin123',
      is_admin: true,
      fechaNacimiento: '1990-01-01'
    },
    {
      id: 2,
      nombre: 'Usuario ejemplo',
      correo: 'user@example.com',
      contrasenia: 'user123',
      is_admin: false,
      fechaNacimiento: '1990-01-01'
    }
  ];

  // Método de login mock
  private mockLogin(correo: string, contrasenia: string): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => u.correo === correo && u.contrasenia === contrasenia);
    
    if (user) {
      const response = {
        token: 'mock-jwt-token',
        user: { ...user, contrasenia: undefined }
      };
      return of(response);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  // Método de registro mock
  private mockRegister(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<AuthResponse> {
    // Verificar si el correo ya existe
    if (this.mockUsers.some(u => u.correo === correo)) {
      return throwError(() => new Error('Email already exists'));
    }

    // Crear nuevo usuario
    const newUser: Usuario = {
      id: this.mockUsers.length + 1,
      nombre,
      correo,
      contrasenia,
      fechaNacimiento,
      is_admin: false  // Nuevos usuarios siempre son usuarios regulares
    };

    // Agregar a la base de datos mock
    this.mockUsers.push(newUser);

    // Retornar respuesta similar al login
    const response = {
      token: 'mock-jwt-token',
      user: { ...newUser, contrasenia: undefined }
    };

    return of(response);
  }

  // Ejemplo de cómo usar el mock en los métodos principales:
  login(correo: string, contrasenia: string): Observable<AuthResponse> {
    return this.useMock ? 
      this.mockLogin(correo, contrasenia) : 
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { correo, contrasenia })
        .pipe(catchError(error => throwError(() => error)));
  }

  register(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<AuthResponse> {
    return this.useMock ? 
      this.mockRegister(nombre, correo, contrasenia, fechaNacimiento) :
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { 
        nombre, 
        correo, 
        contrasenia, 
        fechaNacimiento,
        is_admin: false
      }).pipe(catchError(error => throwError(() => error)));
  }
*/
