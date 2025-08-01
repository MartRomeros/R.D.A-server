export interface Area_trabajo {
    id: number,
    nombre: string
}

export interface Usuario {
    id: number,
    run: string,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string | null,   
    fono: number,
    email: string,
    password: string | null,
    tipo_usuario_id: number,
    area_trabajo_id:number
}

export interface Actividad {
    area_trabajo_id: number,
    estado: true,
    fecha_actividad: Date,
    hora_inic_actividad: Date,
    hora_term_actividad: Date,
    id_actividad: number,
    run_alumno: string

}

export interface horasArea{
    nombre:string,
    duracion_horas:number
}

/* modelos para admin */
export interface AdminAlumno{
    nombre:string,
    run:string,
    fono:number
}

export interface ModeloOc{
    "N° OC":number,
    ALUMNO:string,
    "RUT Alumno":string,
    "Total BH OC":Number
}