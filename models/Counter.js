const mongoose = require("mongoose");

const CounterSchema = mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

module.exports = mongoose.model("Counter", CounterSchema);
