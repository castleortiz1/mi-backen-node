const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');

dotenv.config();

// Validaciones
exports.validarRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Registrar un nuevo usuario
exports.registrarUsuario = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password, role } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al hashear la contraseña' });
    }

    Usuario.crear(nombre, email, hashedPassword, role, (err, results) => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al crear el usuario' });
      }
      res.status(201).json({ mensaje: 'Usuario registrado', id: results.insertId });
    });
  });
};

// Iniciar sesión
exports.loginUsuario = (req, res) => {
  const { email, password } = req.body;

  Usuario.encontrarPorEmail(email, (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const usuario = results[0];

    bcrypt.compare(password, usuario.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ id: usuario.id, role: usuario.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ mensaje: 'Login exitoso', token });
    });
  });
};

// Obtener todos los usuarios (solo para administradores)
exports.listarUsuarios = (req, res) => {
  Usuario.listar((err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al listar usuarios' });
    }
    res.json(results);
  });
};

// Obtener un usuario por ID
exports.obtenerUsuario = (req, res) => {
  const { id } = req.params;

  Usuario.encontrarPorId(id, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(results[0]);
  });
};

// Actualizar un usuario
exports.actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, role } = req.body;

  Usuario.actualizar(id, nombre, email, role, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
};

// Eliminar un usuario
exports.eliminarUsuario = (req, res) => {
  const { id } = req.params;

  Usuario.eliminar(id, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
};