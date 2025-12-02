const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed', 'overdue'],
    default: 'todo'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  attachment: {
    type: String,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save — synchronous, no next()
taskSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Task', taskSchema);
