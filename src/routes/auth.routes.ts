import express from 'express'
import { isAuthenticated, login, logout, recuperarClave, registrar } from '../controllers/auth.controller'
import { authenticatedToken } from '../services/authServices'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

router.post('/login', login)
router.post('/logout', logout)
router.post('/registro', registrar)
router.put('/forgot_password', recuperarClave)
router.get('/is_authenticated',authenticatedToken,isAuthenticated)

export default router