import { Server, Socket } from "socket.io";

const adminSockets = new Set<string>()
const studentSockets = new Set<string>()

export function setupSocketIO(io: Server) {
    io.on("connection", (socket: Socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on("registerAsAdmin", () => {
            adminSockets.add(socket.id);
            console.log("Admin registrado:", socket.id);
        });

        socket.on("disconnect", () => {
            adminSockets.delete(socket.id);
            console.log("Usuario desconectado:", socket.id);
        });

        socket.on("registerAsStudent", () => { // NUEVO
            studentSockets.add(socket.id);
            console.log("Alumno registrado:", socket.id);
        });

        socket.on("disconnect", () => {
            adminSockets.delete(socket.id);
            studentSockets.delete(socket.id); // NUEVO
            console.log("Usuario desconectado:", socket.id);
        });


    });
}

export function notifyAdmins(io: Server, message: string) {
    for (const socketId of adminSockets) {
        io.to(socketId).emit("adminNotification", message);
    }
}

export function notifyStudents(io: Server, message: string) { // NUEVO
    for (const socketId of studentSockets) {
        io.to(socketId).emit("studentNotification", message);
    }
}