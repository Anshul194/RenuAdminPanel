import mongoose from "mongoose";

const lorSchema = new mongoose.Schema(
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
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: function(v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function(v) {
          // Allow optional country code
          return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    
    post: {
      type: String,
      required: [true, "Post is required"],
      lowercase: true,
      trim: true,
      minLength: [2, "Post must be at least 2 characters long"],
      maxLength: [50, "Post cannot exceed 50 characters"],
    },
    
    department: {
      type: String,
      required: [true, "Department is required"],
      lowercase: true,
      trim: true,
      minLength: [2, "Department must be at least 2 characters long"],
      maxLength: [50, "Department cannot exceed 50 characters"],
    },
    
    pdfBuffer: {
      type: Buffer,
      required: [true, "PDF buffer is required"],
    },
    
    status: {
      type: String,
      enum: ["active", "expired", "revoked"],
      default: "active",
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
lorSchema.index({ email: 1, status: 1 });
lorSchema.index({ createdAt: 1 });

// Virtual to check if LOR was created within last year
lorSchema.virtual('isRecent').get(function() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return this.createdAt >= oneYearAgo;
});

// Virtual to get LOR age in months
lorSchema.virtual('ageInMonths').get(function() {
  const now = new Date();
  const months = (now.getFullYear() - this.createdAt.getFullYear()) * 12 +
                (now.getMonth() - this.createdAt.getMonth());
  return months;
});

// Pre-save middleware
lorSchema.pre('save', async function(next) {
  try {
    // Auto-update status based on age
    if (this.isRecent) {
      this.status = 'active';
    } else {
      this.status = 'expired';
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
lorSchema.methods.revoke = async function() {
  this.status = 'revoked';
  return await this.save();
};

// Static methods for common queries
lorSchema.statics.findActiveLORs = function() {
  return this.find({ status: 'active' });
};

lorSchema.statics.findByDepartment = function(department) {
  return this.find({
    department: department.toLowerCase(),
    status: 'active'
  });
};

lorSchema.statics.findRecentByEmail = function(email) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return this.find({
    email: email.toLowerCase(),
    createdAt: { $gte: oneYearAgo },
    status: 'active'
  });
};

const LorModel = mongoose.model("Lor", lorSchema);

export default LorModel;