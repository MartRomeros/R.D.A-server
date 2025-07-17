import express from 'express'
import { traerAreasTrabajo } from '../controllers/areasTrabajoController'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()

router.get('/', authenticatedToken,traerAreasTrabajo)

export default router