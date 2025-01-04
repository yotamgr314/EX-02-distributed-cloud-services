const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 8,
      validate: {
        validator: function (v) {
          return /[A-Z]/.test(v) && /\d/.test(v) && /[@$!%*?&]/.test(v);
        },
        message:
          "Password must contain at least one uppercase letter, one number, and one special character.",
      },
    },
    role: {
      type: String,
      enum: ["Student", "Staff"],
      required: true,
    },
    address: {
      street: { type: String, required: [true, "Street is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
    },
    yearOfStudy: {
      type: Number,
      min: [1, "Year of study must be at least 1"],
      max: [5, "Year of study cannot exceed 5"],
      required: function () {
        return this.role === "Student";
      },
    },
    creditPoints: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return this.role !== "Student" || value <= 20;
        },
        message: "Students cannot exceed 20 credit points.",
      },
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook for password hashing and field removal
userSchema.pre("save", async function (next) {
  // ✅ Hash the password if it was modified
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  // ✅ Remove irrelevant fields for "Staff" role
  if (this.role === "Staff") {
    this.yearOfStudy = undefined;
    this.creditPoints = undefined;
  }

  next();
});

// ✅ Method to validate password
userSchema.methods.isPasswordValid = async function (enteredPassword) {
  if (!enteredPassword) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
