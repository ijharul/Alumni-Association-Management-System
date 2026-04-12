import express from 'express';
import {
  sendMentorshipRequest,
  getStudentRequests,
  getMentorRequests,
  updateMentorshipStatus,
} from '../controllers/mentorshipController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only fully instantiated users should access any of these points
router.use(protect);

// Student mappings
router.post('/request', authorize('Student'), sendMentorshipRequest);
router.get('/my-requests', authorize('Student'), getStudentRequests);

// Alumni mappings
router.get('/mentor-requests', authorize('Alumni', 'Admin'), getMentorRequests);
router.put('/:id', authorize('Alumni', 'Admin'), updateMentorshipStatus);

export default router;
