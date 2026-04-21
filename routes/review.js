import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import Review from '../models/review.js';
import Listing from '../models/listing.js';
import { isLoggedIn, isReviewAuthor, validateReview } from '../middleware.js';
import reviewController from  '../controllers/review.js';

// Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
// Mongo $pull operator -> This operator removes from an exiting array all instances 
// of a value or values that match a specified condition
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

export default router;
