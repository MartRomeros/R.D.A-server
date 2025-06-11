import { Request, Response } from "express"
import usuario from '../models/user'
import { Usuario } from '../models/interfaces'
import { comparePasswords, generateToken, hashPassword } from "../services/authServices"
import { sendRecuperarClaveMail } from "../services/mailServices"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"


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

    try {
        const user = await usuario.findUnique({ where: { email } })

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado!' })
            return
        }

        const iUser: Usuario = user
        const passwordMatch = await comparePasswords(password, user.password!)

        if (!passwordMatch) {
            res.status(401).json({ message: 'credenciales incorrectas' })
            console.log(passwordMatch)
            return
        }

        const token = generateToken(iUser)

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        res.status(200).json({ tipoUsuario: iUser.tipo_usuario_id })

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
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

    try {

        const user = await usuario.findUnique({ where: { email } })

        if (!user) {
            res.status(404).json({ message: 'el usuario no existe' })
            return
        }

        const password: string = user?.apellido_paterno[0].toLocaleUpperCase() + user.run
        const hashedPassword: string = await hashPassword(password)

        await usuario.update({ data: { password: hashedPassword }, where: { email } })

        sendRecuperarClaveMail(email)

        res.status(200).json({ message: 'clave actualizada!, en instantes te llegara un correo con las instrucciones!' })



    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
        console.error(error)
    }

}


//REGISTRO
export const registrar = async (req: Request, res: Response): Promise<void> => {

    const { run, nombre, apellidoPaterno, apellidoMaterno, fono, email, tipoUsuario,areaTrabajoId } = req.body
    const claves = Object.keys(req.body)

    for (let i = 0; i < claves.length; i++) {
        if (!req.body[claves[i]]) {
            res.status(400).json({ message: `Campo ${claves[i]} incompleto!` })
            return
        }
    }

    const passwordProvisoria: string = apellidoPaterno[0] + run

    try {

        const hashedPassword = await hashPassword(passwordProvisoria)
        await usuario.create({
            data: {
                run: run,
                nombre: nombre,
                apellido_materno: apellidoMaterno,
                apellido_paterno: apellidoPaterno,
                email: email,
                fono: fono,
                password: hashedPassword,
                tipo_usuario_id: tipoUsuario,
                area_trabajo_id:areaTrabajoId
            }
        })

        res.status(201).json({ message: 'usuario creado' })


    } catch (error: any | PrismaClientKnownRequestError) {
        res.status(500).json({ message: 'error en el server' })
        console.log(error)
    }

}

//GET Controlador para demostrar si estamos autenticados
export const isAuthenticated = (req: Request, res: Response) => {
    res.status(200).json({ isAuthenticated: true })
}