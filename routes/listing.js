import express from 'express';
const router = express.Router();
import wrapAsync from '../utils/wrapAsync.js';
import Listing from '../models/listing.js';
import User from '../models/user.js';
import { isLoggedIn, isOwner, validateListing } from '../middleware.js';
import listingController from "../controllers/listings.js"
import multer from 'multer';
import {storage} from "../cloudConfig.js";
const upload = multer({storage});

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.single('listing[image][url]'), wrapAsync(listingController.createListing));
    // .post(upload.single('listing[image][url]'), (req, res) =>{
    //     res.send(req.file);
    // });

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


// Index Route
// router.get("/", wrapAsync(listingController.index));


// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
    // let {title, description, image, price, country, location} = req.body;
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    // const newListing = new Listing(req.body.listing);
    // if(!newListing.title){
    //     throw new ExpressError(400, "Title is missing!");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "Description is missing!");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "Location is missing!");
    // }

    // await newListing.save();
    // res.redirect("/listings");
// }));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

export default router;