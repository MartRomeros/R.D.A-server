import { Request, Response } from "express";
import prismaAreaTrabajo from '../models/areaTrabajo'

export const traerAreaTrabajo = async (req:Request,res:Response): Promise<void> => {
    try {
        const areas = await prismaAreaTrabajo.findMany()
        res.status(200).json({areas})
    } catch (error:any) {
        res.status(500).json({message:'error en el server'})
    }
}