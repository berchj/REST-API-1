const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const pool = require("../db/config");
const { validationResult } = require("express-validator");
const getUser = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT nombre,email,fecha_nacimiento,lenguaje_programacion_favorito FROM usuarios WHERE id_usuario = ${connection.escape(
        req.params.id
      )} AND status = 1`;
      connection.query(q, (error, rows, fields) => {
        if (error) throw error;
        if(!rows.length) {
          return res.status(404).json({error:"not found"})
        }
        return res.status(200).json({data:rows[0]})
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error. Please contact an administrator",
    });
  }
};
const getUsers = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let query = `SELECT nombre,email,fecha_nacimiento,lenguaje_programacion_favorito FROM usuarios WHERE status = 1`;
      connection.query(query, (err, rows, fields) => {
        if (rows.length) {
          console.log(fields);
          return res.status(200).json({ data: rows });
        } else {
          return res.status(404).json({ error: "not found" });
        }
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error. Please contact an administrator",
    });
  }
};
const postUser = async (req = request, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const {
    nombre,
    email,
    fecha_nacimiento,
    lenguaje_programacion_favorito,
    password,
  } = req.body;
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let queryEmail = `SELECT * from usuarios WHERE email = ${connection.escape(
        email
      )}`;
      connection.query(queryEmail, (err, rows, fields) => {
        if (err) throw err;
        if (rows.length) {
          //if email already exist
          res.status(200).json({ message: "Email alredy exist" });
        } else {
          //if email doesn't exist encryp password
          const salt = bcryptjs.genSaltSync();
          const encrypted_pass = bcryptjs.hashSync(password, salt);
          //fill record in db
          let queryInsert = `INSERT INTO usuarios (nombre,email,fecha_nacimiento,lenguaje_programacion_favorito,password) VALUES (
                ${connection.escape(nombre)},
                ${connection.escape(email)},
                ${connection.escape(fecha_nacimiento)},
                ${connection.escape(lenguaje_programacion_favorito)},
                ${connection.escape(encrypted_pass)}
          ); SELECT nombre,email,fecha_nacimiento,lenguaje_programacion_favorito FROM usuarios WHERE email = ${connection.escape(email)}`;
          connection.query(queryInsert, (err, rows, fields) => {
            if (err) throw err;
            return res
              .status(201)
              .json({ message: "resource saved successfully", data: rows[1] });
          });
        }
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error. Please contact an administrator",
    });
  }
};
const putUser = async (req = request, res = response) => {
  const {
    nombre,
    email,
    fecha_nacimiento,
    lenguaje_programacion_favorito,
    password,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const salt = bcryptjs.genSaltSync();
    const encrypted_pass = bcryptjs.hashSync(password, salt);
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      //check if email alredy is in use
      let queryEmail = `SELECT * FROM usuarios WHERE email = ${connection.escape(
        email
      )} AND status = 1`;
      connection.query(queryEmail, (err, rows, fields) => {
        if (err) throw err;
        if (rows.length) {
          return res.status(400).json({ error: "email alredy in use" });
        } else {
          //if email is available
          let queryUpdate = `UPDATE usuarios SET nombre = ?, email = ?,fecha_nacimiento = ?,lenguaje_programacion_favorito = ? , password = ? WHERE id_usuario = ${connection.escape(
            req.params.id
          )} AND status = 1`;
          connection.query(
            queryUpdate,
            [
              nombre,
              email,
              fecha_nacimiento,
              lenguaje_programacion_favorito,
              encrypted_pass,
            ],
            (err, result) => {
              if (err) throw err;
              if (result) {
                return res.status(200).json({
                  error: false,
                  message: "resource updated successfully",
                });
              } else {
                return res.status(404).json({ error: "resource not found" });
              }
            }
          );
        }
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error. Please contact an administrator",
    });
  }
};
const deleteUser = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `UPDATE usuarios SET status = 0 WHERE id_usuario = ${connection.escape(
        req.params.id
      )} AND status = 1`;
      connection.query(q, (error, result) => {
        if (error) throw error;
        if (result) {
          return res
            .status(200)
            .json({ message: "resource deleted successfully" });
        } else {
          return res.status(404).json({ message: "resource not found" });
        }
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error. Please contact an administrator",
    });
  }
};
module.exports = {
  getUsers,
  postUser,
  putUser,
  deleteUser,
  getUser,
};
