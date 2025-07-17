import { Request, Response } from "express"
import { hashPassword, traerMailDelToken } from "../services/authServices"
import { Usuario } from "../models/interfaces"
import { pool } from "../app"




//Obtener el usuario por el email
export const traerUsuarioMail = async (req: Request, res: Response): Promise<void> => {
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

        res.status(200).json({ tipo_usuario_id: usuario.tipo_usuario_id, usuario })

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally {
        client.release()
    }

}

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    let token = req.cookies.token
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }
    const email = traerMailDelToken(token)
    const { newPassword } = req.body

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

        const hashedPassword = await hashPassword(newPassword)
        await client.query('CALL SP_UPDATE_NEW_PASS($1,$2)', [hashedPassword, usuario.email])

        res.status(200).json({ message: 'contraseña actualizada' })

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally {
        client.release()
    }

}