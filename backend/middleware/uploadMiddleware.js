// ==========================================
// KHIT Live Sports Portal - Upload Middleware
// ==========================================

const multer = require('multer');
const path = require('path');

// Configure local disk storage engine
const storage = multer.diskStorage({
  // Specify the destination folder where files will be uploaded
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved inside 'backend/uploads/'
  },
  // Format the file name to prevent naming collisions
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filter file types to only allow images (JPEG, JPG, PNG)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  
  // Check the file extension type
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Validation Error: Only image files (.jpg, .jpeg, .png) are allowed.'));
  }
};

// Initialize multer configuration limits and filters
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Set maximum file upload limit to 5MB
  }
});

// Export the raw upload instance directly (DO NOT wrap in curly braces {})
module.exports = upload;