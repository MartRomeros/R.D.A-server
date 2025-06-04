import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { calcularHorasPorMes, calcularHorasTotalesPorAlumno, registrarActividad, traerActividadesByRun } from '../controllers/actividad.controller'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//MIDDLEWARE PARA MANEJAR PETICIONES (JWT)
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'no autorizado!' })
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

router.post('/actividades', authenticateToken, registrarActividad)
router.get('/actividades/:run', authenticateToken, traerActividadesByRun)
router.get('/total_horas/:run',authenticateToken,calcularHorasTotalesPorAlumno)
router.get('/horas_mes/:mes',authenticateToken,calcularHorasPorMes)


export default router