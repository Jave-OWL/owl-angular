import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser$: Observable<Usuario | null>;
  private useMock = true; // Toggle entre mock y API real

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private mockUsers: Usuario[] = [
    {
      id: 1,
      nombre: 'Admin User',
      correo: 'admin@example.com',
      contrasenia: 'admin123',
      rol: 'administrador',
      fechaNacimiento: '1990-01-01'
    },
    {
      id: 2,
      nombre: 'Usuario ejemplo',
      correo: 'user@example.com',
      contrasenia: 'user123',
      rol: 'usuario',
      fechaNacimiento: '1990-01-01'
    }
  ];

  // Mock authentication methods
  private mockLogin(correo: string, contrasenia: string): Observable<any> {
    const user = this.mockUsers.find(u => u.correo === correo && u.contrasenia === contrasenia);
    
    if (user) {
      const response = {
        token: 'mock-jwt-token',
        user: { ...user, contrasenia: undefined } // Remove password from response
      };
      return of(response);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  // Mock registration method
  private mockRegister(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<any> {
    // Check if email already exists
    if (this.mockUsers.some(u => u.correo === correo)) {
      return throwError(() => new Error('Email already exists'));
    }

    // Create new user
    const newUser: Usuario = {
      id: this.mockUsers.length + 1,
      nombre,
      correo,
      contrasenia,
      fechaNacimiento,
      rol: 'usuario'  // New users are always regular users
    };

    // Add to mock database
    this.mockUsers.push(newUser);

    // Return response similar to login
    const response = {
      token: 'mock-jwt-token',
      user: { ...newUser, contrasenia: undefined }
    };

    return of(response);
  }

  private apiLogin(correo: string, contrasenia: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { correo, contrasenia })
      .pipe(catchError(error => throwError(() => error)));
  }

  private apiRegister(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { nombre, correo, contrasenia })
      .pipe(catchError(error => throwError(() => error)));
  }

  login(correo: string, contrasenia: string): Observable<any> {
    const loginObservable = this.useMock ? this.mockLogin(correo, contrasenia) : this.apiLogin(correo, contrasenia);

    return loginObservable.pipe(
      tap(response => {
        localStorage.setItem(this.AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(nombre: string, correo: string, contrasenia: string, fechaNacimiento: string): Observable<any> {
    const registerObservable = this.useMock ? this.mockRegister(nombre, correo, contrasenia, fechaNacimiento) : this.apiRegister(nombre, correo, contrasenia, fechaNacimiento);

    return registerObservable.pipe(
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
    localStorage.removeItem('rol'); 
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

  hasRole(role: 'administrador' | 'usuario'): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
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
