import usuario from '../models/user'
import { Request, Response } from 'express'
import { hashPassword, traerMailDelToken } from '../services/authServices'

export const traerUsuarioByEmail = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''

    try {
        const user = await usuario.findUnique({ where: { email: email } }) 
        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })

    }
}

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    
    const { password, fono } = req.body
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    if (!password) {
        res.status(400).json({ message: 'no hay contrasena' })
        return
    }
    if (!fono) {
        res.status(400).json({ message: 'no hay contrasena' })
        return
    }

    try {
        const hashedPassword = await hashPassword(password)
        await usuario.update({
            data: {
                fono: fono,
                password: hashedPassword
            },
            where: { email: email }
        })
        res.status(200).json({ message: 'credenciales actualizadas!' })

    } catch (error: any) {
        res.status(500).json({ error })
    }

}

export const traerAlumnosAyudantes = async (req: Request, res: Response) => {
    try {
        const alumnos = await usuario.findMany({
            where: { tipo_usuario_id: 1 }
        })
        res.status(200).json({ alumnos })
    } catch (error: any) {
        res.status(200).json({ error, message: 'error en el server!' })
    }
}