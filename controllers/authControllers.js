require("dotenv").config();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const handleSignupErrors = (err) => {
  const errors = {};

  // Check uniqueness
  if (err.code === 11000) {
    const prop = Object.keys(err.keyPattern);
    if (prop.includes("username")) {
      errors.username = "Username is already taken";
    }

    if (prop.includes("email")) {
      errors.email = "Email is already taken";
    }
  }

  // Check validity
  if (err["_message"] === "User validation failed") {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const handleLoginErrors = (err) => {
  const errors = {};
  if (err.message === "Incorrect username") {
    errors.username = "This username is incorrect";
  }

  if (err.message === "Incorrect password") {
    errors.password = "This password is incorrect";
  }

  return errors;
};

module.exports.home_get = async (req, res) => {
  try {
    const posts = await Post.find().populate("author").sort("-createdAt");
    res.render("home", { posts: posts });
  } catch (err) {
    console.log(err);
  }
};

module.exports.signup_get = (req, res) => {
  res.render("user/signup");
};

module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("med_auth", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({ user });
  } catch (error) {
    const errors = handleSignupErrors(error);
    res.json({ errors });
  }
};

module.exports.login_get = (req, res) => {
  res.render("user/login");
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("med_auth", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.json({ user });
  } catch (err) {
    const errors = handleLoginErrors(err);
    res.json({ errors });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("med_auth", "", {
    maxAge: 1,
  });
  res.redirect("/");
};

module.exports.edit_get = (req, res) => {
  res.render("user/edit");
};

module.exports.edit_put = async (req, res) => {
  const { username, email, bio } = req.body;
  const { _id } = res.locals.user;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        username,
        email,
        bio: bio,
      },
      { new: true }
    );
    console.log(user);
    res.json({ user });
  } catch (err) {
    console.log(err);
  }
};
