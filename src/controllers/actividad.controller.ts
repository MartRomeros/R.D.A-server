import { Request, Response } from "express";
import prismaActividad from '../models/actividad'
import prismaUsuario from '../models/user'
import actividad from "../models/actividad";
import { DateTime } from 'luxon'
import { traerMailDelToken } from "../services/authServices";
import usuario from "../models/user";

export const registrarActividad = async (req: Request, res: Response): Promise<void> => {
    const { fecha_actividad, hora_inic_activdad, hora_term_actividad, area_trabajo } = req.body
    const claves = Object.keys(req.body)

    for (let i = 0; i < claves.length; i++) {
        if (!req.body[claves[i]]) {
            res.status(400).json({ message: `Campo ${claves[i]} incompleto!` })
            return
        }
    }

    const token = req.cookies.token
    const email = traerMailDelToken(token) || ""

    try {
        const alumno = await prismaUsuario.findUnique({ where: { email: email } })
        await prismaActividad.create({
            data: {
                fecha_actividad: new Date(fecha_actividad),
                hora_inic_activdad: new Date(hora_inic_activdad),
                hora_term_actividad: new Date(hora_term_actividad),
                run_alumno: alumno!.run,
                area_trabajo_id: parseInt(area_trabajo),
                estado: false
            }
        })
        res.status(201).json({ message: 'actividad registrada!' })


    } catch (error: any) {
        console.log(error)
        res.status(500).json({ message: 'error en el server', error })

    }

}

export const traerActividadesByRun = async (req: Request, res: Response): Promise<void> => {
    const run = req.params.run

    const fechaActual = new Date()
    const mes = parseInt(`0${fechaActual.getMonth() + 1}`)
    const anio = fechaActual.getFullYear()

    const fechaInicio = new Date(anio, mes - 1, 1)
    const fechaFin = new Date(anio, mes, 1)

    let horasTotales: number = 0
    let horasTotalesMes: number = 0



    try {
        const alumno = await usuario.findUnique({ where: { run: run } })
        const actividades = await actividad.findMany({ where: { run_alumno: run } })
        //traer actividades totales y del mes
        actividades.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;

            if (inicio && termino) {
                horasTotales += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }
        })

        const actividadesMes = await actividad.findMany({
            where: {
                run_alumno: run, fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                }
            }
        })

        actividadesMes.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;

            if (inicio && termino) {
                horasTotalesMes += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }

        })


        res.status(200).json({ alumno, horasTotales, horasTotalesMes })

    } catch (error: any) {
        res.status(500).json({ message: 'error en el server', error })
    }
}

export const detallesDelAlumnoMes = async (req: Request, res: Response): Promise<void> => {
    let horasTotalesMes: number = 0
    let horasDifusion: number = 0
    let horasDesarrolloLaboral: number = 0
    let horasComunicacion: number = 0
    let horasExtension: number = 0

    const token = req.cookies.token
    const mesYanio = req.params.mesYanio

    const mes = parseInt(mesYanio.slice(0, 2))
    const anio = parseInt(mesYanio.slice(2, 6))

    const fechaInicio = new Date(anio, mes - 1, 1)
    const fechaFin = new Date(anio, mes, 1)


    try {
        const email = traerMailDelToken(token) || ""
        const alumno = await prismaUsuario.findUnique({ where: { email: email } })
        //traer horas totales por mes
        const actividadesPorMes = await prismaActividad.findMany({
            where: {
                run_alumno: alumno?.run, fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                },
            },
            include: {
                area_trabajo: {
                    select: {
                        nombre: true
                    }
                }
            }
        })
        actividadesPorMes.forEach((actividad) => {
            const horaInic = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
            const horaTerm = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
            if (!horaInic.isValid || !horaTerm.isValid) {
                console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
            }
            const diffEnHoras = horaTerm.diff(horaInic, 'hours').hours
            horasTotalesMes += diffEnHoras
        })

        //traer horas por area
        actividadesPorMes.forEach((actividad) => {
            let horaInicD
            let horaInicDL
            let horaInicC
            let horaInicE

            let horaTermD
            let horaTermDL
            let horaTermC
            let horaTermE

            switch (actividad.area_trabajo_id) {
                case 6:
                    horaInicD = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermD = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicD.isValid || !horaTermD.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasD = horaTermD.diff(horaInicD, 'hours').hours
                    horasDifusion += diffEnHorasD
                    break;
                case 9:
                    horaInicDL = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermDL = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicDL.isValid || !horaTermDL.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasDL = horaTermDL.diff(horaInicDL, 'hours').hours
                    horasDesarrolloLaboral += diffEnHorasDL
                    break;
                case 7:
                    horaInicE = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermE = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicE.isValid || !horaTermE.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasE = horaTermE.diff(horaInicE, 'hours').hours
                    horasExtension += diffEnHorasE
                    break;
                case 8:
                    horaInicC = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermC = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicC.isValid || !horaTermC.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasC = horaTermC.diff(horaInicC, 'hours').hours
                    horasComunicacion += diffEnHorasC
                    break;
                default:
                    break;
            }
        })



        res.status(200).json({
            horasTotalesMes: Math.round(horasTotalesMes),
            horasAreaMes: {
                difusion: horasDifusion,
                extension: horasExtension,
                comunicacion: horasComunicacion,
                desarrolloLaboral: horasDesarrolloLaboral
            },
            actividadesPorMes
        })

    } catch (error: any) {
        res.status(500).json({ error })
    }
}


