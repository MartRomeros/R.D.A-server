import { Request, Response } from "express";
import prismaAlumno from '../models/alumno'

//traer alumnos de la bd
export const allAlumnos = async (req: Request, res: Response) => {
    try {
        const alumnos = await prismaAlumno.findMany()
        res.status(200).json({ alumnos })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
        console.error(error)
    }



}