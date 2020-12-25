const router = require("express").Router();
const postControllers = require("../controllers/postControllers");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/create", requireAuth, postControllers.post_create_get);
router.post("/create", requireAuth, postControllers.post_create_post);

router.get("/:username", postControllers.user_posts);
router.get("/post/:postId", postControllers.post_detail);

router.get("/post/:postId/edit", requireAuth, postControllers.post_edit_get);
router.put("/post/:postId", requireAuth, postControllers.post_edit_post);

router.delete("/post/:postId", requireAuth, postControllers.post_delete);

router.post(
  "/post/:postId/comment",
  requireAuth,
  postControllers.post_comment_create
);
router.delete(
  "/post/:postId/comment/:commentId",
  requireAuth,
  postControllers.post_comment_delete
);

router.post("/post/:postId/like", requireAuth, postControllers.post_like);
module.exports = router;
