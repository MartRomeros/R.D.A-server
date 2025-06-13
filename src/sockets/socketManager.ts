import { Server, Socket } from "socket.io";

const adminSockets = new Set<string>()

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
    });
}

export function notifyAdmins(io: Server, message: string) {
    for (const socketId of adminSockets) {
        io.to(socketId).emit("adminNotification", message);
    }
}