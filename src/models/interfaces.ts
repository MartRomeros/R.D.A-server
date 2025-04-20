export interface Alumno {
    id_alumno: number,
    run_alumno: string,
    nombre_alumno: string,
    apellido_paterno_alumno: string,
    apellido_materno_alumno: string,
    fono_alumno: number,
    email_alumno: string,
    password: string | null
}


export interface Usuario {
    id: number,
    run: string,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    fono: number,
    email: string,
    password: string | null,
    tipo_usuario: string
}

export interface Actividad {
    id_actividad: number,
    fecha_actividad: string,
    hora_inic_actividad: string,
    hora_term_actividad: string,
    area_trabajo: string,
    run_alumno: string

}