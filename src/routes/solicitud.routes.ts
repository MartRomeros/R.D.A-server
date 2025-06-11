import express, { Router } from 'express'
import { authenticatedToken } from '../services/authServices'
import { aprobarSolicitud, traerSolicitudes, traerSolicitudesById } from '../controllers/solicitud.controller'

const router = express.Router()

router.get('/', authenticatedToken, traerSolicitudes)
router.put('/aprobar/:id', authenticatedToken, aprobarSolicitud)
router.get('/:id', authenticatedToken, traerSolicitudesById)

export default router


