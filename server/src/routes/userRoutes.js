import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getAllUsers,
  approveAlumni,
  getUserById,
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// ── Static routes FIRST (before any :id param routes) ───────────────────────

// Directory (college-scoped by default, ?global=true for all)
router.get('/', protect, getUsers);

// Admin: list all users scoped by requester role
router.get('/all', protect, authorize('collegeAdmin', 'superAdmin'), getAllUsers);

// Own profile — MUST be before /:id
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('file'), updateUserProfile);

// ── Dynamic :id routes LAST ──────────────────────────────────────────────────

// Admin: get single user
router.get('/:id', protect, authorize('collegeAdmin', 'superAdmin'), getUserById);

// Approve / reject alumni
router.put('/:id/approve', protect, authorize('collegeAdmin', 'superAdmin'), approveAlumni);

export default router;
