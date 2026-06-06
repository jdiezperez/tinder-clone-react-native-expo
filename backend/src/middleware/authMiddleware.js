import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No autorizado" });

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ message: "Formato de token inválido" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
    // Attach safe user
    req.user = { id: user.id, name: user.name, email: user.email, bio: user.bio, photo: user.photo };
    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};