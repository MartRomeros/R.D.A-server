import express from 'express'
import { aprobarSolicitud, registrarAllOC, registrarOC, traerActividadesAlumno, traerAlumnosAyudantes, traerDetallesAlumnos, traerInfoAlumno, traerResumenMes, traerSolicitudActualizar, traerSolicitudes, traerSolicitudesMesArea } from '../controllers/adminController'


const router = express.Router()

router.get('/solicitudes_mes',traerSolicitudesMesArea)
router.get('/solicitud/:id',traerSolicitudActualizar)
router.get('/solicitudes',traerSolicitudes)
router.get('/resumen_mes',traerResumenMes)
router.get('/alumnos_ayudantes',traerAlumnosAyudantes)
router.get('/info_alumno/:run',traerInfoAlumno)
router.get('/actividades_alumno/:run',traerActividadesAlumno)
router.get('/exportar',traerDetallesAlumnos)
router.put('/actualizar_solicitud/:id',aprobarSolicitud)
router.post('/registrar_oc',registrarOC)
router.post('/registrar_all_oc',registrarAllOC)

export default router