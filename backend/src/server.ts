import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import { database } from "./config/database.js";
import extratoRoutes from "./routes/extrato.routes.js";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(extratoRoutes);

app.get("/", async (req, res) => {
  try {
    const [resultado] = await database.query("SELECT 1");

    res.json({
      mensagem: "API funcionando!",
      banco: "MySQL conectado!",
      resultado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao conectar com o MySQL",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});