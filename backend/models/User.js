const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"A user must have a name"],
    unique: true 
  },
  email: {
    type: String,
    required: [true,"A user must have an email"],
    unique: true 
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password must be at least 8 characters long"], // Minimum length
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
  year:
  { 
    type: Number,
    required: function () {
      return this.role === "student";
    }, 
    validate: {
    validator: function (value) {
        return this.role !== "student" || value > 0;
      },
      message: "Year must be a positive number for students.",
    },
    
  },
  totalCredits: {
    type: Number,
    default: 0, // Start with 0 credits
    validate: {
      validator: function (value) {
        return this.role !== "student" || value <= 20; // Ensure credits do not exceed 20
      },
      message: "Students cannot exceed 20 credits.",
    },
  },
});

// PRE SAVE HOOKS SECTION

// **Pre-save Hook** — Automatically hash the course password before saving
courseSchema.pre("save", async function (next) {
  if (!this.isModified("coursePassword")) {
    return next(); // Only hash if the password is new or changed
  }
  const salt = await bcrypt.genSalt(12); // Salt strength of 12
  this.coursePassword = await bcrypt.hash(this.coursePassword, salt); // Hash the password
  next();
});

module.exports = mongoose.model("User", userSchema);
