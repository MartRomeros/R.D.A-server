import express,{Router} from 'express'
import {allAlumnos,alumnoLogin,insertAlumno} from '../controllers/alumno.controller'

const router = express.Router()

router.get('/all_alumnos',allAlumnos)
router.post('/crear_alumno',insertAlumno)
router.post('/login_alumno',alumnoLogin)

export default router