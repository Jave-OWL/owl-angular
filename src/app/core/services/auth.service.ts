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
  private useMock = true; // Toggle this to switch between mock and real API

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Mock authentication methods
  private mockLogin(correo: string, contrasenia: string): Observable<any> {
    // Mock users for testing
    const mockUsers: Usuario[] = [
      {
        id: 1,
        nombre: 'Admin User',
        correo: 'admin@example.com',
        contrasenia: 'admin123',
        rol: 'administrador'
      },
      {
        id: 2,
        nombre: 'Regular User',
        correo: 'user@example.com',
        contrasenia: 'user123',
        rol: 'usuario'
      }
    ];

    const user = mockUsers.find(u => u.correo === correo && u.contrasenia === contrasenia);
    
    if (user) {
      const response = {
        token: 'mock-jwt-token',
        user: { ...user, contrasenia: undefined } // Remove password from response
      };
      return of(response);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  // Real API methods
  private apiLogin(correo: string, contrasenia: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { correo, contrasenia })
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
