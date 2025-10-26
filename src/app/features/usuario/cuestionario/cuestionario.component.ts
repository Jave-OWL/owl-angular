import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

interface PreguntaParte {
  palabra?: string;
  definicion?: string;
}

type Parte = string | PreguntaParte;

interface OpcionPregunta {
  texto: string;
  valor: number;
}

interface Pregunta {
  partes: Parte[];
  opciones: OpcionPregunta[];
}

@Component({
  selector: 'app-cuestionario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cuestionario.component.html',
  styleUrl: './cuestionario.component.css'
})
export class CuestionarioComponent implements OnInit {

  constructor(private router: Router,
    private usuarioService: UsuarioService
  ) { }

  showWelcome: boolean = true;

  // Control para mostrar el resultado final
  showResults: boolean = false;
  showLoading: boolean = false;
  resultadoPerfil: string = '';
  tipoPacto: string = '';
  respuestaPacto: string = '';

  startQuestionnaire() {
    this.showWelcome = false;
  }

  resetQuestionnaire() {
    // Resetear todas las variables
    this.showWelcome = true;
    this.showResults = false;
    this.resultadoPerfil = '';
    this.tipoPacto = '';
    this.respuestaPacto = '';
    this.suma = 0;
    this.answers = new Array(this.preguntas.length).fill(0);
    this.selectedDurations = [];
  }

  isPreguntaParte(parte: Parte): parte is PreguntaParte {
    return typeof parte === 'object' && parte !== null;
  }
  suma: number = 0;
  numPreguntas: number = 0;
  answers: number[] = [];
  durationOptions = [
    { id: '1-180', label: '1 - 180 días' },
    { id: '180-365', label: '180 días a 1 año' },
    { id: '1-3', label: '1 a 3 años' },
    { id: '3-5', label: '3 a 5 años' },
    { id: '5+', label: 'más de 5 años' }
  ];
  selectedDurations: string[] = [];

  ngOnInit(): void {
    // +2 por la selección de duración y la pregunta de pacto
    this.numPreguntas = this.preguntas.length + 2;
    this.answers = new Array(this.preguntas.length).fill(0);
  }



