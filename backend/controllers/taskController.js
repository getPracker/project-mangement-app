const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);

    // Authorization Check: Must be Admin OR owner of the project
    if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add tasks to this project' });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);

    const isAuthorized = req.user.role === 'Admin' || 
                         (project && project.createdBy.toString() === req.user._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to edit this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Using $set ensures fields like assignedTo: null are honored
      { returnDocument: 'after', runValidators: true }
    ).populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (err) { next(err); }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);

    const isAdmin = req.user.role === 'Admin';
    const isOwner = project && project.createdBy.toString() === req.user._id.toString();
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = req.body.status;
    await task.save();

    // RE-FETCH WITH POPULATE
    // This ensures the frontend receives the full user object (name/email)
    const updatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    
    res.json(updatedTask);
  } catch (err) { next(err); }
};

// @desc    Get tasks for a specific project
// @route   GET /api/tasks?projectId=...
exports.getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // AUTH CHECK
    const isAdmin = req.user.role === 'Admin';
    const isOwner = project.createdBy.toString() === req.user._id.toString();

    // Check if user is associated with ANY task in this project
    const hasParticipation = await Task.exists({
      projectId: projectId,
      assignedTo: req.user._id
    });

    // If none of these are true, deny access
    if (!isAdmin && !isOwner && !hasParticipation) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    // FETCH ALL TASKS
    // Because they passed the check, they can see the whole project's task list
    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);
    
    // Check Authorization: Admin or Project Owner
    const isOwner = project.owner.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};