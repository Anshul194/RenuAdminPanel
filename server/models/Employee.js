import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, lowercase: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, trim: true, unique: true }, // Required field
    post: { type: String, lowercase: true, trim: true }, // Reference department title
    department: { type: String, lowercase: true, trim: true },
    tenure: { type: String, lowercase: true, trim: true },
    college: { type: String, lowercase: true, trim: true },
    department: { type: String, lowercase: true, trim: true }, // Fixed the missing type
    startDate: { type: String },
    endDate: { type: String },
    offerletter: {
      type: Buffer, // Ensure this is appropriate for your use case
    },
    icc: {
      type: Buffer, // Ensure this is appropriate for your use case
    },
    lor: {
      type: Buffer, // Ensure this is appropriate for your use case
    },
  },
  { timestamps: true }
);

// Validation to ensure endDate is after startDate
employeeSchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("endDate must be after startDate"));
  }
  next();
});

// Export with the correct schema name
const employeeModel = mongoose.model("Employee", employeeSchema);
export default employeeModel;
