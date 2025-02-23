// models.Usuario.js
const db = require("../config/database");

class Usuario {
  static async crear(nombre, email, password, role) {
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
      [nombre, email, password, role]
    );
    return result;
  }

  static async encontrarPorEmail(email) {
    const [results] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    return results[0];
  }
}

module.exports = Usuario;