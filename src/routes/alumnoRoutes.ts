import express from 'express'
import { obtenerOC, registrarActividad, traerActividadesAreaMes, traerHorasAreaMes, traerHorasAreaMesActual, traerResumenMes } from '../controllers/alumnoController'


const router = express.Router()

router.post('/registrar_actividad', registrarActividad)
router.get('/horas_area_actual',traerHorasAreaMesActual)
router.get('/total_mes',traerResumenMes)
router.get('/horas_area_mes/:mes',traerHorasAreaMes)
router.get('/actividades_area_mes',traerActividadesAreaMes)
router.get('/traer_oc',obtenerOC)

export default router