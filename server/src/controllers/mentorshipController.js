import Mentorship from '../models/Mentorship.js';
import User from '../models/User.js';

/**
 * @desc    Send a new mentorship request
 * @route   POST /api/mentorship/request
 * @access  Private (Student only)
 */
export const sendMentorshipRequest = async (req, res, next) => {
  try {
    const { mentorId, message } = req.body;
    const studentId = req.user._id;

    // Validate mentor exists and acts as an Alumni
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'Alumni') {
      res.status(400);
      throw new Error('Target valid mentor (Alumni) was not found.');
    }

    // Check if there is already an active or pending request mapping between them
    const existingRequest = await Mentorship.findOne({
      student: studentId,
      mentor: mentorId,
    });

    if (existingRequest) {
      res.status(400);
      throw new Error(`A mentorship request to this alumni already exists with status: ${existingRequest.status}`);
    }

    // Save the new connection Request
    const request = await Mentorship.create({
      student: studentId,
      mentor: mentorId,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in Student's outgoing requests
 * @route   GET /api/mentorship/my-requests
 * @access  Private (Student only)
 */
export const getStudentRequests = async (req, res, next) => {
  try {
    // Populate the mentor details to display gracefully to the student
    const requests = await Mentorship.find({ student: req.user._id })
      .populate('mentor', 'name profilePicture company skills');
      
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in Mentor's incoming requests
 * @route   GET /api/mentorship/mentor-requests
 * @access  Private (Alumni only)
 */
export const getMentorRequests = async (req, res, next) => {
  try {
    // Populate the student details so the Alumni knows who requested them
    const requests = await Mentorship.find({ mentor: req.user._id })
      .populate('student', 'name profilePicture bio batch skills');
      
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Mentorship Status (Accept / Reject)
 * @route   PUT /api/mentorship/:id
 * @access  Private (Alumni only)
 */
export const updateMentorshipStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await Mentorship.findById(req.params.id);

    // Validate the mentorship doc exists
    if (!request) {
      res.status(404);
      throw new Error('Mentorship request not found');
    }

    // Security verify that the person changing the status is ACTUALLY the aimed mentor
    if (request.mentor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access or modify this specific request');
    }

    // Expecting either 'accepted' or 'rejected'
    if (['accepted', 'rejected'].includes(status)) {
      request.status = status;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(400);
      throw new Error('Invalid status update. Only `accepted` or `rejected` permitted.');
    }
  } catch (error) {
    next(error);
  }
};