 preguntas: Pregunta[] = [
  {
    partes: [
      'Si hablamos de tu personalidad, ' +
      '¿Tu mejor amigo como te describiria?',
      /*{ palabra: 'volatilidad', definicion: 'Cambios en el valor de una inversión: a veces sube y a veces baja.' },
      ').'*/
    ],
    opciones: [
      { texto: 'Un apostador nato', valor: 4 },
      { texto: 'Dispuesto a asumir riesgos luego de una adecuada investigación', valor: 3 },
      { texto: 'Cuidadoso', valor: 2 },
      { texto: 'Un verdadero evasor de riesgos', valor: 1 }
    ]
  },
  {
    partes: [
      'Estas en un programa de televisión y puedes elegir una de las siguientes opciones; ¿Cuál eliges?'
    ],
    opciones: [
      { texto: '1 millon de pesos en efectivo', valor: 1 },
      { texto: '50% de posibilidad de ganar 5 millones de pesos', valor: 2 },
      { texto: '25% de posibilidades de ganar 10 millones de pesos', valor: 3 },
      { texto: '5% de posibilidades de ganar 100 millones de pesos', valor: 4 }
    ]
  },
  {
    partes: [
      'Acabas de terminar de ahorrar para unas vacaciones de "Una vez en la vida". Tres semanas antes de tu viaje, te despiden de tu trabajo. ¿Qué harías?'
    ],
    opciones: [
      { texto: 'Cancelo el viaje', valor: 1 },
      { texto: 'Tomo unas vacaciones mucho más económicas', valor: 2 },
      { texto: 'Mantengo el viaje, teniendo en cuenta que debo tener el tiempo para prepararme para una búsqueda de trabajo', valor: 3 },
      { texto: 'Alargo las vacaciones, porque esta puede ser mi última oportunidad de ir en "Primera clase" en mucho tiempo', valor: 4 }
    ]
  },
  {
    partes: [
      'Si de un día para otro, recibes 70 millones de pesos para invertir, ¿Que harías con ese dinero?'
    ],
    opciones: [
      { texto: 'Lo depositaria en una cuenta de banco, bla bla o bla bla', valor: 1 },
      { texto: 'Invertiría en acciones seguraa o bla', valor: 2 },
      { texto: 'Invertiria en la bolsa de valores o en criptomonedas', valor: 3 }
    ]
  },
  {
    partes: [
      'En temas de experiencia con inversiones, ¿Qué tan cómodo te sientes invirtiendo en ',
      { palabra: 'acciones', definicion: 'Inversiones en empresas de bolsa de valores.' },
      ' o ',
      { palabra: 'fondos de inversión colectiva', definicion: 
      ' Inversiones en fondos que agrupan dinero de varios inversionistas para comprar acciones, bonos u otros activos.' },
      '?'
    ],
    opciones: [
      { texto: 'Nada cómodo', valor: 1 },
      { texto: 'Algo cómodo', valor: 2 },
      { texto: 'Muy cómodo', valor: 3 }
    ]
  },
  {
    partes: [
      'Cuando escuchas la palabra "Riesgo", cual de las siguientes palabras te viene a la mente primero?'
    ],
    opciones: [
      { texto: 'Perdida', valor: 1 },
      { texto: 'Incertidumbre', valor: 2 },
      { texto: 'Oportunidad', valor: 3 },
      { texto: 'Emocion', valor: 4 },
    ]
  },
  {
    partes: [
      'Algunos expertos predicen que los precios de activos como el oro, las joyas, los objetos coleccionables y los bienes raíces (activos tangibles) aumentarán de valor; sin embargo, los precios de los bonos podrían caer, aunque se considera que los bonos del gobierno siguen siendo relativamente seguros. Actualmente, la mayoría de tus inversiones están en bonos gubernamentales de alto rendimiento. ¿Qué harías tú?'
    ],
    opciones: [
      { texto: 'Mantengo los bonos', valor: 1 },
      { texto: 'Vendo los bonos, invierto la mitad de mis ganancias en cuentas del mercado monetario y la otra mitad en activos tangibles', valor: 2 },
      { texto: 'Vendo los bonos, e invierto todo el dinero en activos tangibles', valor: 3 },
      { texto: 'Vendo los bonos, invierto todo el dinero en activos tangibles y pido dinero prestado adicional para comprar más activos, pues es una oportunidad que no se puede perder', valor: 4 }
    ]
  },
  {
    partes: [
      'Dado el mejor y peor caso de escenarios de inversión mostrados abajo, ¿Cual de ellos preferirias?'
    ],
    opciones: [
      { texto: 'Ganar $200.000 pesos en el mejor caso; $0 pesos de ganancia/perdida en el peor caso', valor: 1 },
      { texto: 'Ganar $800.000 pesos en el mejor caso; Perder $200.000 pesos en el peor caso', valor: 2 },
      { texto: 'Ganar $2.600.000 pesos en el mejor caso; Perder $800.000 pesos en el peor caso', valor: 3 },
      { texto: 'Ganar $4.800.000 pesos en el mejor caso; Perder $2.400.000 pesos en el peor caso', valor: 4 }
    ]
  },
  {
    partes: [
      'Además de lo que ya posees, te han dado $1.000.000 de pesos. Ahora se te pide que elijas entre las siguientes opciones:'
    ],
    opciones: [
      { texto: 'Una ganancia segura de $500.000 pesos', valor: 1 },
      { texto: 'Una posibilidad del 50% de ganar $1.000.000 de pesos y una posibilidad del 50% ganar nada', valor: 3 }
    ]
  },
  {
    partes: [
      'Además de lo que ya posees, te han dado $2.000.000 de pesos. Ahora se te pide que elijas entre las siguientes opciones:'
    ],
    opciones: [
      { texto: 'Una perdida segura de $500.000 pesos', valor: 1 },
      { texto: 'Una posibilidad del 50% de perder $1.000.000 de pesos y una posibilidad del 50% de perder nada', valor: 3 }
    ]
  },
  {
    partes: [
      'Suponga que un pariente le ha dejado una herencia de 100 millones de pesos, estipulando en su testamento que usted debe invertir TODO ese dinero en UNA de las siguientes opciones. ¿Cuál opción elegiría?'
    ],
    opciones: [
      { texto: 'Una cuenta de ahorros', valor: 1 },
      { texto: 'Un fondo de inversion colectiva', valor: 2 },
      { texto: 'Un portafolio con x y z', valor: 3 },
      { texto: 'En materias primas como oro, plata y petroleo', valor: 4 }
    ]
  },
  {
    partes: [
      'Si usted tuviera que invertir $20.000.000 de pesos, cual de las siguientes opciones de inversion considera mas atractiva para usted?'
    ],
    opciones: [
      { texto: '60% en inversiones de bajo-riesgo, 30% en inversiones de mediano-riesgo y 10% en inversiones de alto-riesgo', valor: 1 },
      { texto: '30% en inversiones de bajo-riesgo, 40% en inversiones de mediano-riesgo y 30% en inversiones de alto-riesgo', valor: 2 },
      { texto: '10% en inversiones de bajo-riesgo, 40% en inversiones de mediano-riesgo y 50% en inversiones de alto-riesgo', valor: 3 }
    ]
  },
  {
    partes: [
      'Tu amigo y vecino de confianza, un geólogo experimentado, está reuniendo un grupo de inversionistas para financiar una exploración minera de oro. Esta inversión podría generar entre 50 y 100 veces el monto invertido si tiene éxito. Sin embargo, si la mina fracasa, toda la inversión se perdería. Tu amigo estima que la probabilidad de éxito es solo del 20%. Si tuvieras el dinero, ¿cuánto invertirías?'
    ],
    opciones: [
      { texto: 'Nada', valor: 1 },
      { texto: 'El salario de un mes', valor: 2 },
      { texto: 'El salario de tres meses', valor: 3 },
      { texto: 'El salario de seis meses', valor: 4 }
    ]
  }
];

