import Listing from "./models/listing.js";
import Review from "./models/review.js";
import {listingSchema, reviewSchema} from './schema.js';
import ExpressError from './utils/ExpressError.js';

export const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        let originalUrl = req.originalUrl;
        if (originalUrl.includes("/reviews")) {
            originalUrl = originalUrl.split("/reviews")[0];
        }
        req.session.redirectUrl = originalUrl;
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

export const savedRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const isOwner = async(req, res, next) => {
let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if(!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

export const validateListing = (req, res, next) =>{
let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

export const validateReview = (req, res, next) =>{
let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

export const isReviewAuthor = async(req, res, next) => {
let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review no longer exists");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};