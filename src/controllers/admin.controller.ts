import { Request, Response } from "express";
import { traerMailDelToken } from "../services/authServices";
import prismaAdmin from '../models/user'

//GET:ID
export const traerAdmin = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.token
    const email = traerMailDelToken(token) || ''
    try {
        const administrador = await prismaAdmin.findUnique({
            where: { email: email },
            include: { area_trabajo: true }
        })
        res.status(200).json({administrador})
    } catch (error:any) {
        res.status(500).json({message:'error en el server'})
    }
}