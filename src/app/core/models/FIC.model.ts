export interface FIC {
    id: number;
    logo: string;
    nombre_fic: string;
    gestor: string;
    custodio: string;
    fecha_corte: string;
    politica_de_inversion: string;
    link: string;
    riesgo: string;
    rentabilidad: number;
    calificaciones: any[];
    ea: number;
    principales_inversiones: PrincipalesInversiones[];
    composicion_portafolios: ComposicionPortafolio[];
    rentabilidadVolatilidades: any[];
    rentabilidad_historicas: RentabilidadHistorica[];
    volatilidad_historicas: VolatilidadHistorica[];
    caracteristicas: Caracteristicas[];
    plazo_duraciones: PlazoDuraciones[];
}

export interface Caracteristicas {
    id: number;
    fecha_inicio_operaciones: string;
    tipo: string;
    no_unidades_en_circulacion: number;
    valor: number;
}

export interface ComposicionPortafolio {
    id: number;
    tipo_composicion: string;
    categoria: string;
    participacion: number;
}

export interface RentabilidadHistorica {
    id: number;
    anio_corrido: number;
    tipo_de_participacion: string;
    ultimo_mes: number;
    ultimo_6_meses: number;
    ultimo_anio: number;
    ultimo_2_anios: number;
    ultimo_3_anios: number;
}

export interface VolatilidadHistorica {
    id: number;
    anio_corrido: number;
    tipo_de_participacion: string;
    ultimo_mes: number;
    ultimo_6_meses: number;
    ultimo_anio: number;
    ultimo_2_anios: number;
    ultimo_3_anios: number;
}

export interface PrincipalesInversiones {
    id: number;
    emisor: string;
    participacion: number;
}

export interface PlazoDuraciones {
    id: number;
    plazo: string;
    participacion: number;
}

export interface calificaciones {
    id: number;
    calificacion: string;
    entidad_calificadora: string;
    fecha_ultima_calificacion: string;
}