const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  matric_no: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String, // Assuming profile picture is stored as a URL
    default: "default_profile_pic.jpg", // Default profile picture URL
  },
  password: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

studentSchema.pre("save", async function (next) {
  try {
    // Hash the password only if it's modified or a new user
    if (!this.isModified("password")) {
      return next();
    }
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
