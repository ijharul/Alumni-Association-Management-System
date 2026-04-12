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
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ['Student', 'Alumni', 'Admin'],
      default: 'Student',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    company: {
      type: String,
    },
    college: {
      type: String,
    },
    currentRole: {
      type: String,
    },
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String,
      }
    ],
    projects: [
      {
        title: String,
        techStack: [String],
        description: String,
      }
    ],
    batch: {
      type: Number,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Encrypt password using bcryptjs before saving
userSchema.pre('save', async function (next) {
  // Only hash if the password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify matched user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
