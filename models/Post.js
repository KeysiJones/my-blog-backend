const mongoose = require("mongoose");

const AulaSchema = mongoose.Schema({
  id: Number,
  title: String,
  body: String,
  subtitle: String,
  created: String,
});

module.exports = mongoose.model("Post", AulaSchema);
