const express = require('express');
const router  = express.Router();
const {
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
} = require('../controllers/bugController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.use(protect);

// ── Specific named routes BEFORE /:id ─────────────────────────────────────────
router.get('/stats',       getBugStats);
router.get('/my-reports',  authorize('tester', 'admin'), getMyReports);
router.get('/assigned',    authorize('developer', 'admin'), getAssignedBugs);

// ── Collection ────────────────────────────────────────────────────────────────
router.get('/',   getBugs);
router.post('/',  authorize('tester', 'admin'), upload.array('attachments', 5), createBug);

// ── Single bug ────────────────────────────────────────────────────────────────
router.get('/:id',         getBugById);
router.put('/:id',         updateBug);
router.delete('/:id',      deleteBug);
router.put('/:id/status',  authorize('developer', 'admin'), updateBugStatus);

// ── Comments ─────────────────────────────────────────────────────────────────
router.post('/:id/comments',               addComment);
router.delete('/:id/comments/:commentId',  deleteComment);

module.exports = router;
