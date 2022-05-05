const { response, request } = require("express");
const pool = require("../db/config");
const { validationResult } = require("express-validator");
const deleteRepository = async(req = request, res = responsen) =>{
    try {
      await pool.getConnection((error,connection)=>{
        if(error) throw error
        let q = `DELETE FROM repositorios WHERE id_repositorio = ${connection.escape(
          req.params.id
        )}`
        connection.query(q,(error,result)=>{
          if(error) throw error
          return res.status(200).json({message:"resource successfully deleted"})
        })
        connection.release()
      })
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error . Please contact an administrator",
      });
    }
}
const postRepository = async (req = request, res = response) => {
  const { nombre_proyecto, lenguaje, descripcion } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    await pool.getConnection((error, connection) => {
      //verify if repository exist
      let q = `SELECT * FROM repositorios WHERE nombre_proyecto = ${connection.escape(
        nombre_proyecto
      )}`;
      connection.query(q, (error, result) => {
        if (error) throw error;
        if (result.length) {
          return res.status(200).json({ message: "repository already exists" });
        }
        //if repository doesn't exists
        let queryInsert = `INSERT INTO repositorios (nombre_proyecto, lenguaje, fecha_creacion, descripcion,usuarios_id_usuario) VALUES (
            ${connection.escape(nombre_proyecto)},
            ${connection.escape(lenguaje)},
            ${connection.escape(new Date())},
            ${connection.escape(descripcion)},
            ${connection.escape(req.user.id_usuarios)}
        ); SELECT nombre_proyecto, lenguaje, fecha_creacion, descripcion FROM repositorios WHERE  nombre_proyecto = ${connection.escape(
          nombre_proyecto
        )}`;
        connection.query(queryInsert, (error, rows, fields) => {
          if (error) throw error;
          if (!rows.length) {
            return res.status(404).json({ error: "resource not found" });
          }
          return res
            .status(200)
            .json({ message: "resource created successfully", data: rows[1] });
        });
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const putRepository = async (req = request, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { nombre_proyecto, lenguaje, descripcion } = req.body;
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT * FROM repositorios WHERE nombre_proyecto = ${connection.escape(
        nombre_proyecto
      )}`;
      connection.query(q, (error, result) => {
        if (error) throw error;
        if (result.length) {
          return res
            .status(200)
            .json({ message: "repository name already in use" });
        }
        let queryUpdate = `UPDATE repositorios SET nombre_proyecto = ?, lenguaje = ?,descripcion = ? WHERE id_repositorio  = ${connection.escape(
          req.params.id
        )}`;
        connection.query(
          queryUpdate,
          [nombre_proyecto, lenguaje, descripcion],
          (error, rows, fields) => {
            if (error) throw error;
            if (rows.affectedRows == 1) {
              return res
                .status(200)
                .json({ message: "resource updated successfully" });
            } else {
              return res.status(404).json({ error: "resource not found" });
            }
          }
        );
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const getRepositories = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT usuarios.nombre,usuarios.email,repositorios.nombre_proyecto,repositorios.lenguaje,repositorios.descripcion FROM repositorios INNER JOIN usuarios WHERE repositorios.usuarios_id_usuario = usuarios.id_usuarios`;
      connection.query(q, (error, rows, fields) => {
        if (error) throw error;
        if (!rows.length) {
          return res.status(404).json({ error: "resources not found" });
        }
        return res.status(200).json({ data: rows });
      });
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
const getRepository = async (req = request, res = response) => {
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      let q = `SELECT usuarios.nombre,usuarios.email,repositorios.nombre_proyecto,repositorios.lenguaje,repositorios.descripcion FROM repositorios INNER JOIN usuarios WHERE repositorios.usuarios_id_usuario = usuarios.id_usuarios AND repositorios.id_repositorio = ${connection.escape(
        req.params.id
      )}`;
      connection.query(q,(error,rows,fields)=>{
          if(error) throw error;
          if (!rows.length) {
            return res.status(404).json({ error: "resources not found" });
          }
          return res.status(200).json({ data: rows[0] });
      })
      connection.release();
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error . Please contact an administrator",
    });
  }
};
module.exports = {
  postRepository,
  putRepository,
  getRepositories,
  getRepository,
  deleteRepository
};
