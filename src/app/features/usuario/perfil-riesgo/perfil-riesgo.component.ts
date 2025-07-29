import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil-riesgo',
  templateUrl: './perfil-riesgo.component.html',
  styleUrls: ['./perfil-riesgo.component.css']
})
export class PerfilRiesgoComponent implements OnInit {
  perfilRiesgoForm: FormGroup;
  
  preguntas = [
    { texto: '1. Me siento cómodo/a asumiendo riesgos financieros' },
    { texto: '2. Prefiero inversiones seguras aunque den menor rendimiento' },
    { texto: '3. Puedo tolerar pérdidas temporales en mis inversiones' },
    { texto: '4. Busco maximizar mis ganancias aunque implique mayor riesgo' },
    { texto: '5. Me mantengo tranquilo/a ante fluctuaciones del mercado' }
  ];

  constructor(private fb: FormBuilder) {
    this.perfilRiesgoForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Crear controles dinámicamente para cada pregunta
    this.preguntas.forEach((_, index) => {
      this.perfilRiesgoForm.addControl(
        `pregunta${index}`,
        this.fb.control('', Validators.required)
      );
    });
  }

  onSubmit(): void {
    if (this.perfilRiesgoForm.valid) {
      console.log(this.perfilRiesgoForm.value);
      // Aquí puedes implementar la lógica para enviar los datos
    }
  }
}