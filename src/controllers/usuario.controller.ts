import usuario from '../models/user'
import { Request, Response } from 'express'
import { hashPassword } from '../services/authServices'

export const traerUsuarioByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = req.cookies.email
    if (!email) {
        res.status(404).json({ message: 'email no encontrado!' })
        return
    }

    try {
        const user = await usuario.findUnique({ where: { email: email } })
        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })

    }
}

export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
    const email = req.cookies.email
    if (!email) {
        res.status(404).json({ message: 'email no encontrado!' })
        return
    }
    const { password, fono } = req.body
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
        res.status(200).json({message:'credenciales actualizadas!'})

    } catch (error: any) {
        res.status(500).json({ error })
    }

}