  // Pregunta de pacto
  preguntaPacto = {
    titulo: '¿Qué tan importante es para ti tener la posibilidad de retirar tu dinero en cualquier momento?',
    opciones: [
      { texto: 'Es muy importante para mí poder retirar mi dinero cuando lo necesite', valor: 'pacto' },
      { texto: 'No me importa si tengo que esperar un tiempo para poder retirar mi dinero', valor: 'nopacto' },
      { texto: 'Me es indiferente', valor: 'cualquiera' }
    ]
  };

  sumarRespuestas() {
    this.suma = 0;
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i] = parseInt(this.answers[i].toString());
      this.suma += this.answers[i].valueOf();
    }
  }

  isDurationSelected(id: string): boolean {
    return this.selectedDurations.includes(id);
  }

  toggleDuration(id: string, checked: boolean) {
    if (checked) {
      if (!this.selectedDurations.includes(id)) {
        this.selectedDurations = [...this.selectedDurations, id];
      }
    } else {
      this.selectedDurations = this.selectedDurations.filter(x => x !== id);
    }
  }

  // Verificar si el formulario está completo
  isFormComplete(): boolean {
    if (this.answers.some(a => a === 0)) {
      return false;
    }
    if (this.selectedDurations.length === 0) {
      return false;
    }
    if (!this.respuestaPacto) {
      return false;
    }
    return true;
  }

  goToDashboard() {
    this.router.navigate(['/user/dashboard']);
  }

  submitAnswers() {
    // Validación: todas las preguntas Likert deben tener respuesta
    if (this.answers.some(a => a === 0)) {
      alert('Por favor, responde todas las preguntas.');
      return;
    }

    // Validación de la multiselección
    if (this.selectedDurations.length === 0) {
      alert('Por favor, selecciona al menos una opción de duración.');
      return;
    }
    if (!this.respuestaPacto) {
      alert('Por favor, indica tu preferencia sobre la disponibilidad de tu dinero.');
      return;
    }

    this.tipoPacto = this.respuestaPacto;
    
    this.sumarRespuestas();
    console.log('Respuestas enviadas (Likert):', this.answers);
    console.log('Duraciones seleccionadas:', this.selectedDurations);
    console.log('Tipo de pacto:', this.tipoPacto);
    
    // Determinar el perfil basado en la suma
    if (this.suma <= 22) {
      this.resultadoPerfil = 'Conservador';
    }
    else if (this.suma <= 32) {
      this.resultadoPerfil = 'Moderado';
    }
    else if (this.suma <= 47) {
      this.resultadoPerfil = 'Arriesgado';
    }
    else {
      this.resultadoPerfil = 'Error al calcular los resultados. Por favor, inténtalo de nuevo en otro momento.';
    }

    this.usuarioService.enviarPrediccion(this.resultadoPerfil, this.tipoPacto, this.selectedDurations[0])
      .subscribe({
        next: (resp) => {
          console.log('Predicción enviada/actualizada OK:', resp);
          this.showLoading = false;
          this.showResults = true;   // ahora sí muestra resultados cuando el server responde
          window.scrollTo(0, 0);
        },
        error: (err) => {
          console.error('Error enviando predicción:', err);
          this.showLoading = false;
          alert('Ocurrió un error enviando tus datos. Intenta de nuevo.');
        }
      });
    window.scrollTo(0, 0);

    // Mostrar pantalla de carga
    this.showLoading = true;

    setTimeout(() => {
      this.showLoading = false;
      this.showResults = true;
    }, 5000);
  }
}7