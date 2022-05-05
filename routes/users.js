const { Router } = require("express");
const { check } = require("express-validator");
const { verifyToken } = require("../middlewares/middlewares");
const {
  getUser,
  getUsers,
  postUser,
  putUser,
  deleteUser,
} = require("../controllers/users.controller");
const router = Router();
router.get('/:id',verifyToken,getUser)
router.get("/",verifyToken, getUsers);
router.post(
  "/",
  [
    check("nombre", "name is required").not().isEmpty(),
    check("email", "email is required").normalizeEmail().isEmail(),
    check("fecha_nacimiento", "value must be an ISO8601 format")
      .isISO8601()
      .toDate(),
    check("password", "password must have 6 letters at least").isLength({
      min: 6,
    }),

  ],
  postUser
);
router.put(
  "/:id",
  [
    check("nombre", "name is required").not().isEmpty(),
    check("email", "email is required").normalizeEmail().isEmail(),
    check("fecha_nacimiento", "value must be an ISO8601 format")
      .isISO8601()
      .toDate(),
    check("password", "password must have 6 letters at least").isLength({
      min: 6,
    }),  
    verifyToken  
  ],
  putUser
);
router.delete("/:id", deleteUser);
module.exports = router;
