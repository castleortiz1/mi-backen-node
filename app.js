// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const usuarioRoutes = require("./routes/usuarioRoutes");
const db = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por IP
});

app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://127.0.0.1:5500",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    },
  },
}));

app.use("/api/usuarios", usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err.stack);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

app.listen(PORT, async () => {
  try {
    await db.getConnection();
    console.log("✅ Conectado a MySQL");
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Error al conectar con MySQL:", err);
  }
});