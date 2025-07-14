import express from 'express'
import { traerUsuarioMail, updatePassword } from '../controllers/usuarioController'

const router = express.Router()

router.get('/', traerUsuarioMail)
router.put('/update',updatePassword)

export default router