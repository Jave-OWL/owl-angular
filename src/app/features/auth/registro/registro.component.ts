import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  currentImageSrc: string = 'assets/images/OwlNeutral.png';
  registroForm!: FormGroup;
  loading = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, {
      validators: this.validarContrasenas
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.loading = true;
      this.error = '';
      const { nombre, correo, contrasena } = this.registroForm.value;

      this.authService.register(nombre, correo, contrasena).subscribe({
        next: () => {
          this.router.navigate(['/user/cuestionario']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Error en el registro';
          if (error.message === 'Email already exists') {
            this.error = 'El correo electrónico ya está registrado';
          }
          this.currentImageSrc = 'assets/images/OwlLlaveError.png';
        }
      });
    } else {
      this.markFormGroupTouched(this.registroForm);
    }
  }

  validarContrasenas(group: FormGroup) {
    const contrasena = group.get('contrasena')?.value;
    const confirmarContrasena = group.get('confirmarContrasena')?.value;

    return contrasena === confirmarContrasena ? null : { noCoinciden: true };
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Métodos de ayuda para la validación
  getErrorMessage(controlName: string): string {
    const control = this.registroForm.get(controlName);
    
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Ingresa un correo electrónico válido';
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    
    return '';
  }

  hasError(controlName: string): boolean {
    const control = this.registroForm.get(controlName);
    return control?.invalid && control.touched ? true : false;
  }

  showPasswordError(): boolean {
    return this.registroForm.hasError('noCoinciden') && 
           this.registroForm.get('confirmarContrasena')?.touched ? true : false;
  }
}
