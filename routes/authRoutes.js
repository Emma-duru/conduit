const router = require("express").Router();
const authControllers = require("../controllers/authControllers");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", authControllers.home_get);
router.get("/signup", authControllers.signup_get);
router.post("/signup", authControllers.signup_post);

router.get("/login", authControllers.login_get);
router.post("/login", authControllers.login_post);
router.get("/logout", authControllers.logout);

router.get("/edit", requireAuth, authControllers.edit_get);
router.put("/edit", requireAuth, authControllers.edit_put);

module.exports = router;
