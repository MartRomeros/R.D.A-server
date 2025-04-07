import dotenv from 'dotenv' //importamos dotenv para manejar variables de entorno
import express from 'express' //importamos el framework express
import alumnoRoutes from './routes/alumnos.routes'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/alumnos',alumnoRoutes)

console.log('levantando aplicacion!')



export default app

