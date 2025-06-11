import express, { Router } from 'express'
import { authenticatedToken } from '../services/authServices'
import { aprobarSolicitud, traerSolicitudes } from '../controllers/solicitud.controller'

const router = express.Router()

router.get('/', authenticatedToken, traerSolicitudes)
router.put('/aprobar/:id', authenticatedToken, aprobarSolicitud)

export default router


