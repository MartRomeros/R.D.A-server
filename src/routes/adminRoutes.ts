import express from 'express'
import { aprobarSolicitud, notificarRechazoActividad, registrarAllOC, registrarOC, traerActividadesAlumno, traerAlumnosAyudantes, traerDetallesAlumnos, traerInfoAlumno, traerResumenMes, traerSolicitudActualizar, traerSolicitudes, traerSolicitudesMesArea } from '../controllers/adminController'
import { authenticatedToken } from '../services/authServices'


const router = express.Router()

router.get('/solicitudes_mes', authenticatedToken, traerSolicitudesMesArea)
router.get('/solicitud/:id', authenticatedToken, traerSolicitudActualizar)
router.get('/solicitudes', authenticatedToken, traerSolicitudes)
router.get('/resumen_mes', authenticatedToken, traerResumenMes)
router.get('/alumnos_ayudantes', authenticatedToken, traerAlumnosAyudantes)
router.get('/info_alumno/:run', authenticatedToken, traerInfoAlumno)
router.get('/actividades_alumno/:run', authenticatedToken, traerActividadesAlumno)
router.get('/exportar', authenticatedToken, traerDetallesAlumnos)
router.put('/actualizar_solicitud/:id', authenticatedToken, aprobarSolicitud)
router.post('/registrar_oc', authenticatedToken, registrarOC)
router.post('/registrar_all_oc', authenticatedToken, registrarAllOC)
router.get('/notificar_rechazo', authenticatedToken, notificarRechazoActividad)

export default router