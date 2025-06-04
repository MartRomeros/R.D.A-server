import { Request, Response } from "express";
import prismaActividad from '../models/actividad'
import prismaUsuario from '../models/user'
import actividad from "../models/actividad";
import { DateTime, Zone } from 'luxon'
import { traerUsuarioByEmail } from "./usuario.controller";
import { traerMailDelToken } from "../services/authServices";

export const registrarActividad = async (req: Request, res: Response): Promise<void> => {
    const { fecha_actividad, hora_inic_activdad, hora_term_actividad, run_alumno, area_trabajo } = req.body
    const claves = Object.keys(req.body)

    for (let i = 0; i < claves.length; i++) {
        if (!req.body[claves[i]]) {
            res.status(400).json({ message: `Campo ${claves[i]} incompleto!` })
            return
        }
    }

    try {
        await prismaActividad.create({
            data: {
                area_trabajo: area_trabajo,
                fecha_actividad: new Date(fecha_actividad),
                hora_inic_activdad: new Date(hora_inic_activdad),
                hora_term_actividad: new Date(hora_term_actividad),
                run_alumno: run_alumno
            }
        })
        res.status(201).json({ message: 'actividad registrada!' })


    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'error en el server', error })

    }

}

export const traerActividadesByRun = async (req: Request, res: Response): Promise<void> => {
    const run_alumno = req.params.run
    if (!run_alumno) {
        res.status(400).json({ message: 'el run es obligatorio!' })
        return
    }
    try {
        const actividades = await prismaActividad.findMany({ where: { run_alumno: run_alumno } })
        res.status(200).json({ actividades })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server', error })
    }
}

export const calcularHorasTotalesPorAlumno = async (req: Request, res: Response): Promise<void> => {
    let horasTotales: number = 0
    const runAlumno = req.params.run
    if (!runAlumno) {
        res.status(404).json({ message: 'run no encontrado' });
        return
    }
    try {
        const actividades = await actividad.findMany({ where: { run_alumno: runAlumno } });
        actividades.forEach((actividad) => {
            const horaInic = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
            const horaTerm = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })

            if (!horaInic.isValid || !horaTerm.isValid) {
                console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
            }

            const diffEnHoras = horaTerm.diff(horaInic, 'hours').hours
            horasTotales += diffEnHoras

        })

        res.status(200).json({ horasTotales: Math.round(horasTotales) })

    } catch (error: any) {
        res.status(500).json({ error })
    }
}

export const calcularHorasPorMes = async (req: Request, res: Response) => {
    try {
        const mes = req.params.mes
        const token: any = req.cookies.token
        const email: string = traerMailDelToken(token) || ''
        //traer al usuario por el correo, esto para obtener el run
        const usuario = await prismaUsuario.findUnique({ where: { email: email } })
        //obtener el run
        const run = usuario?.run
        //buscar las horas del usuario
        

    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
    }

}