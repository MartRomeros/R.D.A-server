import { Request, Response } from "express";
import { traerMailDelToken } from "../../services/authServices";
import prismaAdmin from '../../models/user'
import prismAlumno from '../../models/user'
import prismaActividad from '../../models/actividad'
import { formatearActividad } from "../../services/fechasServices";

//GET:ID esta funcion trae el administrador
export const traerAdmin = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const administrador = await prismaAdmin.findUnique({
            where: { email: email },
            include: { area_trabajo: true }
        })
        res.status(200).json({ administrador })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
    }
}

//GET/ALUMNOS esta funcion traera a todos los alumnos ayudantes y sus actividades segun el area de trabajo del admin
export const traerAlumnos = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const adminEmail = traerMailDelToken(token) || ''
    try {
        const administrador = await prismaAdmin.findUnique({ where: { email: adminEmail } })
        const areaId = administrador?.area_trabajo_id || 0


        const alumnos = await prismAlumno.findMany({
            where: { tipo_usuario_id: 1 },
            include: {
                actividades: {
                    where: {
                        area_trabajo_id: areaId,
                    },
                    include: {
                        area_trabajo: true,
                    },
                },
            },
        });
        res.status(200).json({ alumnos })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
    }
}

//GET ALUMNO POR EL RUN esta funcion traera el alumno por el run y sus actividades segun el area de trabajo del admin
export const traerAlumno = async (req: Request, res: Response): Promise<any> => {
    //traer mes actual
    const anio = new Date().getFullYear()
    const mes = parseInt(`0${new Date().getMonth() + 1}`)

    const fechaInicio = new Date(anio, mes - 1, 1)
    const fechaFin = new Date(anio, mes, 1)

    let horasTotales: number = 0
    let horasTotalesMes: number = 0

    const run = req.params.run
    const token = req.cookies.token
    const adminEmail = traerMailDelToken(token) || ''
    try {
        const administrador = await prismaAdmin.findUnique({ where: { email: adminEmail } })
        const areaId = administrador?.area_trabajo_id || 0

        const alumno = await prismAlumno.findUnique({ where: { run: run } });

        const actividades = await prismaActividad.findMany({ where: { run_alumno: run } })
        //traer actividades totales y del mes
        actividades.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;

            if (inicio && termino) {
                horasTotales += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }
        })

        const actividadesMes = await prismaActividad.findMany({
            where: {
                run_alumno: run, fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                }
            }, include: { area_trabajo: true }
        })

        actividadesMes.forEach((actividad:any) => {

            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;

            if (inicio && termino) {
                horasTotalesMes += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }

            actividad = formatearActividad(actividad)

        })


        res.status(200).json({ detalles: { ...alumno, horasTotales, horasTotalesMes,actividadesMes } });

    } catch (error) {
        res.status(500).json({ message: 'error en el server' })
    }
}

//GET funcion que treaera total de horas mes, total de horas mes por area y cantidad de alumnos
export const traerTotales = async (req: Request, res: Response): Promise<any> => {

    let totales: number = 0
    let totalesArea: number = 0
    let alumnosAyudantes: number = 0


    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''

    //traer mes actual
    const anio = new Date().getFullYear()
    const mes = parseInt(`0${new Date().getMonth() + 1}`)

    const fechaInicio = new Date(anio, mes - 1, 1)
    const fechaFin = new Date(anio, mes, 1)

    try {
        const administrador = await prismaAdmin.findUnique({ where: { email: email } })
        //traer alumnos ayudantes
        const alumnos = await prismAlumno.findMany({ where: { tipo_usuario_id: 1 } })
        alumnos.forEach(() => {
            alumnosAyudantes++
        })
        //traer horas totales del mes
        const actividades = await prismaActividad.findMany({
            where: {
                fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                }
            }
        })
        actividades.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;
            if (inicio && termino) {
                totales += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }

        })

        //traer totales del mes y del area
        const actividadesArea = await prismaActividad.findMany({
            where: {
                fecha_actividad: {
                    gte: fechaInicio,
                    lt: fechaFin
                },
                area_trabajo_id: administrador?.area_trabajo_id || 0
            }
        })
        actividadesArea.forEach((actividad) => {
            const inicio = actividad.hora_inic_activdad;
            const termino = actividad.hora_term_actividad;
            if (inicio && termino) {
                totalesArea += ((termino.getTime() - inicio.getTime()) / (1000 * 60) / 60);
            }

        })

        res.status(200).json({ alumnosAyudantes, totales, totalesArea })


    } catch (error) {
        res.status(500).json({ message: 'error en el server' })
    }

}