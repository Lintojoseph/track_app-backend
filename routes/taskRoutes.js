const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../utils/fileUpload');
const { 
    getTasks, 
    createTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController');
const { body } = require('express-validator');

// Validation rules
const validateTask = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('dueDate').not().isEmpty().withMessage('Due date is required'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed', 'overdue'])
];

// All routes are protected
router.use(protect);

router.route('/')
    .get(getTasks)
    .post(upload.single('attachment'), validateTask, createTask);

router.route('/:id')
    .put(upload.single('attachment'), validateTask, updateTask)
    .delete(deleteTask);

module.exports = router;