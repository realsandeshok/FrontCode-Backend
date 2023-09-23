const mongoose = require("mongoose");
const { Schema } = mongoose;

const CodeSnippetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  code: {
    html: String,
    css: String,
    javascript: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("codesnippet", CodeSnippetSchema);
