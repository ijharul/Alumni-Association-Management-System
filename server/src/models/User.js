import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'alumni', 'collegeAdmin', 'superAdmin'],
      default: 'student',
    },
    // Multi-tenant: which college this user belongs to
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
    },
    // Subscription
    plan: {
      type: String,
      enum: ['Free', 'Monthly', 'Yearly'],
      default: 'Free',
    },
    tokens: {
      type: Number,
      default: 50,
    },
    // Common profile fields
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    profilePicture: { type: String, default: '' },
    resume: { type: String, default: '' },
    // For users whose college is not in the list
    pendingCollege: { type: String, default: '' },
    // Alumni approval by collegeAdmin
    isApproved: { type: Boolean, default: true },  // true by default; set false to pend review
    // Experience + Projects (rich arrays)
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        techStack: [String],
        description: String,
      },
    ],
    // Student-specific fields
    branch: { type: String, default: '' },
    year: { type: Number },
    careerGoal: { type: String, default: '' },
    // Alumni / shared fields
    company: { type: String, default: '' },
    currentRole: { type: String, default: '' },
    college: { type: String, default: '' },  // legacy text field kept for backward compat
    batch: { type: Number },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
