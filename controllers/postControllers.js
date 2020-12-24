const Post = require("../models/Post");
const User = require("../models/User");

module.exports.user_posts = (req, res) => {
  res.render("user/posts");
};

module.exports.post_create_get = (req, res) => {
  res.render("post/create");
};

module.exports.post_create_post = async (req, res) => {
  const { title, description, body } = req.body;
  const { username } = res.locals.user;
  console.log(req.body);

  try {
    const user = await User.findOne({ username });
    const post = await Post.create({
      title,
      description,
      body,
      author: user._id,
    });
    console.log(post);
    res.json({ post });
  } catch (error) {
    console.log(error);
  }
};
