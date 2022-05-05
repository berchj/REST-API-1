const { response, request } = require("express");
const pool = require("../db/config");
const { validationResult } = require("express-validator");
const getRecord = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT 
                usuarios.nombre,
                usuarios.email,
                historial_de_login.id_historial_de_login,
                historial_de_login.fecha_hora,
                historial_de_login.tipo 
               FROM historial_de_login INNER JOIN usuarios WHERE historial_de_login.id_historial_de_login = usuarios.id_usuarios AND id_historial_de_login = ${connection.escape(
        req.params.id
      )}`;
      connection.query(q, (error, rows, fields) => {
        if (error) throw error;
        if (!rows.length) {
          return res.status(404).json({ error: "resource not found" });
        }
        return res.status(200).json({ data: rows[0] });
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const getRecords = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT usuarios.nombre,
                usuarios.email,
                historial_de_login.id_historial_de_login,
                historial_de_login.fecha_hora,
                historial_de_login.tipo 
               FROM historial_de_login INNER JOIN usuarios WHERE historial_de_login.usuarios_id_usuario = usuarios.id_usuarios`;
      connection.query(q, (err, rows, fields) => {
        if (!rows.length) {
          return res.status(404).json({ message: "resources not found" });
        }
        return res.status(200).json({ data: rows });
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const deleteRecord = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `DELETE FROM historial_de_login WHERE id_historial_de_login = ${connection.escape(
        req.params.id
      )}`;
      connection.query(q, (error, rows, fields) => {
        if (error) throw error;
        if(!rows.length){
          return res.status(404).json({error:"not found"})
        }
        return res.status(200).json({ message: "record deleted successfully" });
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const putRecord = async (req = request, res = response) => {
  const { tipo } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `UPDATE historial_de_login SET tipo = ? WHERE id_historial_de_login = ${connection.escape(
        req.params.id
      )}`;
      connection.query(q, [tipo], (error, rows,fields) => {
        if (error) throw error;
        if (!rows.length) {
          return res.status(404).json({ error: "resource not found" });
        }
        return res
          .status(200)
          .json({ message: "resource updated successfully" });
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const postRecord = async (req = request, res = response) => {
  const { tipo, usuarios_id_usuario } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `INSERT INTO historial_de_login (fecha_hora,tipo,usuarios_id_usuario) VALUES (
        ${connection.escape(new Date())},
        ${connection.escape(tipo)},
        ${connection.escape(usuarios_id_usuario)})`;
      connection.query(q, (error, rows,fields) => {
        if (error) throw error;
        if (!rows.length) {
          return res.status(200).json({ error: "error creating resource" });
        }
        return res
          .status(200)
          .json({ message: "resource created successfully" });
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
module.exports = {
  getRecords,
  getRecord,
  deleteRecord,
  putRecord,
  postRecord,
};
