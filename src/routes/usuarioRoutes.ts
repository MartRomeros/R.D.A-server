import express from 'express'
import { traerUsuarioMail } from '../controllers/usuarioController'

const router = express.Router()

router.get('/', traerUsuarioMail)

export default router