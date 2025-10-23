import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  showWelcome: boolean = true;

  // Control para mostrar el resultado final
  showResults: boolean = false;
  showLoading: boolean = false;
  resultadoPerfil: string = '';

  startQuestionnaire() {
    this.showWelcome = false;
  }

  resetQuestionnaire() {
    // Resetear todas las variables
    this.showWelcome = true;
    this.showResults = false;
    this.resultadoPerfil = '';
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
      { texto: 'Perdida', valor: 4 },
      { texto: 'Incertidumbre', valor: 3 },
      { texto: 'Oportunidad', valor: 2 },
      { texto: 'Emocion', valor: 1 },
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
      'Estoy dispuesto a invertir en ',
      { palabra: 'productos financieros más complejos', definicion: 'Inversiones más difíciles de entender, como fondos con derivados o divisas, que pueden tener más riesgo y mayor ganancia potencial.' },
      ' si con eso puedo mejorar mis resultados.'
    ],
    opciones: [
      { texto: 'De acuerdo', valor: 4 },
      { texto: 'Neutral', valor: 3 },
      { texto: 'En desacuerdo', valor: 2 },
      { texto: 'Totalmente en desacuerdo', valor: 1 }
    ]
  },
  {
    partes: [
      'Estoy dispuesto a que mis inversiones tengan ',
      { palabra: 'rendimientos variables', definicion: 'Ganancias que no son estables: a veces altas, a veces bajas.' },
      ' si eso aumenta mis posibilidades de ganar más.'
    ],
    opciones: [
      { texto: 'Totalmente de acuerdo', valor: 5 },
      { texto: 'De acuerdo', valor: 4 },
      { texto: 'Neutral', valor: 3 },
      { texto: 'En desacuerdo', valor: 2 },
      { texto: 'Totalmente en desacuerdo', valor: 1 }
    ]
  }
];

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

    this.sumarRespuestas();
    console.log('Respuestas enviadas (Likert):', this.answers);
    console.log('Duraciones seleccionadas:', this.selectedDurations);
    
    // Determinar el perfil basado en la suma
    if (this.suma <= 22) {
      this.resultadoPerfil = 'Perfil Conservador';
    }
    else if (this.suma <= 32) {
      this.resultadoPerfil = 'Perfil Moderado';
    }
    else if (this.suma <= 47) {
      this.resultadoPerfil = 'Perfil Arriesgado';
    }
    else {
      this.resultadoPerfil = 'Error al calcular los resultados. Por favor, inténtalo de nuevo en otro momento.';
    }

    //Servicio a backen
    //this.NNService.enviarRespuestas(this.answers, this.selectedDurations).subscribe();

    window.scrollTo(0, 0);

    // Mostrar pantalla de carga
    this.showLoading = true;

    setTimeout(() => {
      this.showLoading = false;
      this.showResults = true;
    }, 5000);
  }
}7