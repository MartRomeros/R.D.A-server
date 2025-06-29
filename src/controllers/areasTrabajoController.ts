import { Request, Response } from "express"
import { pool } from "../app"
import { Area_trabajo } from "../models/interfaces"




//TRAER AREAS DE TRABAJO
export const traerAreasTrabajo = async (req: Request, res: Response): Promise<void> => {
    
    const client = await pool.connect()

    try {

        const results =  await client.query('SELECT FN_TRAER_AREAS_TRABAJO()')
        
        const areasTrabajo:Area_trabajo[] = results.rows[0].fn_traer_areas_trabajo

        res.status(200).json(areasTrabajo)

    } catch (error: any) {
        res.status(500).json({ message: 'error 501' })
        console.log(error)
    } finally{
        client.release()
    }

}
