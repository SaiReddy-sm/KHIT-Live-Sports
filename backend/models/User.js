// ==========================================
// KHIT Live Sports Portal - User Model
// ==========================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },
  role: {
    type: String,
    enum: ["admin", "staff"], 
    default: "staff"
  },
  department: {
    type: String,
    enum: ["Sports PE", "CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"],
    default: "Sports PE"
  }
}, {
  timestamps: true
});

// Pre-save middleware: Auto-hashes the password natively using async/await (Safe for all Mongoose versions)
userSchema.pre('save', async function () {
  // Only hash the password if it is being newly created or updated
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method: Compares entered password with stored hashed password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);