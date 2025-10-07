export interface FIC {
    id: number;
    logo: string;
    nombre_fic: string;
    gestor: string;
    custodio: string;
    fechaCorte: string;
    politicaInversion: string;
    link: string;
    riesgo: string;
    rentabilidad: string;
    calificaciones: any[];
    composicion_portafolios: ComposicionPortafolio[];
    rentabilidadVolatilidades: any[];
}

export interface ComposicionPortafolio {
    id: number;
    tipo_composicion: string;
    categoria: string;
    participacion: number;
}