import express from 'express'
import { actualizarUsuario, traerUsuarioByEmail } from '../controllers/usuario.controller'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()

router.get('/', authenticatedToken, traerUsuarioByEmail)
router.put('/update', authenticatedToken, actualizarUsuario)

export default router