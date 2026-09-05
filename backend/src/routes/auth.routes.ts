import { Router } from "express";
import bcrypt from "bcrypt";
import { database } from "../config/database.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "E-mail e senha são obrigatórios.",
      });
    }

    const [usuarios] = await database.query(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ?",
      [email]
    );

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    const usuario = usuarios[0] as {
      id: number;
      nome: string;
      email: string;
      senha: string;
    };

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
         return res.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
        });
    }

    return res.json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);

    return res.status(500).json({
      mensagem: "Erro interno do servidor.",
    });
  }
});

export default router;