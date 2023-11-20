// models/TodoItem.js
const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Number,
    required: true,
  },
});

const TodoItem = mongoose.model("TodoItem", todoItemSchema);

module.exports = TodoItem;
