const router = require("express").Router();
const postControllers = require("../controllers/postControllers");

router.get("/create", postControllers.post_create_get);
router.post("/create", postControllers.post_create_post);

router.get("/:userId", postControllers.user_posts);

module.exports = router;
