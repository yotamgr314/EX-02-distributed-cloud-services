const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true 
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true 
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
  },
  role: { 
    type: String,
    enum: ["student", "staff"],
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  yearOfStudy: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
    validate: {
      validator: function (value) {
        return this.role === "student" && value > 0;
      },
      message: "Year must be a positive number for students."
    }
  },
  totalCredits: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return this.role === "student" && value <= 20;
      },
      message: "Students cannot exceed 20 credits."
    }
  }
});

// Pre-save hook to automatically hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Pre-save hook to remove irrelevant fields based on role
userSchema.pre('save', function (next) {
  if (this.role !== "student") {
    delete this.yearOfStudy;
    delete this.totalCredits;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
