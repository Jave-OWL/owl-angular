import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PreguntaParte {
  palabra?: string;
  definicion?: string;
}

type Parte = string | PreguntaParte;

interface Pregunta {
  partes: Parte[];
}

@Component({
  selector: 'app-cuestionario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})
export class CuestionarioComponent {
  // Mostrar pantalla de bienvenida antes de las preguntas
  showWelcome: boolean = true;

  startQuestionnaire() {
    this.showWelcome = false;
    this.currentPage = 1;
  }

  isPreguntaParte(parte: Parte): parte is PreguntaParte {
    return typeof parte === 'object' && parte !== null;
  }

  suma: number = 0;

  numPreguntas = 8;

  currentPage: number = 1;
  answers: number[] = new Array(this.numPreguntas).fill(0);

  getColorProgreso(): string {
    const progress = (this.currentPage / (this.numPreguntas)) * 100;
    if (progress < 25) {
      return '#bbc7e5'; 
    } else if (progress < 50) {
      return '#90acd3'; 
    } else if (progress < 75) {
      return '#789ed3ff'; 
    } else if (progress < 90) {
      return '#6ca5f4ff';
    } else {
      return '#1e90ff'; // verde
    }
  }

 preguntas: Pregunta[] = [
  {
    partes: [
      'Me siento cómodo con la posibilidad de que el valor de mi inversión baje temporalmente si eso me permite aspirar a mayores ganancias (esto se llama ',
      { palabra: 'volatilidad', definicion: 'Cambios en el valor de una inversión: a veces sube y a veces baja.' },
      ').'
    ]
  },
  {
    partes: [
      'Prefiero asumir cierto riesgo con tal de obtener un mejor ',
      { palabra: 'rendimiento', definicion: 'La ganancia que produce una inversión.' },
      ' en mis inversiones.'
    ]
  },
  {
    partes: [
      'Si pierdo dinero en una inversión en el corto plazo, estoy dispuesto a esperar varios meses para recuperarlo.'
    ]
  },
  {
    partes: [
      'Creo que es más importante la ',
      { palabra: 'rentabilidad', definicion: 'La ganancia que produce una inversión.' },
      ' de largo plazo que la seguridad de corto plazo.'
    ]
  },
  {
    partes: [
      'Estoy dispuesto a invertir en ',
      { palabra: 'productos financieros más complejos', definicion: 'Inversiones más difíciles de entender, como fondos con derivados o divisas, que pueden tener más riesgo y mayor ganancia potencial.' },
      ' si con eso puedo mejorar mis resultados.'
    ]
  },
  {
    partes: [
      'En general, me considero una persona que toma riesgos en decisiones importantes de la vida.'
    ]
  },
  {
    partes: [
      'Estoy dispuesto a que mis inversiones tengan ',
      { palabra: 'rendimientos variables', definicion: 'Ganancias que no son estables: a veces altas, a veces bajas.' },
      ' si eso aumenta mis posibilidades de ganar más.'
    ]
  },
  {
    partes: [
      'Prefiero una inversión con alto potencial de ganancia, aunque exista la posibilidad de perder dinero.'
    ]
  }
];

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

  sumarRespuestas() {
    this.suma = 0;
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i] = parseInt(this.answers[i].toString());
      this.suma += this.answers[i].valueOf();
    }
  }

  submitAnswers() {
    this.sumarRespuestas();
    console.log('Respuestas enviadas:', this.answers);
    if (this.suma <= 18) {
      alert('Perfil Conservador');
      // Enviar respuestas al backend
    }
    else if (this.suma <= 29) {
      alert('Perfil Moderado');
      // Enviar respuestas al backend
    }
    else if (this.suma <= 40) {
      alert('Perfil Arriesgado');
      // Enviar respuestas al backend
    }
    else {
      alert('Error al calcular los resultados. Por favor, inténtalo de nuevo en otro momento.');
    }
    const HTMLElement = document.getElementById('contenedor-preguntas');
    if (HTMLElement) {
      HTMLElement.style.display = 'none';
    }
  }
}
