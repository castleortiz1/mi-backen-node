const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/registrar', usuarioController.validarRegistro, usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware, isAdmin, usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, usuarioController.obtenerUsuario);
router.put('/:id', authMiddleware, usuarioController.actualizarUsuario);
router.delete('/:id', authMiddleware, isAdmin, usuarioController.eliminarUsuario);

module.exports = router;