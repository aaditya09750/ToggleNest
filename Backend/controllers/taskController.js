const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const TASK_UPDATE_FIELDS = [
  'title',
  'description',
  'status',
  'priority',
  'dueDate',
  'assignedTo',
];

const pickFields = (source, allowed) =>
  allowed.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) acc[key] = source[key];
    return acc;
  }, {});

const isProjectMember = (project, userId) => {
  const uid = String(userId);
  if (String(project.createdBy) === uid) return true;
  return (project.members || []).some((m) => String(m) === uid);
};

// @desc    Get all tasks (optionally filter by project)
// @route   GET /api/tasks?project=projectId
// @access  Private
const getTasks = async (req, res) => {
  try {
    const filter = req.query.project ? { project: req.query.project } : {};

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, project, status } = req.body;

    if (!title || !description || !dueDate || !project) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'To Do',
      dueDate,
      assignedTo: assignedTo || null,
      project,
      createdBy: req.user._id,
    });

    await ActivityLog.create({
      action: 'Task Created',
      description: `Task "${title}" was created`,
      user: req.user._id,
      project,
      task: task._id,
    });

    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: 'Task Assigned',
        message: `You have been assigned to task "${title}"`,
        link: `/projects/${project}/tasks`,
        project,
        task: task._id,
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task (including status change on drag)
// @route   PUT /api/tasks/:id
// @access  Private (project member, task creator/assignee, or Admin)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: 'Parent project not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const allowed =
      isAdmin ||
      isProjectMember(project, req.user._id) ||
      String(task.createdBy) === String(req.user._id) ||
      (task.assignedTo && String(task.assignedTo) === String(req.user._id));

    if (!allowed) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo;
    const updates = pickFields(req.body, TASK_UPDATE_FIELDS);

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'name email')
      .populate('project', 'title')
      .populate('createdBy', 'name email');

    if (updates.status && oldStatus !== updates.status) {
      const action = updates.status === 'Done' ? 'Task Completed' : 'Task Moved';
      await ActivityLog.create({
        action,
        description: `Task "${updatedTask.title}" moved from "${oldStatus}" to "${updates.status}"`,
        user: req.user._id,
        project: updatedTask.project._id,
        task: updatedTask._id,
      });
    }

    if (updates.assignedTo && String(oldAssignedTo) !== String(updates.assignedTo)) {
      await ActivityLog.create({
        action: 'User Assigned',
        description: `Task "${updatedTask.title}" was assigned to a user`,
        user: req.user._id,
        project: updatedTask.project._id,
        task: updatedTask._id,
      });

      if (updates.assignedTo !== req.user._id.toString()) {
        await Notification.create({
          recipient: updates.assignedTo,
          sender: req.user._id,
          type: 'Task Assigned',
          message: `You have been assigned to task "${updatedTask.title}"`,
          link: `/projects/${updatedTask.project._id}/tasks`,
          project: updatedTask.project._id,
          task: updatedTask._id,
        });
      }
    }

    if (!updates.status && !updates.assignedTo) {
      await ActivityLog.create({
        action: 'Task Updated',
        description: `Task "${updatedTask.title}" was updated`,
        user: req.user._id,
        project: updatedTask.project._id,
        task: updatedTask._id,
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (task creator, project creator, or Admin)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isAdmin = req.user.role === 'Admin';
    const isTaskCreator = String(task.createdBy) === String(req.user._id);
    const isProjectCreator =
      project && String(project.createdBy) === String(req.user._id);

    if (!isAdmin && !isTaskCreator && !isProjectCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await ActivityLog.create({
      action: 'Task Deleted',
      description: `Task "${task.title}" was deleted`,
      user: req.user._id,
      project: task.project,
    });

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
