import Referral from '../models/Referral.js';
import User from '../models/User.js';

/**
 * @desc    Send a new referral request
 * @route   POST /api/referrals/request
 * @access  Private (Student only)
 */
export const sendReferralRequest = async (req, res, next) => {
  try {
    const { alumniId, company, role, jobType, resume, message } = req.body;
    const studentId = req.user._id;

    // Validate the target alumni actually exists & has valid role mappings
    const alumni = await User.findById(alumniId);
    if (!alumni || alumni.role !== 'Alumni') {
      res.status(400);
      throw new Error('Target valid Alumni was not found.');
    }

    // Prevent identical contextual duplication
    // (a student asking the SAME alumni for a referral to the SAME company and SAME role)
    const duplicateRequest = await Referral.findOne({
      student: studentId,
      alumni: alumniId,
      company: { $regex: new RegExp(`^${company}$`, 'i') },
      role: { $regex: new RegExp(`^${role}$`, 'i') },
    });

    if (duplicateRequest) {
      res.status(400);
      throw new Error(`A referral request for this exact position already exists with status: ${duplicateRequest.status}`);
    }

    // Provision the new Referral execution state
    const referral = await Referral.create({
      student: studentId,
      alumni: alumniId,
      company,
      role,
      jobType: jobType || 'full-time',
      resume,
      message,
    });

    res.status(201).json(referral);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in Student's active referral requests
 * @route   GET /api/referrals/my-requests
 * @access  Private (Student only)
 */
export const getStudentRequests = async (req, res, next) => {
  try {
    const requests = await Referral.find({ student: req.user._id })
      .populate('alumni', 'name profilePicture company role'); // Provide alumni context
      
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in Alumni's incoming referral requests
 * @route   GET /api/referrals/incoming
 * @access  Private (Alumni only)
 */
export const getAlumniRequests = async (req, res, next) => {
  try {
    const requests = await Referral.find({ alumni: req.user._id })
      .populate('student', 'name profilePicture bio batch skills resume'); // Provide deep context for student
      
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Referral Status (Accept / Reject)
 * @route   PUT /api/referrals/:id
 * @access  Private (Alumni only)
 */
export const updateReferralStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const referral = await Referral.findById(req.params.id);

    // Validate referral existence
    if (!referral) {
      res.status(404);
      throw new Error('Referral request not found');
    }

    // Validate identity binding ensures security against hijacking status arrays
    if (referral.alumni.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access or modify this specific referral request');
    }

    if (['accepted', 'rejected'].includes(status)) {
      referral.status = status;
      const updatedReferral = await referral.save();
      res.json(updatedReferral);
    } else {
      res.status(400);
      throw new Error('Invalid status update. Only `accepted` or `rejected` are permitted strings.');
    }
  } catch (error) {
    next(error);
  }
};
