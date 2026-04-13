import College from '../models/College.js';
import User from '../models/User.js';

/**
 * @desc    Create a college (superAdmin only)
 * @route   POST /api/colleges
 */
export const createCollege = async (req, res, next) => {
  try {
    const { name, location, domain, logo } = req.body;
    if (!name?.trim()) { res.status(400); throw new Error('College name is required.'); }

    const exists = await College.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (exists) { res.status(400); throw new Error('A college with this name already exists.'); }

    const college = await College.create({ name: name.trim(), location, domain, logo, createdBy: req.user._id });
    res.status(201).json(college);
  } catch (error) { next(error); }
};

/**
 * @desc    Get all colleges (public — signup dropdown)
 * @route   GET /api/colleges
 */
export const getColleges = async (req, res, next) => {
  try {
    const colleges = await College.find({})
      .sort({ name: 1 })
      .select('_id name location domain')
      .populate('adminId', 'name email');
    res.json(colleges);
  } catch (error) { next(error); }
};

/**
 * @desc    Get single college
 * @route   GET /api/colleges/:id
 */
export const getCollegeById = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id).populate('adminId', 'name email');
    if (!college) { res.status(404); throw new Error('College not found.'); }
    res.json(college);
  } catch (error) { next(error); }
};

/**
 * @desc    Update college (superAdmin only)
 * @route   PUT /api/colleges/:id
 */
export const updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!college) { res.status(404); throw new Error('College not found.'); }
    res.json(college);
  } catch (error) { next(error); }
};

/**
 * @desc    Delete college (superAdmin only)
 * @route   DELETE /api/colleges/:id
 */
export const deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) { res.status(404); throw new Error('College not found.'); }

    // Unlink users from this college
    await User.updateMany({ collegeId: req.params.id }, { $set: { collegeId: null } });

    await college.deleteOne();
    res.json({ message: `College "${college.name}" deleted successfully.` });
  } catch (error) { next(error); }
};

/**
 * @desc    Assign a user as collegeAdmin for a college
 * @route   PUT /api/colleges/:id/assign-admin
 * @body    { userId }
 * @access  Private/superAdmin
 */
export const assignCollegeAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) { res.status(400); throw new Error('userId is required.'); }

    const [college, user] = await Promise.all([
      College.findById(req.params.id),
      User.findById(userId),
    ]);

    if (!college) { res.status(404); throw new Error('College not found.'); }
    if (!user) { res.status(404); throw new Error('User not found.'); }

    // Demote previous admin of this college (if any) back to alumni/student
    if (college.adminId && college.adminId.toString() !== userId) {
      await User.findByIdAndUpdate(college.adminId, { role: 'alumni' });
    }

    // Promote the user
    user.role = 'collegeAdmin';
    user.collegeId = college._id;
    await user.save();

    // Store adminId on college for quick reference
    college.adminId = user._id;
    await college.save();

    res.json({
      message: `${user.name} is now collegeAdmin for ${college.name}.`,
      college: await college.populate('adminId', 'name email'),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Create a brand-new user as collegeAdmin for a college (superAdmin only)
 * @route   POST /api/colleges/:id/create-admin
 * @body    { name, email, password }
 */
export const createCollegeAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400); throw new Error('Name, email and password are required.');
    }

    const college = await College.findById(req.params.id);
    if (!college) { res.status(404); throw new Error('College not found.'); }

    const exists = await User.findOne({ email });
    if (exists) { res.status(400); throw new Error('A user with this email already exists.'); }

    // Create the new collegeAdmin user
    const newAdmin = await User.create({
      name, email, password,
      role: 'collegeAdmin',
      collegeId: college._id,
      plan: 'Yearly',
      tokens: 9999,
    });

    // Demote old admin if any
    if (college.adminId && college.adminId.toString() !== newAdmin._id.toString()) {
      await User.findByIdAndUpdate(college.adminId, { role: 'alumni' });
    }

    college.adminId = newAdmin._id;
    await college.save();

    res.status(201).json({
      message: `${newAdmin.name} created as collegeAdmin for ${college.name}.`,
      user: { _id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role },
      college: { _id: college._id, name: college.name, adminId: college.adminId },
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Get stats for a college
 * @route   GET /api/colleges/:id/stats
 */
export const getCollegeStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [students, alumni, paid] = await Promise.all([
      User.countDocuments({ collegeId: id, role: 'student' }),
      User.countDocuments({ collegeId: id, role: 'alumni' }),
      User.countDocuments({ collegeId: id, plan: { $ne: 'Free' } }),
    ]);
    res.json({ students, alumni, paid, total: students + alumni });
  } catch (error) { next(error); }
};
