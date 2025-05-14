import dotenv from 'dotenv' //importamos dotenv para manejar variables de entorno
import express from 'express' //importamos el framework express
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import actividadRoutes from './routes/actividad.routes'
import cookieParser from 'cookie-parser'


dotenv.config()

const app = express()

app.use(cookieParser())

app.use(express.json())

app.use(cors({
    origin:true,
    methods:['GET','POST','PUT'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true
}))


app.use('/auth',authRoutes)
app.use('/user',userRoutes)
app.use('/actividad',actividadRoutes)

console.log('levantando aplicacion!')



export default app

