import expres from 'express'
import { authenticatedToken } from '../services/authServices'
import { traerAreaTrabajo } from '../controllers/areaTrabajo.controller'


const router = expres.Router()

router.get('/todos',authenticatedToken,traerAreaTrabajo)

export default router