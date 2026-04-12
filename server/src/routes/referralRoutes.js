import express from 'express';
import {
  sendReferralRequest,
  getStudentRequests,
  getAlumniRequests,
  updateReferralStatus,
} from '../controllers/referralController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Extrapolated global JWT runtime protection
router.use(protect);

// Student Endpoint Mappings
router.post('/request', authorize('Student'), sendReferralRequest);
router.get('/my-requests', authorize('Student'), getStudentRequests);

// Alumni Endpoint Mappings
router.get('/incoming', authorize('Alumni', 'Admin'), getAlumniRequests);
router.put('/:id', authorize('Alumni', 'Admin'), updateReferralStatus);

export default router;
