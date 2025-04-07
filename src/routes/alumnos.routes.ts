import express, { Router } from 'express'
import {allAlumnos} from '../controllers/alumno.controller'

const router = express.Router()

router.get('/all_alumnos',allAlumnos)

export default router