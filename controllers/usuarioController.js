// controllers.usuarioController.js
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.validarRegistro = [
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("El email no es válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

exports.registrarUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password, role } = req.body;

  try {
    const [existingUser] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, userRole]
    );

    res.status(201).json({ mensaje: "Usuario registrado con éxito", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const usuario = results[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, nombre, email, role, createdAt FROM usuarios");
    res.json(results);
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.obtenerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("SELECT id, nombre, email, role, createdAt FROM usuarios WHERE id = ?", [id]);
    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, role } = req.body;

  try {
    const [results] = await db.query(
      "UPDATE usuarios SET nombre = ?, email = ?, role = ? WHERE id = ?",
      [nombre, email, role, id]
    );
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};