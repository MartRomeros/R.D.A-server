import { Server, Socket } from "socket.io";

const adminSockets = new Set<string>()
const studentSockets = new Set<string>()

export function setupSocketIO(io: Server) {
    io.on("connection", (socket: Socket) => {

        socket.on("registerAsAdmin", () => {
            adminSockets.add(socket.id);
        });

        socket.on("registerAsStudent", () => { // NUEVO
            studentSockets.add(socket.id);
        });

        socket.on("disconnect", () => {
            adminSockets.delete(socket.id);
            studentSockets.delete(socket.id); // NUEVO
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