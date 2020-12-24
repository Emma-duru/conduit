const mongoose = requirea("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      lowercase: true,
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("User", userSchema);
