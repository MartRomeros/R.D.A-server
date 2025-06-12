import express from 'express'
import { authenticatedToken } from '../services/authServices'
import { resumenMes, traerActividadesMes, traerAreasTrabajo, traerHorasAreaMes } from '../controllers/alumno/alumno.controller'

const router = express.Router()

router.get('/resumen', authenticatedToken, resumenMes)
router.get('/actividades_mes', authenticatedToken, traerActividadesMes)
router.get('/horas_area_mes', authenticatedToken, traerHorasAreaMes)
router.get('/areas',authenticatedToken,traerAreasTrabajo)

export default router