import mongoose from "mongoose";

const starInterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, lowercase: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    pdfBuffer: { type: String, required: true },
  },
  { timestamps: true }
);

// Export with the correct schema name
const startIntern = mongoose.model("StarIntern", starInterSchema);
export default startIntern;
