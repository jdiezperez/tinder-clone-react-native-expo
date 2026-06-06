import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import swipeRoutes from "./routes/swipe.js";
import matchRoutes from "./routes/match.js";
import messageRoutes from "./routes/message.js";
import photoRoutes from "./routes/photo.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/swipe", swipeRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/photos", photoRoutes);

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("API Tinder Clone funcionando 🚀");
});

// Crear servidor HTTP para Socket.io
const server = http.createServer(app);

// Configurar Socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Usuario ${socket.id} se unió a room ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, message, senderId }) => {
    io.to(roomId).emit("receiveMessage", { message, senderId, timestamp: new Date() });
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));


