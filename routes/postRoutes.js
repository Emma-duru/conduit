const router = require("express").Router();
const postControllers = require("../controllers/postControllers");

router.get("/create", postControllers.post_create_get);
router.post("/create", postControllers.post_create_post);

router.get("/:username", postControllers.user_posts);
router.get("/post/:postId", postControllers.post_detail);

router.get("/post/:postId/edit", postControllers.post_edit_get);
router.put("/post/:postId", postControllers.post_edit_post);

router.delete("/post/:postId", postControllers.post_delete);

module.exports = router;
