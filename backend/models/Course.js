const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A course must have a name"],
    },
    lecturer: {
      type: String,
      required: [true, "A course must have a lecturer"],
    },
    creditPoints: {
      type: Number,
      required: [true, "A course must have credit points"],
      min: [3, "Credit points must be at least 3"],
      max: [5, "Credit points must not exceed 5"],
    },
    maxStudents: {
      type: Number,
      required: [true, "A course must have a maximum number of students"],
      min: [5, "A course must have at least 5 students"],
      max: [50, "A course cannot have more than 50 students"],
    },
    enrolledStudents: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: ["student"],
          required: true,
        },
        yearOfStudy: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// **Virtual Field** to calculate free places
courseSchema.virtual("freePlaces").get(function () {
  return this.maxStudents - this.enrolledStudents.length;
});

module.exports = mongoose.model("Course", courseSchema);
