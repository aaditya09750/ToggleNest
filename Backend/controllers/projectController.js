const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

const PROJECT_UPDATE_FIELDS = ['title', 'description', 'deadline', 'members', 'status'];

const pickFields = (source, allowed) =>
  allowed.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) acc[key] = source[key];
    return acc;
  }, {});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, members } = req.body;

    if (!title || !description || !deadline) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      createdBy: req.user._id,
      members: members || [],
    });

    await ActivityLog.create({
      action: 'Project Created',
      description: `Project "${title}" was created`,
      user: req.user._id,
      project: project._id,
    });

    if (members && members.length > 0) {
      const notifications = members
        .filter((memberId) => memberId !== req.user._id.toString())
        .map((memberId) => ({
          recipient: memberId,
          sender: req.user._id,
          type: 'Project Assigned',
          message: `You have been added to project "${title}"`,
          link: `/projects/${project._id}/tasks`,
          project: project._id,
        }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (project creator or Admin)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const isCreator = String(project.createdBy) === String(req.user._id);
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const updates = pickFields(req.body, PROJECT_UPDATE_FIELDS);

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    await ActivityLog.create({
      action: 'Project Updated',
      description: `Project "${updatedProject.title}" was updated`,
      user: req.user._id,
      project: updatedProject._id,
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (project creator or Admin)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isAdmin = req.user.role === 'Admin';
    const isCreator = String(project.createdBy) === String(req.user._id);
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await ActivityLog.create({
      action: 'Project Deleted',
      description: `Project "${project.title}" was deleted`,
      user: req.user._id,
    });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
