import { Request, Response } from "express"
import { traerMailDelToken } from "../services/authServices"
import { Actividad, Usuario } from "../models/interfaces"
import { pool } from "../app"
import { io } from "../server"
import { notifyAdmins } from "../sockets/socketManager"




//REGISTRAR ACTIVIDAD
export const registrarActividad = async (req: Request, res: Response): Promise<void> => {

    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)

    const { fecha_actividad, hora_inic_activdad, hora_term_actividad, area_trabajo } = req.body
    const claves = Object.keys(req.body)

    for (let i = 0; i < claves.length; i++) {
        if (!req.body[claves[i]]) {
            console.log(claves[i])
            res.status(400).json({ message: `Campo ${claves[i]} incompleto!` })
            return
        }
    }

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

        //validar horas
        const date = new Date(fecha_actividad);
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(date.getUTCDate()).padStart(2, "0");

        const formatted = `${yyyy}-${mm}-${dd} 00:00:00`;
        const horaInicio = `${hora_inic_activdad}:00`
        const horaFin = `${hora_term_actividad}:00`

        const registrosResults = await client.query(`
            SELECT * FROM ACTIVIDAD WHERE FECHA_ACTIVIDAD = $1 AND
            $2 BETWEEN HORA_INIC_ACTIVDAD AND HORA_TERM_ACTIVIDAD 
            OR
            FECHA_ACTIVIDAD = $3 AND
            $4 BETWEEN HORA_INIC_ACTIVDAD AND HORA_TERM_ACTIVIDAD
            AND RUN_ALUMNO = $5
            `, [formatted, horaInicio, formatted, horaFin,usuario.run])
        const registros: Actividad[] = registrosResults.rows
        if (registros.length !== 0) {
            res.status(400).json({ message: 'Ya existen registros dentro de ese rango de horas' })
            return
        }

        await client.query('CALL SP_REGISTRAR_ACTIVIDAD($1,$2,$3,$4,$5)',
            [fecha_actividad, hora_inic_activdad, hora_term_actividad, area_trabajo, usuario.run])

        notifyAdmins(io, `Nueva actividad registrada: Alumno: ${usuario.nombre} ${usuario.apellido_paterno}`)

        res.status(201).json({ message: 'Actividad registrada' })

    } catch (error: any) {
        res.status(500).json({ message: 'No es posible registrar la actividad', error })
        console.log(error)
    } finally {
        client.release()
    }

}

//TRAER HORAS POR AREA Y MES ACTUAL
export const traerHorasAreaMesActual = async (req: Request, res: Response): Promise<void> => {

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

        const horasReults = await client.query('SELECT FN_CONTAR_HORAS_MES($1)', [usuario.run])
        const horasArea = horasReults.rows[0].fn_contar_horas_mes

        res.status(200).json({ horasArea })

    } catch (error: any) {
        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)
    } finally {
        client.release()
    }
}


//TRAER HORAS TOTALES POR MES ACTUAL
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

        const horasReults = await client.query('SELECT FN_TRAER_HORAS_TOTALES_MES($1)', [usuario.run])
        const horasArea = horasReults.rows[0].fn_traer_horas_totales_mes

        const actividadesResults = await client.query('SELECT FN_TRAER_ACTIVIDADES_MES($1)', [usuario.run])
        const actividades = actividadesResults.rows[0].fn_traer_actividades_mes

        const montoAcumulado = horasArea.horas_totales_mes * parseInt(process.env.TARIFA || '0')

        res.status(200).json({ horas_totales_mes: horasArea.horas_totales_mes, actividades: actividades, monto: montoAcumulado })


        //res.status(200).json({horasArea})

    } catch (error: any) {
        res.status(500).json({ message: 'Error desconocido', error })
    } finally {
        client.release()
    }
}

//TRAER HORAS TOTALES POR MES PUEDE SER NULO O CUALQUIER MES
export const traerHorasAreaMes = async (req: Request, res: Response): Promise<void> => {

    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)

    const rawFecha = req.params.mes;
    let mes: number | null = null;

    if (rawFecha && rawFecha.trim().toLowerCase() !== 'null') {
        const parsed = parseInt(rawFecha);
        if (!isNaN(parsed)) {
            mes = parsed;
        } else {
            res.status(400).json({ error: 'El parámetro "mes" no es un número válido.' });
            return
        }
    }

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

        const horasReults = await client.query('SELECT FN_TRAER_HORAS_AREA_MES($1,$2)', [usuario.run, mes])
        const horasArea = horasReults.rows[0].fn_traer_horas_area_mes

        res.status(200).json({ horasArea })

    } catch (error: any) {
        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)
    } finally {
        client.release()
    }
}

//TRAER ACTIVIDADES POR AREA Y MES
export const traerActividadesAreaMes = async (req: Request, res: Response): Promise<void> => {

    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)

    let { mesYanio, area } = req.query;
    const mes = mesYanio === undefined ? null : mesYanio;
    const areaID = area === undefined ? null : area


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

        const actividadesResults = await client.query('SELECT FN_TRAER_ACTIVIDADES_AREA_MES($1,$2,$3)', [usuario.run, areaID, mes])
        const actividades = actividadesResults.rows[0].fn_traer_actividades_area_mes

        res.status(200).json({ actividades })

    } catch (error: any) {
        res.status(500).json({ message: 'Error desconocido', error })
        console.log(error)
    } finally {
        client.release()
    }
}

export const obtenerOC = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    const client = await pool.connect()

    try {


        const results = await client.query('SELECT FN_TRAER_USUARIO($1)', [email])
        const usuario: Usuario = results.rows[0].fn_traer_usuario

        const ocResults = await client.query('SELECT FN_TRAER_OC($1)', [usuario.id])
        const oc = ocResults.rows[0].fn_traer_oc

        res.status(200).json({ oc })

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally {
        client.release()
    }


}


