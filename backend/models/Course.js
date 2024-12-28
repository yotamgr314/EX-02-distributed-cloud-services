// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  credits: { 
    type: Number, 
    enum: [3, 3.5, 4, 4.5, 5], 
    required: true 
  },

  maxStudents: {
     type: Number,
    required: true 
  },
  enrolledStudents: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      studentName: String,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);

// **Virtual Field** to calculate free places
courseSchema.virtual("freePlaces").get(function () {
  return this.maxStudents - this.enrolledStudents.length;
});

// **Pre-save Hook** — Prevent over-enrollment
courseSchema.pre("save", function (next) {
  if (this.enrolledStudents.length > this.maxStudents) {
    return next(new Error("Cannot enroll more students. The course is full."));
  }
  next();
});