import app from './app'
import http from 'http'
import { Server } from 'socket.io'
import { setupSocketIO } from './sockets/socketManager'

const PORT = process.env.PORT

const httpServer:any = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ['https://rda-registro.cl','http://localhost:4200'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})

setupSocketIO(io)

httpServer.listen(PORT, () => {
    console.log("escuchando en el puerto ", PORT)
})

export { io }