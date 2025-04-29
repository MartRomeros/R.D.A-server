import express from 'express'
import { login, recuperarClave, registrar } from '../controllers/auth.controller'

const router = express.Router()

router.post('/login', login)
router.post('/registro', registrar)
router.put('/forgot-password', recuperarClave)

export default router