export const traerTotalesAlumnos = async (req: Request, res: Response): Promise<void> => {
    let horasDifusion: number = 0
    let horasDesarrolloLaboral: number = 0
    let horasComunicacion: number = 0
    let horasExtension: number = 0
    const token = req.cookies.token



    try {
        const email = traerMailDelToken(token) || ""
        const alumno = await prismaUsuario.findUnique({ where: { email: email } })
        const actividades = await actividad.findMany({ where: { run_alumno: alumno?.run } });
        //traer horas por area
        actividades.forEach((actividad) => {
            let horaInicD
            let horaInicDL
            let horaInicC
            let horaInicE

            let horaTermD
            let horaTermDL
            let horaTermC
            let horaTermE

            switch (actividad.area_trabajo_id) {
                case 6:
                    horaInicD = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermD = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicD.isValid || !horaTermD.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasD = horaTermD.diff(horaInicD, 'hours').hours
                    horasDifusion += diffEnHorasD
                    break;
                case 9:
                    horaInicDL = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermDL = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicDL.isValid || !horaTermDL.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasDL = horaTermDL.diff(horaInicDL, 'hours').hours
                    horasDesarrolloLaboral += diffEnHorasDL
                    break;
                case 7:
                    horaInicE = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermE = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicE.isValid || !horaTermE.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasE = horaTermE.diff(horaInicE, 'hours').hours
                    horasExtension += diffEnHorasE
                    break;
                case 8:
                    horaInicC = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermC = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicC.isValid || !horaTermC.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasC = horaTermC.diff(horaInicC, 'hours').hours
                    horasComunicacion += diffEnHorasC
                    break;
                default:
                    break;
            }
        })

        res.status(200).json({
            horasArea: {
                difusion: horasDifusion,
                extension: horasExtension,
                comunicacion: horasComunicacion,
                desarrolloLaboral: horasDesarrolloLaboral
            }
        })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
        console.error(error)

    }
}

