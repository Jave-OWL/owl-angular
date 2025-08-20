import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  currentImageSrc: string = 'assets/images/OwlNeutral.png';
  registroForm!: FormGroup;

  formData = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  formErrors = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  }

  

  onSubmit() {
    if (this.registroForm.valid) {
      console.log(this.registroForm.value);

    }
  }

  ValidarContrasenas() {
    const contrasena = this.registroForm.get('contrasena')?.value;
    const confirmarContrasena = this.registroForm.get('confirmarContrasena')?.value;

    if (contrasena !== confirmarContrasena) {
      this.registroForm.get('confirmarContrasena')?.setErrors({ noCoinciden: true });
    } else {
      this.registroForm.get('confirmarContrasena')?.setErrors(null);
    }
  }
}
