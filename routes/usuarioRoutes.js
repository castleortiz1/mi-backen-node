// routes.usuarioRoutes.js
const express = require("express");
const {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  validarRegistro,
} = require("../controllers/usuarioController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Rutas públicas
router.post("/registrar", validarRegistro, registrarUsuario);
router.post("/login", loginUsuario);

// Rutas protegidas (requieren autenticación)
router.get("/listar", authMiddleware, listarUsuarios); // Lista todos los usuarios
router.get("/:id", authMiddleware, obtenerUsuario); // Obtiene un usuario por ID
router.put("/:id", authMiddleware, isAdmin, actualizarUsuario); // Actualiza un usuario (solo admin)
router.delete("/:id", authMiddleware, isAdmin, eliminarUsuario); // Elimina un usuario (solo admin)

module.exports = router;