export const filtrarHorasMes = async (req: Request, res: Response) => {
    let horasDifusion: number = 0
    let horasDesarrolloLaboral: number = 0
    let horasComunicacion: number = 0
    let horasExtension: number = 0
    const token = req.cookies.token
    const mesYanio = req.params.mesYanio

    const mes = parseInt(mesYanio.slice(0, 2))
    const anio = parseInt(mesYanio.slice(2, 6))

    const fechaInicio = new Date(anio, mes - 1, 1)
    const fechaFin = new Date(anio, mes, 1)


    try {
        const email = traerMailDelToken(token) || ""
        const alumno = await prismaUsuario.findUnique({ where: { email: email } })
        //traer horas totales por mes
        const actividadesPorMes = await prismaActividad.findMany({
            where: {
                run_alumno: alumno?.run, fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                }
            }
        })

        //traer horas por area
        actividadesPorMes.forEach((actividad) => {
            let horaInicD
            let horaInicDL
            let horaInicC
            let horaInicE

            let horaTermD
            let horaTermDL
            let horaTermC
            let horaTermE

            switch (actividad.area_trabajo_id) {
                case 6:
                    horaInicD = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermD = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicD.isValid || !horaTermD.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasD = horaTermD.diff(horaInicD, 'hours').hours
                    horasDifusion += diffEnHorasD
                    break;
                case 9:
                    horaInicDL = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermDL = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicDL.isValid || !horaTermDL.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasDL = horaTermDL.diff(horaInicDL, 'hours').hours
                    horasDesarrolloLaboral += diffEnHorasDL
                    break;
                case 7:
                    horaInicE = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermE = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicE.isValid || !horaTermE.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasE = horaTermE.diff(horaInicE, 'hours').hours
                    horasExtension += diffEnHorasE
                    break;
                case 8:
                    horaInicC = DateTime.fromJSDate(actividad.hora_inic_activdad, { zone: 'America/Santiago' });
                    horaTermC = DateTime.fromJSDate(actividad.hora_term_actividad, { zone: 'America/Santiago' })
                    if (!horaInicC.isValid || !horaTermC.isValid) {
                        console.warn('fecha invalidad detectada para actividad ID:', actividad.id_actividad)
                    }
                    const diffEnHorasC = horaTermC.diff(horaInicC, 'hours').hours
                    horasComunicacion += diffEnHorasC
                    break;
                default:
                    break;
            }
        })



        res.status(200).json({
            horasArea: {
                difusion: horasDifusion,
                extension: horasExtension,
                comunicacion: horasComunicacion,
                desarrolloLaboral: horasDesarrolloLaboral
            }
        })

    } catch (error: any) {
        res.status(500).json({ error })
    }

}

export const filtrarActividades = async (req: Request, res: Response): Promise<void> => {
    const { mesYanio, area } = req.query
    let mes, anio, fechaInicio, fechaFin


    if (typeof mesYanio === 'string' && /^[0-9]{6}$/.test(mesYanio)) {
        mes = parseInt(mesYanio.slice(0, 2), 10);
        anio = parseInt(mesYanio.slice(2, 6), 10);
        fechaInicio = new Date(anio, mes - 1, 1)
        fechaFin = new Date(anio, mes, 1)
        // Usar mes y anio
    } else if (mesYanio !== undefined) {
        res.status(400).json({ error: 'mesYanio debe ser una cadena con formato MMYYYY' });
        return
    }

    if (typeof area !== 'string' && area !== undefined) {
        res.status(400).json({ error: 'El área debe ser una cadena' });
        return
    }

    const token = req.cookies.token
    const email = traerMailDelToken(token) || ""
    try {
        const alumno = await prismaUsuario.findUnique({ where: { email: email } })
        if (!mesYanio && area) {

            const actividadesFiltradas = await prismaActividad.findMany({
                where: {
                    run_alumno: alumno?.run,
                    area_trabajo: {
                        nombre: area
                    }
                }, include: {
                    area_trabajo: {
                        select: {
                            nombre: true
                        }
                    }
                }
            })
            res.status(200).json({ actividadesFiltradas })
        } else if (!area && mesYanio) {

            const actividadesFiltradas = await prismaActividad.findMany({
                where: {
                    run_alumno: alumno?.run,
                    fecha_actividad: {
                        gte: fechaInicio,
                        lt: fechaFin
                    }
                }
            })
            res.status(200).json({ actividadesFiltradas })

        } else if (area && mesYanio) {

            const actividadesFiltradas = await prismaActividad.findMany({
                where: {
                    run_alumno: alumno?.run,
                    fecha_actividad: {
                        gte: fechaInicio,
                        lt: fechaFin,
                    },
                    area_trabajo: {
                        nombre: area
                    }
                }, include: { area_trabajo: { select: { nombre: true } } }
            })

            res.status(200).json({ actividadesFiltradas })
        } else {

            const actividadesFiltradas = await prismaActividad.findMany({ include: { area_trabajo: true } })
            res.status(200).json({ actividadesFiltradas })
        }

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'error en el server' })

    }
}