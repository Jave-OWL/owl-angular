export interface FIC {
    id: number;
    logo: string;
    nombre_fic: string;
    gestor: string;
    custodio: string;
    fecha_corte: string;
    politicaInversion: string;
    link: string;
    riesgo: string;
    rentabilidad: number;
    calificaciones: any[];
    composicion_portafolios: ComposicionPortafolio[];
    rentabilidadVolatilidades: any[];
    rentabilidad_historicas: RentabilidadHistorica[];
    volatilidad_historicas: VolatilidadHistorica[];
    caracteristicas: Caracteristicas[];
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