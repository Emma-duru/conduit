const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

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

postSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", postSchema);
