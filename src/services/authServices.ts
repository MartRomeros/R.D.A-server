import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { Usuario } from '../models/interfaces'



//encriptar la password
const SALT_ROUNDS = 10
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

//matchear la password
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

//generar token
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
export const generateToken = (usuario: Usuario): string => {
    return jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '8h' })
}


//MIDDLEWARE PARA MANEJAR PETICIONES (JWT)
export const authenticatedToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'no autorizado!' })
        return
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {

        if (err) {
            return res.status(403).json({ message: 'No tienes acceso a este recurso' })
        }

        next()
    })
}

interface Payload {
    id: number,
    email: string
}

//extraer email del token
export const traerMailDelToken = (token: string): string | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as Payload
        return decoded.email

    } catch (error) {
        console.error(error)
        return null
    }
}

