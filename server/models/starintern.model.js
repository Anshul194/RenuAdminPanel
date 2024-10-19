import mongoose from "mongoose";

const starInternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address"
      }
    },
    
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function(value) {
          return /^(\+\d{1,3}[-\s]?)?\d{10}$/.test(value);
        },
        message: "Please enter a valid phone number"
      }
    },
    
    post: {
      type: String,
      required: [true, "Post is required"],
      trim: true,
      minLength: [2, "Post must be at least 2 characters long"],
      maxLength: [50, "Post cannot exceed 50 characters"],
    },
    
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      minLength: [2, "Department must be at least 2 characters long"],
      maxLength: [50, "Department cannot exceed 50 characters"],
    },
    
    duration: {
      type: String,
      trim: true,
    },
    
    pdfBuffer: {
      type: Buffer,
      required: [true, "PDF buffer is required"],
    },
    
    status: {
      type: String,
      enum: {
        values: ["active", "expired", "revoked"],
        message: "{VALUE} is not a valid status"
      },
      default: "active",
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound index for better query performance
starInternSchema.index({ email: 1, phone: 1 });

// Add pre-save hook to ensure data consistency
starInternSchema.pre('save', function(next) {
  // Convert email to lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Remove any extra spaces from phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, '');
  }
  
  next();
});

const StarIntern = mongoose.model("StarIntern", starInternSchema);

export default StarIntern;