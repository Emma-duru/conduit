const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");

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
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log(err);
  }
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect password");
  }
  throw new Error("Incorrect username");
};

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
