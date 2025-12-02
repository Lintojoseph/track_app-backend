const Task = require('../models/Task');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');


// @desc    Get all tasks for user
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, dueDate } = req.body;
        
        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            dueDate,
            attachment: req.file ? req.file.path : null,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if task belongs to user
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Prepare update data
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate,
            updatedAt: Date.now()
        };

        // If new file uploaded, update attachment
        if (req.file) {
            updateData.attachment = req.file.path;
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};