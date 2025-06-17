import { Request, Response } from "express";
import { traerMailDelToken } from "../../services/authServices";
import prismaAlumno from '../../models/user'
import prismaActividad from '../../models/actividad'
import prismaArea from '../../models/areaTrabajo'
import { calcularDiferenciaHoras, formatearActividad, traerFechaFinMes, traerFechaInicioMes } from "../../services/fechasServices";
import { formatearMonto } from "../../services/precioServices";

const tarifa: number = parseInt(process.env.TARIFA || '2')

//GET:EMAIL funcion que traera el alumno y todos sus detalles como horas trabajadas en el mes, monto acumulado, proximo pago, orden de compra
export const resumenMes = async (req: Request, res: Response): Promise<any> => {
    let horasMes: number = 0
    let montoAcumulado: number = 0



    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const alumno = await prismaAlumno.findUnique({ where: { email: email } })
        const actividades = await prismaActividad.findMany({
            where: {
                run_alumno: alumno?.run,
                fecha_actividad: {
                    gte: traerFechaInicioMes(),
                    lt: traerFechaFinMes()
                },
                estado: true
            }
        })

        actividades.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;

            if (inicio && termino) {
                horasMes += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }
        })

        montoAcumulado = horasMes * tarifa
        const montoFormateado: string = formatearMonto(montoAcumulado)

        res.status(200).json({ montoFormateado, horasMes })

    } catch (error) {
        res.status(500).json({ message: 'Error en el server!' })
    }

}

//GET ACTIVIDADES traera todas las actividades del mes actual
export const traerActividadesMes = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const alumno = await prismaAlumno.findUnique({ where: { email: email } })
        const actividades = await prismaActividad.findMany({
            where: {
                run_alumno: alumno?.run,
                fecha_actividad: {
                    gte: traerFechaInicioMes(),
                    lt: traerFechaFinMes()
                },
            },
            include: {
                area_trabajo: true
            }
        })
        actividades.forEach((actividad) => {
            actividad = formatearActividad(actividad)
        })
        res.status(200).json({ actividades })

    } catch (error) {
        res.status(500).json({ message: 'Error en el server!' })
    }

}

//GET HORAS MENSUALES DE CADA AREA
export const traerHorasAreaMes = async (req: Request, res: Response): Promise<void> => {
    let difusion: number = 0
    let extension: number = 0
    let desarrollo_laboral: number = 0
    let comunicacion: number = 0


    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const alumno = await prismaAlumno.findUnique({ where: { email: email } })
        const actividades = await prismaActividad.findMany({
            where: {
                run_alumno: alumno?.run,
                fecha_actividad: {
                    gte: traerFechaInicioMes(),
                    lt: traerFechaFinMes()
                },estado:true
            },
            include: {
                area_trabajo: true
            }
        })
        actividades.forEach((actividad) => {
            switch (actividad.area_trabajo_id) {
                case 1:
                    difusion += calcularDiferenciaHoras(actividad)
                    break;
                case 2:
                    extension += calcularDiferenciaHoras(actividad)
                    break;
                case 3:
                    comunicacion += calcularDiferenciaHoras(actividad)
                    break;
                case 4:
                    desarrollo_laboral += calcularDiferenciaHoras(actividad)
                    break;
                default:
                    break;
            }
        })
        res.status(200).json({ difusion, comunicacion, extension, desarrollo_laboral })

    } catch (error) {
        res.status(500).json({ message: 'Error en el server!' })
    }
}

export const traerAreasTrabajo = async (req: Request, res: Response): Promise<void> => {
    try {
        const areasTrabajo = await prismaArea.findMany()
        res.status(200).json({ areasTrabajo })

    } catch (error) {
        res.status(500).json({ message: 'error en el server' })
    }
}