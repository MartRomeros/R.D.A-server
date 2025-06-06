import express from 'express'
import { actualizarUsuario, traerAlumnosAyudantes, traerUsuarioByEmail } from '../controllers/usuario.controller'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

router.get('/email', authenticatedToken, traerUsuarioByEmail)
router.put('/update', authenticatedToken, actualizarUsuario)
router.get('/alumnos',authenticatedToken,traerAlumnosAyudantes)

export default router