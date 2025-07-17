import express from 'express'
import { traerUsuarioMail, updatePassword } from '../controllers/usuarioController'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()

router.get('/', authenticatedToken,traerUsuarioMail)
router.put('/update',authenticatedToken,updatePassword)

export default router