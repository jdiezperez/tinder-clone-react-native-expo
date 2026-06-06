import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Registro
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!name || !email || !password) {
			return res.status(400).json({ message: "Faltan campos" });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		
    if (existing) return res.status(400).json({ message: "El email ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: "Usuario creado", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
		if (!email || !password) {
			return res.status(400).json({ message: "Faltan campos" });
		}
		
		const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;