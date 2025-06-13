import express from 'express'
import { detallesDelAlumnoMes, filtrarActividades, filtrarHorasMes, registrarActividad, traerActividadesByRun, traerTotales, traerTotalesAlumnos } from '../controllers/alumno/actividad.controller'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()

router.post('/actividades', authenticatedToken, registrarActividad)
router.get('/actividades_alumno/', authenticatedToken, traerActividadesByRun)
router.get('/detalles_alumno/:mesYanio',authenticatedToken,detallesDelAlumnoMes)
router.get('/totales_alumno',authenticatedToken,traerTotalesAlumnos)
router.get('/horas_mes/:mesYanio',authenticatedToken,filtrarHorasMes)
router.get('/actividades_filtradas/',authenticatedToken,filtrarActividades)
router.get('/actividades/:run',authenticatedToken,traerActividadesByRun)
router.get('/totales',authenticatedToken,traerTotales)

export default router