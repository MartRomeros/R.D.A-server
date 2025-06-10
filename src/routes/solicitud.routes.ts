import express, { Router } from 'express'
import { authenticatedToken } from '../services/authServices'
import { traerSolicitudes } from '../controllers/solicitud.controller'

const router = express.Router()

router.get('/', authenticatedToken, traerSolicitudes)

export default router


