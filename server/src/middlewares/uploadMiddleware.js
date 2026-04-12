import multer from 'multer';

// Use memory storage to process uploads directly from the buffer
const storage = multer.memoryStorage();

// File limitation and validation filter
const fileFilter = (req, file, cb) => {
  // Allow only PDF documents
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF format is allowed for resume uploads!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit max size
  },
});

export default upload;
