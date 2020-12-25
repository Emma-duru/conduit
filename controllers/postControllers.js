const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

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
    const user = await User.findOne({ username }).populate("posts");
    res.render("user/posts", { posts: user.posts });
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
    const post = await Post.findOne({ _id: postId }).populate("author");
    const comments = await Comment.find({ post: post._id }).populate("author");
    res.render("post/detail", { post: post, postComments: comments });
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
    console.log(user);
    const post = await Post.findById(postId);
    const comment = await Comment.create({
      author: user._id,
      post: post._id,
      body: body,
    });
    res.json({ comment });
  } catch (error) {
    const errors = handlePostError(error);
    res.json({ errors });
  }
};

module.exports.post_comment_delete = (req, res) => {
  const { postId, commentId } = req.params;

  try {
    Comment.findByIdAndDelete(commentId)
      .then(() => {
        res.redirect(`/post/${postId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.json({ errors });
  }
};
