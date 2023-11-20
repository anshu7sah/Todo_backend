const express = require("express");
const router = express.Router();
const TodoItem = require("../models/Todo");

router.get("/todos", async (req, res) => {
  try {
    const todos = await TodoItem.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/todos", async (req, res) => {
  try {
    const { title, link, position } = req.body;
    const newTodo = new TodoItem({ title, link, position });
    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id/update-position", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPosition } = req.body;

    const todoToUpdate = await TodoItem.findById(id);

    if (!todoToUpdate) {
      return res.status(404).json({ error: "Todo item not found" });
    }

    const oldPosition = todoToUpdate.position;

    todoToUpdate.position = newPosition;

    if (oldPosition < newPosition) {
      const tasksToMoveDown = await TodoItem.find({
        position: { $gte: oldPosition, $lt: newPosition },
      });
      for (const task of tasksToMoveDown) {
        task.position -= 1;
        await task.save();
      }
    } else if (oldPosition > newPosition) {
      const tasksToMoveUp = await TodoItem.find({
        position: { $gte: newPosition, $lt: oldPosition },
      });

      for (const task of tasksToMoveUp) {
        task.position += 1;
        await task.save();
      }
    }

    await todoToUpdate.save();
    const updatedTodos = await TodoItem.find({});

    res.status(200).json(updatedTodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/todos/:id/update-status", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const todoToUpdate = await TodoItem.findById(id);

    if (!todoToUpdate) {
      return res.status(404).json({ error: "Todo item not found" });
    }

    todoToUpdate.completed = completed;

    await todoToUpdate.save();

    res.status(200).json(todoToUpdate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
