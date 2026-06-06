import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Obtener todas las fotos del usuario
router.get("/", authMiddleware, async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "asc" },
    });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener fotos" });
  }
});

// Subir (registrar) una nueva foto (URL)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    // Si no tiene fotos previas, la primera será principal
    const count = await prisma.photo.count({ where: { userId: req.user.id } });

    const photo = await prisma.photo.create({
      data: {
        url,
        userId: req.user.id,
        isPrimary: count === 0,
      },
    });

    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al subir foto" });
  }
});

// Eliminar foto
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.photo.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Foto eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar foto" });
  }
});

// Establecer foto como principal
router.put("/:id/primary", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction([
      prisma.photo.updateMany({
        where: { userId: req.user.id },
        data: { isPrimary: false },
      }),
      prisma.photo.update({
        where: { id: Number(id) },
        data: { isPrimary: true },
      }),
    ]);

    res.json({ message: "Foto principal actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al cambiar foto principal" });
  }
});

export default router;