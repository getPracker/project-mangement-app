const express = require('express');
const router = express.Router();
const { register, login, getUsers, searchUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/search', protect, searchUsers);

// Admin only route
router.get('/users', protect, authorize('Admin'), getUsers);

module.exports = router;