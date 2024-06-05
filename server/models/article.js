const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
    },
    dislikes: {
      type: Array,
    },
  },
  { timestamps: true },
);

module.exports = new mongoose.model("Article", ArticleSchema);

