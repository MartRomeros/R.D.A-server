import expres from 'express'
import { authenticatedToken } from '../services/authServices'
import { traerAdmin, traerAlumno, traerAlumnos, traerTotales } from '../controllers/admin/admin.controller'

const router = expres.Router()

router.get('/',authenticatedToken,traerAdmin)
router.get('/alumnos',authenticatedToken,traerAlumnos)
router.get('/alumno/:run',authenticatedToken,traerAlumno)
router.get('/totales',authenticatedToken,traerTotales) 

export default router