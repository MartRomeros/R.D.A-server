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

        res.status(200).json({ solicitudes })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'error en el server' })

    }

}

export const aprobarSolicitud = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    try {
        await solicitud.update({
            data: { estado: true },
            where: { id: id }
        })
        res.status(200).json({ message: 'solicitud aprobada' })
        
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'problemas en el server' })

    }
}