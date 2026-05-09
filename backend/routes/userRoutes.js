const express = require('express');
const router  = express.Router();
const {
  getAllUsers,
  getDevelopers,
  getUserById,
  updateUser,
  changeUserRole,
  updateProfile,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Own profile — must be before /:id to avoid collision
router.put('/profile', updateProfile);

// Developer list — accessible to all roles (needed for assignment dropdowns)
router.get('/developers', getDevelopers);

// Admin-only user management
router.get('/',              authorize('admin'), getAllUsers);
router.get('/:id',           authorize('admin'), getUserById);
router.put('/:id',           authorize('admin'), updateUser);
router.put('/:id/role',      authorize('admin'), changeUserRole);
router.delete('/:id',        authorize('admin'), deleteUser);

module.exports = router;
