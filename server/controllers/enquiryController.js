import mongoose from 'mongoose';
import Enquiry from '../models/Enquiry.js';

/**
 * @desc    Create a new tour enquiry
 * @route   POST /api/enquiries
 * @access  Private
 */
export const createEnquiry = async (req, res) => {
  try {
    const { fullName, email, phone, destination, travelDate, travelers, message } = req.body;

    // Field existence validation
    if (!fullName || !email || !phone || !destination || !travelDate || travelers === undefined || travelers === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, phone, destination, travelDate, and travelers',
      });
    }

    // Name validation
    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Full name must be at least 2 characters long',
      });
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Travelers validation
    const parsedTravelers = Number(travelers);
    if (isNaN(parsedTravelers) || parsedTravelers < 1) {
      return res.status(400).json({
        success: false,
        message: 'Number of travelers must be a positive number of at least 1',
      });
    }

    // Date validation
    const parsedDate = new Date(travelDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid travel date',
      });
    }

    const enquiry = await Enquiry.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      destination: destination.trim(),
      travelDate: parsedDate,
      travelers: parsedTravelers,
      message: message ? message.trim() : '',
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Tour enquiry created successfully',
      enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating enquiry',
    });
  }
};

/**
 * @desc    Get all tour enquiries for logged-in user
 * @route   GET /api/enquiries
 * @access  Private
 */
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching enquiries',
    });
  }
};

/**
 * @desc    Get a single tour enquiry by ID
 * @route   GET /api/enquiries/:id
 * @access  Private
 */
export const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID format',
      });
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Tour enquiry not found',
      });
    }

    // Ensure user can only view their own enquiry
    if (enquiry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own enquiries',
      });
    }

    return res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching enquiry details',
    });
  }
};

/**
 * @desc    Update a tour enquiry
 * @route   PUT /api/enquiries/:id
 * @access  Private
 */
export const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID format',
      });
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Tour enquiry not found',
      });
    }

    // Ensure user can only modify their own enquiry
    if (enquiry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only modify your own enquiries',
      });
    }

    const { fullName, email, phone, destination, travelDate, travelers, message } = req.body;

    if (fullName !== undefined) {
      if (fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters long',
        });
      }
      enquiry.fullName = fullName.trim();
    }

    if (email !== undefined) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }
      enquiry.email = email.toLowerCase().trim();
    }

    if (phone !== undefined) {
      if (!phone.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Phone number cannot be empty',
        });
      }
      enquiry.phone = phone.trim();
    }

    if (destination !== undefined) {
      if (!destination.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Destination cannot be empty',
        });
      }
      enquiry.destination = destination.trim();
    }

    if (travelDate !== undefined) {
      const parsedDate = new Date(travelDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid travel date',
        });
      }
      enquiry.travelDate = parsedDate;
    }

    if (travelers !== undefined) {
      const parsedTravelers = Number(travelers);
      if (isNaN(parsedTravelers) || parsedTravelers < 1) {
        return res.status(400).json({
          success: false,
          message: 'Number of travelers must be at least 1',
        });
      }
      enquiry.travelers = parsedTravelers;
    }

    if (message !== undefined) {
      enquiry.message = message.trim();
    }

    const updatedEnquiry = await enquiry.save();

    return res.status(200).json({
      success: true,
      message: 'Tour enquiry updated successfully',
      enquiry: updatedEnquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating enquiry',
    });
  }
};

/**
 * @desc    Delete a tour enquiry
 * @route   DELETE /api/enquiries/:id
 * @access  Private
 */
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID format',
      });
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Tour enquiry not found',
      });
    }

    // Ensure user can only delete their own enquiry
    if (enquiry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own enquiries',
      });
    }

    await enquiry.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Tour enquiry deleted successfully',
      id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting enquiry',
    });
  }
};
