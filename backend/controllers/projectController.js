const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id // From protect middleware
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const matchQuery = {};

    if (req.user.role !== 'Admin') {
      // We need to fetch assigned project IDs first to build the $or condition
      const assignedProjectIds = await Task.distinct('projectId', { assignedTo: req.user._id });
      
      matchQuery.$or = [
        { createdBy: req.user._id },
        { _id: { $in: assignedProjectIds } }
      ];
    }

    const projectsWithStats = await Project.aggregate([
      { $match: matchQuery },
      
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'projectId',
          as: 'tasks'
        }
      },
      
      {
        $project: {
          name: 1,
          description: 1,
          createdBy: 1,
          createdAt: 1,
          updatedAt: 1,
          totalTasks: { $size: '$tasks' },
          completedTasks: {
            $size: {
              $filter: {
                input: '$tasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'Completed'] }
              }
            }
          }
        }
      },
      
      {
        $addFields: {
          pendingTasks: { $subtract: ['$totalTasks', '$completedTasks'] }
        }
      },
      
      { $project: { tasks: 0 } }
    ]);

    res.json(projectsWithStats);
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Rule: User can see their own projects, Admin sees all.
    // If the project doesn't belong to the user AND they aren't an admin, deny access.
    if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};