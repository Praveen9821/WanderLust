import Listing from "../models/listing.js";
import opencage from "opencage-api-client";
const OpenToken = process.env.OPENCAGE_API_KEY;

const index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

const renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};

const showListing = async (req,res)=>{
 let {id} = req.params;
 const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
 if(!listing) {
    req.flash("error", "Listing you requested for does not exits!");
    return res.redirect("/listings");
 }
 console.log(listing);
 res.render("listings/show.ejs", {listing});
};

const createListing = async (req, res) => {

    let response = await opencage.geocode({
        q: req.body.listing.location,
        limit: 1,
        key: OpenToken
    });

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // ✅ ALWAYS SET GEOMETRY
    if (response.results.length > 0) {
        let result = response.results[0];
        newListing.geometry = {
            type: "Point",
            coordinates: [result.geometry.lng, result.geometry.lat]
        };
    } else {
        // fallback if API fails
        newListing.geometry = {
            type: "Point",
            coordinates: [77.209, 28.6139]
        };
    }

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

const renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exits!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

const updateListing = async (req, res) => {
    let { id } = req.params;
    
    // 1. Re-geocode the location in case it changed
    let response = await opencage.geocode({ q: req.body.listing.location, limit: 1, key: OpenToken });
    console.log("Geocode Response:", response.results);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (response.results.length > 0) {
        let result = response.results[0];
        listing.geometry = { 
            type: "Point", 
            coordinates: [result.geometry.lng, result.geometry.lat] 
        };
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }
    
    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


const deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id, {...req.body.listing});
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

export default {index, renderNewForm, showListing, createListing, renderEditForm, updateListing, deleteListing};