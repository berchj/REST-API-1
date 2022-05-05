require("dotenv").config();
const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const pool = require("../db/config");
const verifyToken = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ message: "No token in request" });
  }
  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    //read user
    await pool.getConnection((error, connection) => {
      let q = `SELECT * FROM usuarios WHERE id_usuarios = ${id} AND status = 1`;
      connection.query(q, (error, rows, fields) => {
        if (error) throw error;
        const user = rows[0];
        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid Token - user invalid" });
        }
        if (!user.status) {
          return res
            .status(401)
            .json({ message: "Invalid Token", status: false });
        }
        //set user in request
        req.user = user;
        next();
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = {
  verifyToken,
};
