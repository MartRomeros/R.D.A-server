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


interface Area_trabajo {
    id: number,
    nombre: string
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
    tipo_usuario_id: number
}

export interface Actividad {
    area_trabajo: Area_trabajo
    area_trabajo_id: number,
    estado: true,
    fecha_actividad: Date,
    hora_inic_actividad: Date,
    hora_term_actividad: Date,
    id_actividad: number,
    run_alumno: string

}