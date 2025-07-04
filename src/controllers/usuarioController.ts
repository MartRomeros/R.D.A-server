import { Request, Response } from "express"
import { traerMailDelToken } from "../services/authServices"
import { Usuario } from "../models/interfaces"
import { pool } from "../app"




//Obtener el usuario por el email
export const traerUsuarioMail = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
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

        res.status(200).json({ tipo_usuario_id: usuario.tipo_usuario_id })

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally{
        client.release()
    }

}