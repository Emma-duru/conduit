const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the post title"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please enter the post description"],
    },
    body: {
      type: String,
      required: [true, "Please enter the post body"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
