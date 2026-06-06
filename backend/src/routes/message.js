import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Obtener mensajes de un match
router.get("/:matchId", authMiddleware, async (req, res) => {
  const { matchId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { matchId: parseInt(matchId) },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
});

export default router;