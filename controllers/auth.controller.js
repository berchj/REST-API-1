const { response, request } = require("express");
const pool = require("../db/config");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const { generateJWT } = require("../helpers/generate-jwt");
const login = async (req = request, res = response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    await pool.getConnection((error, connection) => {
      if (error) throw error;
      const { email, password } = req.body;
      let queryEmail = `SELECT * FROM usuarios WHERE email = ${connection.escape(
        email
      )} AND status = 1`;
      connection.query(queryEmail, async (err, rows, fields) => {
        if (err) throw err;
        if (rows.length) {
          //if email exists
          const validPassword = bcryptjs.compareSync(
            password,
            rows[0].password
          );
          if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
          }
          const user = rows[0];
          console.log(user)
          //generate jwt
          const token = await generateJWT(rows[0].id_usuario);          
          //get date
          const date = new Date() 
          //generate login record for table         
          let queryRecord = `INSERT INTO historial_de_login (fecha_hora,usuarios_id_usuario) VALUES (
            ${connection.escape(date)},
            ${connection.escape(user.id_usuario)}
          )`
          connection.query(queryRecord,(error,result)=>{
            if(error) throw error
            if(!result) console.log("error creating login record")            
          })
          return res.status(200).json({ user, token });
        } else {
          //if email doesn't exist on database || status user : false
          return res.status(404).json({
            message: "Invalid credentials",
            status: false,
          });
        }
      });
      connection.release();
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        error: "Internal server error. Please contact an administrator",
      });
  }
};
module.exports = {
  login,
};
