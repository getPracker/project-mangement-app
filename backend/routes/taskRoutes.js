const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.patch('/:id', protect, updateTaskStatus);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;