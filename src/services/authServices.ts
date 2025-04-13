import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Alumno } from '../models/interfaces'

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
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'
export const generateToken = (alumno: Alumno): string => {
    return jwt.sign({ id: alumno.id_alumno, email: alumno.email_alumno }, JWT_SECRET, { expiresIn: '1h' })

}