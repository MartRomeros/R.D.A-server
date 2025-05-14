import { Request, Response } from "express";
import prismaActividad from '../models/actividad'

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
                fecha_actividad: fecha_actividad,
                hora_inic_activdad: hora_inic_activdad,
                hora_term_actividad: hora_term_actividad,
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