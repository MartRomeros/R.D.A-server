import { Request, Response } from "express";
import solicitud from "../models/solicitud";
import actividad from "../models/actividad";

export const traerSolicitudes = async (req: Request, res: Response): Promise<void> => {
    try {
        const solicitudes = await solicitud.findMany(
            {
                include: {
                    actividad: true,
                    alumno: true,            
                },
            }
        )

        res.status(200).json({solicitudes})

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'error en el server' })

    }

}