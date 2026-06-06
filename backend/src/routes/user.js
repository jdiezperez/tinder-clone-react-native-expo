import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Obtener perfil del usuario logueado
router.get("/me", authMiddleware, async (req, res) => {
  try {
		const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		include: {
				photos: {
				orderBy: { createdAt: "asc" },
				},
		},
		select: {
				id: true,
				name: true,
				email: true,
				bio: true,
				createdAt: true,
				photos: {
				select: {
						id: true,
						url: true,
						isPrimary: true,
				},
				},
		},
		});
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// Actualizar perfil
router.put("/me", authMiddleware, async (req, res) => {
  try {
    console.log("Edit profile")
    const { name, bio, photo } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, bio, photo },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

// Obtener lista de usuarios para mostrar en el feed
router.get("/feed", authMiddleware, async (req, res) => {
	try {
    // Excluimos al usuario actual
    const users = await prisma.user.findMany({
      where: { id: { not: req.user.id } },
      select: {
        id: true,
        name: true,
        bio: true,
        photos: {
          where: { isPrimary: true },
          select: { url: true },
        },
      },
    });

    // Si un usuario no tiene foto principal, añadimos una por defecto
    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      bio: u.bio,
      photo: u.photos[0]?.url || "https://placekitten.com/300",
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al cargar feed" });
  }
});

export default router;