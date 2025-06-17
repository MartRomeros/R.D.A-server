import { Request, Response } from "express";
import prismaSolicitud from "../../models/solicitud";
import prismaAdmin from '../../models/user'
import { notifyStudents } from "../../sockets/socketManager";
import { io } from "../../server";
import { fechaCL, formatearActividad } from "../../services/fechasServices";
import { traerMailDelToken } from "../../services/authServices";

export const traerSolicitudes = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const administrador = await prismaAdmin.findUnique({ where: { email: email } })

        let solicitudes = []

        switch (administrador?.area_trabajo_id) {
            case 1:
                solicitudes = await prismaSolicitud.findMany(
                    {
                        where: { actividad: { area_trabajo_id: 1 } },
                        include: {
                            actividad: true,
                            alumno: true,
                        },
                    }
                )
                res.status(200).json({ solicitudes })
                break;
            case 2:
                solicitudes = await prismaSolicitud.findMany(
                    {
                        where: { actividad: { area_trabajo_id: 1 } },
                        include: {
                            actividad: true,
                            alumno: true,
                        },
                    }
                )
                res.status(200).json({ solicitudes })
                break;
            case 3:
                solicitudes = await prismaSolicitud.findMany(
                    {
                        where: { actividad: { area_trabajo_id: 1 } },
                        include: {
                            actividad: true,
                            alumno: true,
                        },
                    }
                )
                res.status(200).json({ solicitudes })
                break;
            case 4:
                solicitudes = await prismaSolicitud.findMany(
                    {
                        include: {
                            actividad: true,
                            alumno: true,
                        },
                    }
                )
                res.status(200).json({ solicitudes })
                break;

            default:
                solicitudes = await prismaSolicitud.findMany(
                    {
                        include: {
                            actividad: true,
                            alumno: true,
                        },
                    }
                )
                res.status(200).json({ solicitudes })
                break;
        }
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

        const solicitudAprobada = await prismaSolicitud.findUnique({
            where: { id },
            include: {
                alumno: true,
                actividad: true
            }
        })

        notifyStudents(io, `📌 Solicitud aprobada para el alumno: ${solicitudAprobada?.alumno.nombre} ${solicitudAprobada?.alumno.apellido_paterno} con fecha: ${fechaCL.format(solicitudAprobada?.actividad.fecha_actividad)}`)

        res.status(200).json({ message: 'solicitud aprobada' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'problemas en el server' })

    }
}