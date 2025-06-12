import actividad from "../models/actividad"
import { Actividad } from "../models/interfaces"

const horaCL = Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit'
})

const fechaCL = new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
})

export const formatearActividad = (actividad: any) => {
    const fechaUTC = new Date(actividad.fecha_actividad)
    const fechaFormateada = fechaCL.format(fechaUTC)
    actividad.fecha_actividad = fechaFormateada
    const horaInicUTC = new Date(actividad.hora_inic_activdad)
    const horaInicFormateada = horaCL.format(horaInicUTC)
    actividad.hora_inic_activdad = horaInicFormateada
    const horaTermUTC = new Date(actividad.hora_term_actividad)
    const horaTermCL = horaCL.format(horaTermUTC)
    actividad.hora_term_actividad = horaTermCL
    return actividad
}

export const traerFechaInicioMes = () => {

    const anio = new Date().getFullYear()
    const mes = parseInt(`0${new Date().getMonth() + 1}`)
    const fechaInicio = new Date(anio, mes - 1, 1)

    return fechaInicio
}

export const traerFechaFinMes = () => {
    const anio = new Date().getFullYear()
    const mes = parseInt(`0${new Date().getMonth() + 1}`)
    const fechaFin = new Date(anio, mes, 1)

    return fechaFin
}

export const calcularDiferenciaHoras = (actividad: any): number => {
    let diferencia: number = 0
    const inicio = actividad.hora_inic_activdad;
    const termino = actividad.hora_term_actividad;
    if (inicio && termino) {
        diferencia += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
    }
    return diferencia
}