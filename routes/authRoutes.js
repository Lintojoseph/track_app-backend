const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

// Validation rules
const validateRegister = [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
];

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

module.exports = router;