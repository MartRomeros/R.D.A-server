import expres from 'express'
import { authenticatedToken } from '../services/authServices'
import { traerAdmin } from '../controllers/admin.controller'

const router = expres.Router()

router.get('/',authenticatedToken,traerAdmin)

export default router