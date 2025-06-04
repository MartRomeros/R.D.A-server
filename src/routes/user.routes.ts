import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { actualizarUsuario, traerAlumnosAyudantes, traerUsuarioByEmail } from '../controllers/usuario.controller'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//MIDDLEWARE PARA MANEJAR PETICIONES (JWT)
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'no autorizado! por que no hay un token' })
        return
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {

        if (err) {
            console.log('error en la autenticacion', err)
            return res.status(403).json({ message: 'No tienes acceso a este recurso' })
        }

        next()
    })
}

router.get('/user/email', authenticateToken, traerUsuarioByEmail)
router.put('/update', authenticateToken, actualizarUsuario)
router.get('/alumnos',authenticateToken,traerAlumnosAyudantes)

export default router