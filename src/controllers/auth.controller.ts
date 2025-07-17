import { Request, Response } from "express"
import { comparePasswords, generateToken, hashPassword, traerMailDelToken } from "../services/authServices"
import { Usuario } from "../models/interfaces"
import { pool } from "../app"
import { generarMailContrasena } from "../models/mailTemplates"
import { sendRecuperarClaveMail } from "../services/mailServices"




//LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    if (!email) {
        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }

    if (!password) {
        res.status(400).json({ message: 'contraseña es obligatoria!' })
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

        const passwordMacth = await comparePasswords(password, usuario.password || '')
        if (!passwordMacth) {
            res.status(401).json({ message: 'credenciales invalidas' })
            return
        }

        const token = generateToken(usuario)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ tipo_usuario_id: usuario.tipo_usuario_id, token })


    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally {
        client.release()
    }

}

//LOGOUT
export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'none'
    })
    res.status(200).json({ message: 'logout sucessful' })

}


//RECUPERAR CLAVE
export const recuperarClave = async (req: Request, res: Response): Promise<void> => {

    const { email } = req.body

    if (!email) {
        res.status(400).json({ message: 'email es requerido!' })
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

        const password: string = usuario.apellido_paterno[0].toLocaleUpperCase() + usuario.run
        const hashedPassword: string = await hashPassword(password)
        await client.query('CALL SP_ACTUALIZAR_PSSWD($1,$2)', [email, hashedPassword])

        const mensaje = generarMailContrasena()

        sendRecuperarClaveMail(email, mensaje, 'Cambio de contraseña!', 'Se ha generado un cambio de contraseña!')

        res.status(200).json({ message: 'Contraseña actualizada!, en instantes te llegara un correo con las instrucciones!' })



    } catch (error: any) {
        res.status(500).json({ message: 'No se ha podido reestablecer tu contraseña' })
        console.error(error)
    }

}


//REGISTRO
export const registrar = async (req: Request, res: Response): Promise<void> => {

    const { run, nombre, apellidoPaterno, apellidoMaterno, fono, email, tipoUsuario, areaTrabajoId } = req.body
    const claves = Object.keys(req.body)

    for (let i = 0; i < claves.length; i++) {
        if (!req.body[claves[i]]) {
            res.status(400).json({ message: `Campo ${claves[i]} incompleto!` })
            return
        }
    }

    const client = await pool.connect()
    const passwordProvisoria: string = apellidoPaterno[0] + run

    try {

        const hashedPassword = await hashPassword(passwordProvisoria)

        await client.query('CALL SP_REGISTRAR($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            [run, nombre, apellidoPaterno, apellidoMaterno, fono, email, hashedPassword, tipoUsuario, areaTrabajoId])

        res.status(201).json({ message: 'usuario creado' })

    } catch (error: any) {

        res.status(500).json({ message: 'no es posible crear el usuario', error })
        console.log(error)

    } finally {
        client.release()
    }

}

//GET Controlador para demostrar si estamos autenticados
export const isAuthenticated = (req: Request, res: Response) => {
    res.status(200).json({ isAuthenticated: true })
}