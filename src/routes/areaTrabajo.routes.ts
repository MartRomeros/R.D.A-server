import express from 'express'
import { traerAreasTrabajo } from '../controllers/areasTrabajoController'

const router = express.Router()

router.get('/', traerAreasTrabajo)

export default router