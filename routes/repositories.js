const { Router } = require("express");
const { check } = require("express-validator");
const {
  postRepository,
  putRepository,
  getRepositories,
  getRepository
} = require("../controllers/repositories.controller");
const { verifyToken } = require("../middlewares/middlewares");
const router = Router();
router.get("/", verifyToken, getRepositories);
router.get("/:id", verifyToken, getRepository);
router.post(
  "/",
  [
    check("nombre_proyecto", "nombre_proyecto is required").not().isEmpty(),
    check(
      "lenguaje",
      "lenguaje is required between these values: javascript,PHP,python"
    )
      .not()
      .isEmpty()
      .isIn(["javascript", "PHP", "python"]),
    verifyToken,
  ],
  postRepository
);
router.put(
  "/:id",
  [
    check("nombre_proyecto", "nombre_proyecto is required").not().isEmpty(),
    check(
      "lenguaje",
      "lenguaje is required between these values: javascript,PHP,python"
    )
      .not()
      .isEmpty()
      .isIn(["javascript", "PHP", "python"]),
    check("descripcion", "descripcion is required").not().isEmpty(),
    verifyToken,
  ],
  putRepository
);
module.exports = router;
