import dotenv from 'dotenv' //importamos dotenv para manejar variables de entorno
import express from 'express' //importamos el framework express
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import usuarioRoutes from './routes/usuarioRoutes'
import alumnoRoutes from './routes/alumnoRoutes'
import areaTrabajoRoutes from './routes/areaTrabajo.routes'
import cookieParser from 'cookie-parser'
import { Pool } from 'pg'


dotenv.config()

const app = express()

app.use(cookieParser())

app.use(express.json())

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

export const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: parseInt(process.env.PG_PORT || '5432'),
    max: 100,
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Acepta certificados autofirmados (en producción puedes usar certificados válidos)
    },
})



app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/area_trabajo', areaTrabajoRoutes)
app.use('/alumno', alumnoRoutes)

console.log('levantando aplicacion!')



export default app

