const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.get("/", authControllers.home_get);
router.get("/signup", authControllers.signup_get);
router.post("/signup", authControllers.signup_post);

router.get("/logout", authControllers.logout);

module.exports = router;
