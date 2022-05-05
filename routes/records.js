const { Router } = require("express");
const { check } = require("express-validator");
const { verifyToken } = require("../middlewares/middlewares");
const {
  getRecords,
  getRecord,
  deleteRecord,
  putRecord,
  postRecord,
} = require("../controllers/records.controller");
const router = Router();
router.get("/", verifyToken, getRecords);
router.get("/:id", verifyToken, getRecord);
router.delete("/:id", verifyToken, deleteRecord);
router.put(
  "/:id",
  [
    check("tipo", "tipo is required")
      .not()
      .isEmpty()
      .isIn(["admin", "usuario"]),
    verifyToken,
  ],
  putRecord
);
router.post(
  "/",
  [
    check("tipo", "tipo is required")
      .not()
      .isEmpty()
      .isIn(["admin", "usuario"]),
    check("usuarios_id_usuario", "referencial id required").not().isEmpty(),
    verifyToken,
  ],
  postRecord
);
module.exports = router;
