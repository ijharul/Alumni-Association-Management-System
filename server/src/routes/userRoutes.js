import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUsers 
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// The Directory endpoint: requires JWT explicitly
router.get('/', protect, getUsers);

// The Profile endpoints: Map custom middleware to PUT for extracting memory buffers
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('resume'), updateUserProfile);

export default router;
