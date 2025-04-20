import { Request, Response } from "express";
import prismaActividad from '../models/actividad'


//traer actividades
export const getAllActivitiesByAlumno = async (req: Request, res: Response) => {

    const runAlumno = req.params.run

    try {

        const actividades = await prismaActividad.findUnique({
            where: {
                run_alumno: runAlumno
            }
        })

        if (!actividades) {
            res.status(404).json({ message: 'No hay horas registradas!!' })
            return
        }

        res.status(200).json({ actividades })

    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
    }
}