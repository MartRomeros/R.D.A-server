import { Request, Response } from "express";
import prismaAlumno from '../models/alumno'
import { comparePasswords, generateToken, hashPassword } from '../services/authServices'
import { Alumno } from "../models/interfaces";


//traer alumnos de la bd
export const allAlumnos = async (req: Request, res: Response): Promise<void> => {
    try {
        const alumnos = await prismaAlumno.findMany()
        res.status(200).json({ alumnos })
    } catch (error: any) {
        res.status(500).json({ message: 'error en el server' })
        console.error(error)
    }
}

//crear un alumno
export const insertAlumno = async (req: Request, res: Response): Promise<void> => {
    const { run_alumno, nombre_alumno, apellido_paterno_alumno, apellido_materno_alumno, email_alumno, fono_alumno } = req.body

    //verificar campos vacios
    const valores = Object.keys(req.body)
    for (let i = 0; i < valores.length; i++) {

        if (!req.body[valores[i]]) {
            res.status(400).json({ message: `El campo ${valores[i]} esta vacio!` })
            return
        }

    }

    //generar password provisoria
    const letraApellido = apellido_paterno_alumno[0].toUpperCase()
    const passwordProvisoria = letraApellido + run_alumno

    try {
        //encriptar la password del alumno
        const hashedPassword = await hashPassword(passwordProvisoria)
        //insertar el alumno
        await prismaAlumno.create({
            data: {
                run_alumno: run_alumno,
                nombre_alumno: nombre_alumno,
                apellido_paterno_alumno: apellido_paterno_alumno,
                apellido_materno_alumno: apellido_materno_alumno,
                email_alumno: email_alumno,
                fono_alumno: fono_alumno,
                password: hashedPassword
            }
        })

        res.status(201).json({ message: 'Alumno creado!!' })


    } catch (error: any) {
        res.status(500).json({ message: 'error en el server!' })
    }

}

//autenticar alumno
export const alumnoLogin = async (req: Request, res: Response) => {
    const { email_alumno, password } = req.body
    //verificar campos vacios!
    if (!email_alumno) {
        res.status(400).json({ message: 'email es obligatorio!' })
        return
    }
    if (!password) {
        res.status(400).json({ message: 'Clave es obligatoria!' })
        return
    }

    try {
        //econtrar al alumno por el correo
        const alumno = await prismaAlumno.findUnique({ where: { email_alumno } })
        if (!alumno) {
            res.status(404).json({ message: 'El alumno no existe!' })
            return
        }
        //verificar si la password es correcta
        const passwordMatch = await comparePasswords(password, alumno.password!)
        if (!passwordMatch) {
            res.status(401).json({ message: 'Las credenciales no coinciden!' })
            return
        }

        const iAlumno:Alumno = alumno
        const token = generateToken(iAlumno)
        res.status(200).json({ message: 'login exitoso!', token:token})


    } catch (error: any) {
        res.status(500).json({ message: 'error en el server!' })

    }

}