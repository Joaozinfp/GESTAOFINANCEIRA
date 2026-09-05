import { Router } from "express";
import multer from "multer";
import path from "path";
import { lerPDF } from "../utils/pdfReader.js";
import { extrairTransacoes } from "../utils/extratoParser.js";
import { classificarTransacao } from "../utils/classificador.js";
import { database } from "../config/database.js";




const router = Router();

const storage = multer.diskStorage({
  destination: "src/uploads",

  filename: (req, file, cb) => {
    const nomeArquivo = `${Date.now()}${path.extname(file.originalname)}`;

    cb(null, nomeArquivo);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    }

    cb(null, true);
  },
});

router.post("/extrato/upload", upload.single("extrato"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      mensagem: "Nenhum arquivo foi enviado.",
    });
  }
  const texto = await lerPDF(req.file.path);
  const transacoes = extrairTransacoes(texto);

const transacoesClassificadas = transacoes.map((transacao) => ({
  ...transacao,
  categoria: classificarTransacao(transacao.descricao),
}));

for (const transacao of transacoesClassificadas) {
  await database.query(
    `
    INSERT INTO transacoes (
      usuario_id,
      data_transacao,
      descricao,
      valor,
      tipo,
      categoria
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      1,
      transacao.data,
      transacao.descricao,
      transacao.valor,
      transacao.tipo,
      transacao.categoria,
    ]
  );
}

console.log("========== TRANSAÇÕES CLASSIFICADAS ==========");
console.log(transacoesClassificadas);
console.log("==============================================");


console.log("========== TEXTO DO PDF ==========");
console.log(texto);
console.log("==================================");

  return res.json({
    mensagem: "Extrato recebido com sucesso!",
    arquivo: req.file.filename,
  });
});

router.get("/transacoes", async (req, res) => {
  try {
    const [transacoes] = await database.query(`
      SELECT
        id,
        data_transacao,
        descricao,
        valor,
        tipo,
        categoria
      FROM transacoes
      WHERE usuario_id = ?
      ORDER BY data_transacao DESC, id DESC
    `, [Number(req.query.usuario_id)]);

    return res.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);

    return res.status(500).json({
      mensagem: "Erro ao buscar transações.",
    });
  }
});


router.get("/resumo", async (req, res) => {
  try {
    const usuarioId = Number(req.query.usuario_id)
    const [resultado] = await database.query(
      `
      SELECT
        COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0) AS receitas,
        COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0) AS despesas
      FROM transacoes
      WHERE usuario_id = ?
      `,
      [Number(req.query.usuario_id)]
    );

    const resumo = (resultado as any[])[0];

    const receitas = Number(resumo.receitas);
    const despesas = Number(resumo.despesas);

    res.json({
      receitas,
      despesas,
      saldo: receitas - despesas,
    });
  } catch (error) {
    console.error("Erro ao buscar resumo:", error);

    res.status(500).json({
      mensagem: "Erro ao buscar resumo financeiro.",
    });
  }
});

router.get("/resumo/despesas-categoria", async (req, res) => {
  try {
    const usuarioId = Number(req.query.usuario_id)
    const [resultado] = await database.query(
      `
      SELECT
        categoria,
        SUM(valor) AS valor
      FROM transacoes
      WHERE usuario_id = ?
        AND tipo = 'despesa'
      GROUP BY categoria
      ORDER BY valor DESC
      `,
      [usuarioId]
    );

    const despesas = (resultado as any[]).map((item) => ({
      categoria: item.categoria,
      valor: Number(item.valor),
    }));

    return res.json(despesas);
  } catch (error) {
    console.error(
      "Erro ao buscar despesas por categoria:",
      error
    );

    return res.status(500).json({
      mensagem: "Erro ao buscar despesas por categoria.",
    });
  }
});

router.get("/resumo/evolucao", async (req, res) => {
  try {
    const usuarioId = Number(req.query.usuario_id)
    const meses = Number(req.query.meses) || 6;
    const [resultado] = await database.query(
      `
      SELECT
        DATE_FORMAT(data_transacao, '%Y-%m') AS mes,
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'receita' THEN valor
              ELSE 0
            END
          ),
          0
        ) AS receitas,
        COALESCE(
          SUM(
            CASE
              WHEN tipo = 'despesa' THEN valor
              ELSE 0
            END
          ),
          0
        ) AS despesas
      FROM transacoes
      WHERE usuario_id = ?
        AND data_transacao >= DATE_SUB(
          DATE_FORMAT(CURDATE(), '%Y-%m-01'),
          INTERVAL ? MONTH
        )
      GROUP BY DATE_FORMAT(data_transacao, '%Y-%m')
      ORDER BY mes ASC
      `,
      [usuarioId, meses - 1]
    );

    const dados = resultado as {
  mes: string;
  receitas: number;
  despesas: number;
}[];

const evolucao = [];

const hoje = new Date();

for (let i = meses - 1; i >= 0; i--) {
  const data = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - i,
    1
  );

  const ano = data.getFullYear();
  const mesNumero = String(data.getMonth() + 1).padStart(2, "0");

  const mes = `${ano}-${mesNumero}`;

  const encontrado = dados.find(
    (item) => item.mes === mes
  );

  evolucao.push({
    mes,
    receitas: encontrado
      ? Number(encontrado.receitas)
      : 0,
    despesas: encontrado
      ? Number(encontrado.despesas)
      : 0,
  });
}

return res.json(evolucao);
  } catch (error) {
    console.error(
      "Erro ao buscar evolução financeira:",
      error
    );

    return res.status(500).json({
      mensagem: "Erro ao buscar evolução financeira.",
    });
  }
});

export default router;