require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateJWT = (id = "") => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "2h" },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Problem generating token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
module.exports = {
  generateJWT,
};
