const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: [true, "A course must have an ID"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "A course must have a name"]
  },
  lecturer: {
    type: String,
    required: [true, "A course must have a lecturer"]
  },
  creditPoints: {
    type: Number,
    required: [true, "A course must have credit points"],
    min: [3, "Credit points must be at least 3"],
    max: [5, "Credit points must not exceed 5"]
  },
  maxStudents: {
    type: Number,
    required: [true, "A course must have a maximum number of students"]
  },
  enrolledStudents: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        enum: ['student'],
        required: true
      }
    }
  ]
}, { timestamps: true });

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

module.exports = mongoose.model("Course", courseSchema);
