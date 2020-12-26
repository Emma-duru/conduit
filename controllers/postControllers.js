const Post = require("../models/Post");
const User = require("../models/User");

const handlePostError = (err) => {
  const errors = {};

  if (err["_message"] === "Post validation failed") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.user_posts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    const posts = await Post.find({ author: user._id });
    res.render("user/posts", { posts: posts, userInfo: user });
  } catch (err) {
    console.log(err);
  }
};

module.exports.post_create_get = (req, res) => {
  res.render("post/create");
};

module.exports.post_create_post = async (req, res) => {
  const { title, description, body } = req.body;
  const { username } = res.locals.user;

  try {
    const user = await User.findOne({ username });
    const post = await Post.create({
      title,
      description,
      body,
      author: user._id,
    });
    res.json({ post });
  } catch (error) {
    const errors = handlePostError(error);
    res.json({ errors });
  }
};

module.exports.post_detail = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId })
      .populate("author")
      .populate("comments.author");
    res.render("post/detail", { post: post, postComments: post.comments });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_edit_get = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findOne({ _id: postId });
    res.render("post/edit", { post: post });
  } catch (error) {
    console.log(error);
  }
};

module.exports.post_edit_post = async (req, res) => {
  const { postId } = req.params;
  const { title, description, body } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      title,
      description,
      body,
    });
    res.json({ post });
  } catch (error) {
    const errors = handlePostError(error);
    res.json({ errors });
  }
};

module.exports.post_delete = (req, res) => {
  const { postId } = req.params;
  Post.findByIdAndDelete(postId)
    .then(() => {
      res.redirect(`/${res.locals.user.username}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.post_comment_create = async (req, res) => {
  const { body } = req.body;
  const { username } = res.locals.user;
  const { postId } = req.params;

  try {
    const user = await User.findOne({ username });
    const data = {
      body: body,
      author: user._id,
    };
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: data },
    });
    res.json({ post });
  } catch (error) {
    const errors = handlePostError(error);
    res.json({ errors });
  }
};

module.exports.post_comment_delete = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
    );
    res.redirect("back");
  } catch (err) {
    res.json({ err });
  }
};

module.exports.post_like = async (req, res) => {
  const { postId } = req.params;
  const { username } = res.locals.user;
  try {
    let post = await Post.findOne({ _id: postId });
    let user = await User.findOne({ username });
    if (post.likes.indexOf(user._id) !== -1) {
      user = await User.findOneAndUpdate(
        { username },
        { $pull: { likes: post._id } }
      );
      post = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: user._id } }
      );
    } else {
      user = await User.findOneAndUpdate(
        { username },
        { $push: { likes: post._id } }
      );
      post = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: user._id } }
      );
    }
    res.redirect(`back`);
  } catch (err) {
    console.log(err);
  }
};
