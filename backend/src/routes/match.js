import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todos los matches del usuario logueado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      include: {
        userA: { select: { id: true, name: true, photo: true } },
        userB: { select: { id: true, name: true, photo: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // Formatear para devolver solo el otro usuario
    const formatted = matches.map(m => {
      const other = m.userAId === userId ? m.userB : m.userA;
      return { id: other.id, name: other.name, photo: other.photo, matchId: m.id };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener matches" });
  }
});

export default router;