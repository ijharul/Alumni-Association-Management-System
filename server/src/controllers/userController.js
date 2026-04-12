import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        company: user.company,
        college: user.college,
        currentRole: user.currentRole,
        experience: user.experience,
        projects: user.projects,
        batch: user.batch,
        profilePicture: user.profilePicture,
        resume: user.resume,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile & upload resume
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Partial updates support
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.company = req.body.company !== undefined ? req.body.company : user.company;
      user.college = req.body.college !== undefined ? req.body.college : user.college;
      user.currentRole = req.body.currentRole !== undefined ? req.body.currentRole : user.currentRole;
      user.batch = req.body.batch !== undefined ? req.body.batch : user.batch;
      
      // Skills can be sent as JSON string or array, handle accordingly
      if (req.body.skills) {
        if (Array.isArray(req.body.skills)) {
          user.skills = req.body.skills;
        } else if (typeof req.body.skills === 'string') {
          // If sent from form-data, it might be a comma separated string
          user.skills = req.body.skills.split(',').map(s => s.trim());
        }
      }

      if (req.body.experience) {
        try {
           user.experience = typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience;
        } catch (e) {
           console.error("Experience payload malformed", e);
        }
      }

      if (req.body.projects) {
        try {
           user.projects = typeof req.body.projects === 'string' ? JSON.parse(req.body.projects) : req.body.projects;
        } catch (e) {
           console.error("Projects array malformed", e);
        }
      }

      // Check if file was uploaded via multer memory storage
      if (req.file) {
        // We will process the Cloudinary stream upload via Promise explicitly
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              {
                resource_type: 'image', // In Cloudinary, basic pdfs upload well under image/auto
                folder: 'alumnios/resumes'
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const result = await streamUpload(req);
        
        // Output secure url to the DB document
        user.resume = result.secure_url;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        company: updatedUser.company,
        college: updatedUser.college,
        currentRole: updatedUser.currentRole,
        experience: updatedUser.experience,
        projects: updatedUser.projects,
        batch: updatedUser.batch,
        profilePicture: updatedUser.profilePicture,
        resume: updatedUser.resume,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (Search/Directory)
 * @route   GET /api/users
 * @access  Private
 */
export const getUsers = async (req, res, next) => {
  try {
    const { skills, company, role } = req.query;
    
    // Construct dynamic mongoose query
    let query = {};

    if (role) {
      query.role = role;
    }
    
    if (company) {
      // Case-insensitive regex match
      query.company = { $regex: company, $options: 'i' };
    }
    
    if (skills) {
      // Allow searching by comma-separated skills (e.g. "?skills=React,Node")
      const skillsArray = skills.split(',').map(s => new RegExp(s.trim(), 'i'));
      query.skills = { $in: skillsArray };
    }

    const users = await User.find(query).select('-password');
    res.json(users);

  } catch (error) {
    next(error);
  }
};
