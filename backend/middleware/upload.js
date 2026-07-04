const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary - will automatically pick up CLOUDINARY_URL env var
cloudinary.config();

// Setup multer memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter
});

// Middleware to stream memory buffer to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'hrms_profiles' },
    (error, result) => {
      if (error) {
        console.error('[CLOUDINARY] Stream upload error:', error);
        return res.status(500).json({ message: 'Failed to upload image to cloud storage' });
      }
      req.fileUrl = result.secure_url;
      next();
    }
  );

  stream.write(req.file.buffer);
  stream.end();
};

module.exports = {
  upload,
  uploadToCloudinary
};
