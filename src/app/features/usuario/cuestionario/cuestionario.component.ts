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

  numPreguntas = 8;

  currentPage: number = 1;
  answers: number[] = new Array(this.numPreguntas).fill(0);

  getColorProgreso(): string {
    const progress = (this.currentPage / this.numPreguntas) * 100;
    if (progress < 25) {
      return '#bbc7e5'; // Verde claro
    } else if (progress < 50) {
      return '#90acd3'; // Verde medio
    } else if (progress < 75) {
      return '#789ed3ff'; // Verde medio oscuro
    } else {
      return '#5087d4ff'; // Verde oscuro
    }
  }

  preguntas: string[] = [
    'Creo que, a mayor riesgo, mayor es la posibilidad de ganar.',
    'Creo que, a mayor riesgo, mayor es la posibilidad de perder.',
    'Prefiero invertir en productos de renta fija, aunque la rentabilidad sea menor.',
    'Prefiero invertir en productos de renta variable, aunque la rentabilidad sea mayor.',
    'Estoy dispuesto a asumir pérdidas temporales en mis inversiones.',
    'Prefiero inversiones con rentabilidad garantizada, aunque sea menor.',
    'Me siento cómodo con la volatilidad del mercado.',
    'Prefiero inversiones a corto plazo, aunque la rentabilidad sea menor.'
  ]

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.numPreguntas) {
      if (this.answers[this.currentPage - 1] === 0) {
        alert('Por favor, responde la pregunta antes de continuar.');
        return;
      }
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
