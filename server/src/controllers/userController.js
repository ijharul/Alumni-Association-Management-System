import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const streamUploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result); else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

const userPayload = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  collegeId: u.collegeId ?? null,
  plan: u.plan,
  tokens: u.tokens,
  bio: u.bio,
  skills: u.skills,
  company: u.company,
  college: u.college,
  currentRole: u.currentRole,
  experience: u.experience,
  projects: u.projects,
  batch: u.batch,
  branch: u.branch,
  year: u.year,
  careerGoal: u.careerGoal,
  profilePicture: u.profilePicture,
  resume: u.resume,
});

/** GET /api/users/profile */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('collegeId', 'name location');
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json(userPayload(user));
  } catch (error) { next(error); }
};

/** PUT /api/users/profile */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }

    const scalar = ['name', 'bio', 'company', 'college', 'currentRole', 'batch', 'branch', 'year', 'careerGoal'];
    scalar.forEach((f) => { if (req.body[f] !== undefined) user[f] = req.body[f]; });

    if (req.body.skills) {
      user.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    ['experience', 'projects'].forEach((f) => {
      if (req.body[f]) {
        try { user[f] = typeof req.body[f] === 'string' ? JSON.parse(req.body[f]) : req.body[f]; }
        catch (e) { console.error(`${f} parse error`, e); }
      }
    });

    if (req.file) {
      const isImage = req.file.mimetype.startsWith('image/');
      if (isImage) {
        const result = await streamUploadToCloudinary(req.file.buffer, {
          resource_type: 'image',
          folder: 'campus-nexus/avatars',
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }, { quality: 'auto', fetch_format: 'auto' }],
        });
        user.profilePicture = result.secure_url;
      } else {
        const result = await streamUploadToCloudinary(req.file.buffer, { resource_type: 'auto', folder: 'campus-nexus/resumes' });
        user.resume = result.secure_url;
      }
    }

    const updated = await user.save();
    res.json(userPayload(updated));
  } catch (error) { next(error); }
};

/** GET /api/users — college-scoped directory */
export const getUsers = async (req, res, next) => {
  try {
    const { skills, company, role, global: isGlobal, collegeId } = req.query;
    const query = {};

    if (isGlobal !== 'true') {
      const scopeId = collegeId || req.user.collegeId;
      if (scopeId) query.collegeId = scopeId;
    }
    if (role) query.role = role;
    if (company) query.company = { $regex: company, $options: 'i' };
    if (skills) {
      const arr = skills.split(',').map((s) => new RegExp(s.trim(), 'i'));
      query.skills = { $in: arr };
    }

    const users = await User.find(query).select('-password').populate('collegeId', 'name location').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { next(error); }
};

/** GET /api/users/all — admin panel */
export const getAllUsers = async (req, res, next) => {
  try {
    const { role: userRole, collegeId: userCollegeId } = req.user;
    const query = {};
    if (userRole === 'collegeAdmin') query.collegeId = userCollegeId;

    const users = await User.find(query).select('-password').populate('collegeId', 'name').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { next(error); }
};

/**
 * @desc    Approve or reject an alumni (collegeAdmin/superAdmin)
 * @route   PUT /api/users/:id/approve
 * @body    { approved: true | false }
 */
export const approveAlumni = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found.'); }
    if (user.role !== 'alumni') { res.status(400); throw new Error('User is not an alumni.'); }

    // collegeAdmin can only approve alumni from their own college
    if (req.user.role === 'collegeAdmin' && user.collegeId?.toString() !== req.user.collegeId?.toString()) {
      res.status(403); throw new Error('You can only manage alumni from your college.');
    }

    user.isApproved = !!approved;
    await user.save();

    res.json({
      message: `Alumni ${approved ? 'approved' : 'rejected'} successfully.`,
      user: { _id: user._id, name: user.name, email: user.email, isApproved: user.isApproved },
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Get a single user by ID (admin use)
 * @route   GET /api/users/:id
 * @access  Private/collegeAdmin or superAdmin
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('collegeId', 'name');
    if (!user) { res.status(404); throw new Error('User not found.'); }
    res.json(user);
  } catch (error) { next(error); }
};
