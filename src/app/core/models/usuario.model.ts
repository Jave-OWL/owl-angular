export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    contrasenia: string;
    rol: 'administrador' | 'usuario';
}
