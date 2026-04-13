import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT — embed id, role, and collegeId for middleware use
const generateToken = (id, role, collegeId) => {
  return jwt.sign(
    { id, role, collegeId: collegeId ?? null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Helper: build consistent user payload for responses
const buildUserPayload = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  collegeId: user.collegeId ?? null,
  plan: user.plan,
  tokens: user.tokens,
  profilePicture: user.profilePicture,
  token,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, collegeId, pendingCollege } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists.');
    }

    const allowedSelfRoles = ['student', 'alumni'];
    const finalRole = allowedSelfRoles.includes(role) ? role : 'student';

    const user = await User.create({
      name, email, password,
      role: finalRole,
      collegeId: collegeId || null,
      pendingCollege: collegeId ? '' : (pendingCollege || ''),
    });

    if (user) {
      const token = generateToken(user._id, user.role, user.collegeId);
      res.status(201).json(buildUserPayload(user, token));
    } else {
      res.status(400);
      throw new Error('Invalid user data received.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id, user.role, user.collegeId);
      res.json(buildUserPayload(user, token));
    } else {
      res.status(401);
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    next(error);
  }
};
