import dotenv from 'dotenv' //importamos dotenv para manejar variables de entorno
import express from 'express' //importamos el framework express
import authRoutes from './routes/auth.routes'

dotenv.config()

const app = express()

app.use(express.json())

app.use('/auth',authRoutes)

console.log('levantando aplicacion!')



export default app

