import { Request, Response } from "express";
import { traerMailDelToken } from "../services/authServices";
import { pool } from "../app";
import { AdminAlumno, Area_trabajo, ModeloOc, Usuario } from "../models/interfaces";
import { io } from "../server";
import { notifyStudents } from "../sockets/socketManager";

export const traerSolicitudesMesArea = async (req: Request, res: Response): Promise<void> => {

    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)


    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const solicitudResults = await client.query('SELECT FN_TRAER_SOLICITUDES_MES($1)', [usuario?.area_trabajo_id])
        const solicitudes = await solicitudResults.rows[0].fn_traer_solicitudes_mes
        res.status(200).json({ solicitudes })


    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerSolicitudActualizar = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    const solicitudId = parseInt(req.params.id)

    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const solicitudResults = await client.query('SELECT FN_TRAER_SOLICITUD($1)', [solicitudId])
        const solicitud = await solicitudResults.rows[0].fn_traer_solicitud

        res.status(200).json({ solicitud })


    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const aprobarSolicitud = async (req: Request, res: Response): Promise<void> => {
    const solicitudId = parseInt(req.params.id)
    const client = await pool.connect()

    try {

        await client.query('CALL SP_ACTUALIZAR_SOLICITUD($1)', [solicitudId])
        notifyStudents(io, `Se ha actualizado tu registro de hora! Id de solicitud: ${solicitudId}`)
        res.status(200).json({ message: 'solicitud aprobada' })

    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerSolicitudes = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)

    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const solicitudesResults = await client.query('SELECT FN_TRAER_SOLICITUDES($1)', [usuario?.area_trabajo_id])
        const solicitudes = solicitudesResults.rows[0].fn_traer_solicitudes
        res.status(200).json({ solicitudes })


    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerResumenMes = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)

    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const resumenResults = await client.query('SELECT FN_TRAER_ADMIN_RESUMEN($1)', [usuario?.area_trabajo_id])
        const resumen = resumenResults.rows[0].fn_traer_admin_resumen
        res.status(200).json({ resumen })


    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerAlumnosAyudantes = async (req: Request, res: Response): Promise<void> => {

    const client = await pool.connect()

    try {

        const alumnoResults = await client.query('SELECT FN_TRAER_ALUMNOS_AYUDANTES()')
        const alumnos = alumnoResults.rows[0].fn_traer_alumnos_ayudantes
        res.status(200).json({ alumnos })


    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerInfoAlumno = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    const run = req.params.run

    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const infoResults = await client.query('SELECT FN_TRAER_INFO_ALUMNO($1,$2)', [usuario?.area_trabajo_id, run])
        const infoAlumno = infoResults.rows[0].fn_traer_info_alumno

        res.status(200).json({ infoAlumno: infoAlumno })

    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerActividadesAlumno = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    const run = req.params.run

    if (!email) {

        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])

        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const actividadesResults = await client.query('SELECT FN_TRAER_ACTIVIDADES_ALUMNO($1,$2)', [run, usuario?.area_trabajo_id])
        const actividades = actividadesResults.rows[0].fn_traer_actividades_alumno

        res.status(200).json({ actividades })

    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const traerDetallesAlumnos = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    let totalesAlumnos = []

    if (!email) {
        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    const client = await pool.connect()

    try {

        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])
        const usuario: Usuario = results.rows[0].fn_traer_usuario
        if (!usuario) {
            res.status(404).json({ message: 'usuario no encontrado' })
            return
        }

        const alumnoResults = await client.query('SELECT FN_TRAER_ALUMNOS_AYUDANTES()')
        const alumnos: AdminAlumno[] = alumnoResults?.rows[0].fn_traer_alumnos_ayudantes

        const areaResults = await client.query('SELECT FN_TRAER_AREAS_TRABAJO()')
        const areasTrabajo: Area_trabajo[] = areaResults?.rows[0].fn_traer_areas_trabajo

        for (const alumno of alumnos) {
            for (const area of areasTrabajo) {
                const detallesResults = await client.query(
                    'SELECT FN_TRAER_TOTAL_AREA_ALUMNO_MES($1, $2, $3)',
                    [area.id, alumno.run, 2450]
                );
                const detalles = detallesResults.rows[0].fn_traer_total_area_alumno_mes;
                if (detalles === null) {
                    continue
                }
                totalesAlumnos.push(detalles)
            }
            const totalesResults = await client.query(
                'SELECT FN_TRAER_TOTAL_ALUMNO($1,$2)', [alumno.run, 2450]
            )
            const totales = totalesResults.rows[0].fn_traer_total_alumno
            if (totales === null) {
                continue
            }
            totalesAlumnos.push(totales)
        }
        res.status(200).json({ totalesAlumnos })

    } catch (error: any) {

        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)

    } finally {

        client.release()

    }

}

export const registrarOC = async (req: Request, res: Response): Promise<void> => {
    const { run, oc } = req.body
    const client = await pool.connect()
    try {

        await client.query('CALL SP_REGISTRAR_OC($1,$2)', [run, oc])
        notifyStudents(io, `Verifica tu orden de compra!`)
        res.status(201).json({ message: 'Orden registrada' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error descnocido', error })
    } finally {
        client.release()
    }
}

export const registrarAllOC = async (req: Request, res: Response): Promise<void> => {

    const { dato } = req.body
    const client = await pool.connect()
    const datosAProcesar: ModeloOc[] = dato

    try {
        for (let oc of datosAProcesar) {
            await client.query('CALL SP_REGISTRAR_OC($1,$2)', [oc["RUT Alumno"], oc["N° OC"]])
        }
        notifyStudents(io, `Se han registrado las órdenes de compra!`)
        res.status(201).json({ message: 'Orden registrada' })

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: 'Error descnocido', error })
    } finally {
        client.release()
    }

}

export const notificarRechazoActividad = async (req: Request, res: Response): Promise<void> => {
    notifyStudents(io, `Tu solicitud ha sido rechazada!`)
    res.status(400).json({ message: 'Notificación enviada' })
}


