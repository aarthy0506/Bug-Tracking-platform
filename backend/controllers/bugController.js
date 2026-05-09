const Bug = require('../models/Bug');
const path = require('path');

// ─── helpers ──────────────────────────────────────────────────────────────────

const basePopulate = [
  { path: 'project',    select: 'name' },
  { path: 'reportedBy', select: 'name email avatar' },
  { path: 'assignedTo', select: 'name email avatar' },
];

// ─── Create ───────────────────────────────────────────────────────────────────

// @desc    Create a bug  (multipart/form-data supported)
// @route   POST /api/bugs
// @access  Private/Tester,Admin
const createBug = async (req, res) => {
  try {
    const { title, description, priority, project, stepsToReproduce, assignedTo } = req.body;

    // Collect uploaded file paths (if any)
    const attachments = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const bug = await Bug.create({
      title,
      description,
      priority,
      project,
      stepsToReproduce,
      assignedTo: assignedTo || null,
      attachments,
      reportedBy: req.user._id,
    });

    const populated = await Bug.findById(bug._id).populate(basePopulate);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── List (all, with query filters) ──────────────────────────────────────────

// @desc    Get all bugs — admin sees all; role filters applied per spec
// @route   GET /api/bugs
// @access  Private
const getBugs = async (req, res) => {
  try {
    const { status, priority, project, search } = req.query;

    // Admins see everything; role-based filter applied below
    let filter = {};
    if (req.user.role === 'tester')    filter.reportedBy = req.user._id;
    if (req.user.role === 'developer') filter.assignedTo  = req.user._id;

    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (project)  filter.project  = project;
    if (search)   filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    const bugs = await Bug.find(filter)
      .populate(basePopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bugs.length, data: bugs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Tester's own reported bugs
// @route   GET /api/bugs/my-reports
// @access  Private/Tester
const getMyReports = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { reportedBy: req.user._id };
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;

    const bugs = await Bug.find(filter)
      .populate(basePopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bugs.length, data: bugs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Developer's assigned bugs
// @route   GET /api/bugs/assigned
// @access  Private/Developer
const getAssignedBugs = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = { assignedTo: req.user._id };
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;

    const bugs = await Bug.find(filter)
      .populate(basePopulate)
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bugs.length, data: bugs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Single ───────────────────────────────────────────────────────────────────

// @desc    Get single bug with full detail
// @route   GET /api/bugs/:id
// @access  Private
const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('project',       'name description')
      .populate('reportedBy',    'name email avatar')
      .populate('assignedTo',    'name email avatar')
      .populate('comments.user', 'name email avatar');

    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    res.json({ success: true, data: bug });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Update ───────────────────────────────────────────────────────────────────

// @desc    Full update of a bug (title, description, priority, assignedTo, etc.)
// @route   PUT /api/bugs/:id
// @access  Private (Admin: anything; Developer: their assigned bugs; Tester: own bugs title/desc/priority)
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const { role, _id: userId } = req.user;

    // Testers can only edit bugs they reported
    if (role === 'tester' && bug.reportedBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this bug' });
    }

    // Developers can only edit bugs assigned to them
    if (role === 'developer' && (!bug.assignedTo || bug.assignedTo.toString() !== userId.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this bug' });
    }

    const updated = await Bug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(basePopulate);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Developer updates status only
// @route   PUT /api/bugs/:id/status
// @access  Private/Developer,Admin
const updateBugStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['open', 'in_progress', 'resolved', 'closed', 'reopened'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`,
      });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    // Developers can only update bugs assigned to them
    if (
      req.user.role === 'developer' &&
      (!bug.assignedTo || bug.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = await Bug.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(basePopulate);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────

// @desc    Delete a bug
// @route   DELETE /api/bugs/:id
// @access  Private/Admin or Reporter (Tester)
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const isAdmin    = req.user.role === 'admin';
    const isReporter = bug.reportedBy.toString() === req.user._id.toString();

    if (!isAdmin && !isReporter) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this bug' });
    }

    await bug.deleteOne();
    res.json({ success: true, message: 'Bug deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Comments ─────────────────────────────────────────────────────────────────

// @desc    Add comment to bug
// @route   POST /api/bugs/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Comment message is required' });
    }

    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    bug.comments.push({ user: req.user._id, message });
    await bug.save();

    const updated = await Bug.findById(req.params.id).populate('comments.user', 'name email avatar');
    res.status(201).json({ success: true, data: updated.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/bugs/:id/comments/:commentId
// @access  Private (owner or admin)
const deleteComment = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ success: false, message: 'Bug not found' });

    const comment = bug.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.deleteOne();
    await bug.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Stats (dashboard) ────────────────────────────────────────────────────────

// @desc    Bug stats grouped by status and priority
// @route   GET /api/bugs/stats
// @access  Private
const getBugStats = async (req, res) => {
  try {
    let match = {};
    if (req.user.role === 'tester')    match.reportedBy = req.user._id;
    if (req.user.role === 'developer') match.assignedTo  = req.user._id;

    const byStatus = await Bug.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byPriority = await Bug.aggregate([
      { $match: match },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { byStatus, byPriority } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createBug,
  getBugs,
  getMyReports,
  getAssignedBugs,
  getBugById,
  updateBug,
  updateBugStatus,
  deleteBug,
  addComment,
  deleteComment,
  getBugStats,
};
