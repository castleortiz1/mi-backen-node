const connection = require('../config/database');

class Usuario {
  static crear(nombre, email, password, role, callback) {
    const query = 'INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)';
    connection.query(query, [nombre, email, password, role], callback);
  }

  static encontrarPorEmail(email, callback) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], callback);
  }

  static encontrarPorId(id, callback) {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }

  static actualizar(id, nombre, email, role, callback) {
    const query = 'UPDATE usuarios SET nombre = ?, email = ?, role = ? WHERE id = ?';
    connection.query(query, [nombre, email, role, id], callback);
  }

  static eliminar(id, callback) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    connection.query(query, [id], callback);
  }

  static listar(callback) {
    const query = 'SELECT id, nombre, email, role, createdAt FROM usuarios';
    connection.query(query, callback);
  }
}

module.exports = Usuario;