import express from 'express'
import { obtenerOC, registrarActividad, traerActividadesAreaMes, traerHorasAreaMes, traerHorasAreaMesActual, traerResumenMes } from '../controllers/alumnoController'
import { authenticatedToken } from '../services/authServices'


const router = express.Router()

router.post('/registrar_actividad', authenticatedToken, registrarActividad)
router.get('/horas_area_actual', authenticatedToken, traerHorasAreaMesActual)
router.get('/total_mes', authenticatedToken, traerResumenMes)
router.get('/horas_area_mes/:mes', authenticatedToken, traerHorasAreaMes)
router.get('/actividades_area_mes', authenticatedToken, traerActividadesAreaMes)
router.get('/traer_oc', authenticatedToken, obtenerOC)

export default router