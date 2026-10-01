import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
      maxlength: [120, 'Destination cannot exceed 120 characters'],
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    travelers: {
      type: Number,
      required: [true, 'Number of travelers is required'],
      min: [1, 'Number of travelers must be at least 1'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Enquiry must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
