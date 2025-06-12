import { Request, Response } from "express";
import prismaSolicitud from "../../models/solicitud";
import actividad from "../../models/actividad";

export const traerSolicitudes = async (req: Request, res: Response): Promise<void> => {
    try {
        const solicitudes = await prismaSolicitud.findMany(
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


export const traerSolicitudesById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    try {
        const solicitud = await prismaSolicitud.findUnique({
            where: { id: id },
            include: { alumno: true, actividad: { include: { area_trabajo: true } } }
        })
        res.status(200).json({ solicitud })
    } catch (error: any) {
        console.error(error)
    }

}

export const aprobarSolicitud = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    try {
        await prismaSolicitud.update({
            data: { estado: true },
            where: { id: id }
        })
        res.status(200).json({ message: 'solicitud aprobada' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'problemas en el server' })

    }
}