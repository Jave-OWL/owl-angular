import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuestionario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})
export class CuestionarioComponent {
  currentPage: number = 1;
  answers: number[] = new Array(5).fill(0);

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < 5) {
      this.currentPage++;
    }
  }

  submitAnswers() {
    // Aquí puedes implementar la lógica para procesar las respuestas
    console.log('Respuestas:', this.answers);
    // Por ejemplo, calcular el perfil de riesgo basado en las respuestas
    // y redirigir al usuario a la siguiente página
  }
}
