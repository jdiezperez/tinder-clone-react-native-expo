import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// Registrar un "swipe" (like o dislike)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userAId = req.user.id;
    const { userBId, liked } = req.body;

    // Crear el swipe
    const swipe = await prisma.swipe.create({
      data: { userAId, userBId, liked },
    });

    // Si fue un "like", comprobar si el otro usuario también dio like antes
    if (liked) {
      const mutual = await prisma.swipe.findFirst({
        where: { userAId: userBId, userBId: userAId, liked: true },
      });

      if (mutual) {
        await prisma.match.create({
					data: { userAId: userAId, userBId: userBId }
  			});
        return res.json({ match: true, swipe });
      }
    }

    res.json({ match: false, swipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar el swipe" });
  }
});

export default router;