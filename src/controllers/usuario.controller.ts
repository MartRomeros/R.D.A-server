import usuario from '../models/user'
import { Request, Response } from 'express'

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