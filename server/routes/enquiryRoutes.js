import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce existing JWT Authentication on all enquiry routes
router.use(protect);

router
  .route('/')
  .post(createEnquiry)
  .get(getEnquiries);

router
  .route('/:id')
  .get(getEnquiryById)
  .put(updateEnquiry)
  .delete(deleteEnquiry);

export default router;
