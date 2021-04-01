var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var ExpressError = require("../utils/ExpressError");
var Campground = require("../models/campground");
var {campgroundSchema} = require("../schemas.js");

var validateCampground = (req, res, next) => {
	var {error} = campgroundSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

router.get("/", catchAsync(async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
}));

router.get("/new", function(req, res){
	res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync( async function(req, res, next){
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

	var campground = new Campground(req.body.campground);
	await campground.save();
	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${campground._id}`);
})); 

router.get("/:id",catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id).populate("reviews");
	if(!campground){
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", {campground});
}));

router.get("/:id/edit", catchAsync( async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit", {campground});
}));

router.put("/:id", validateCampground, catchAsync( async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:id", catchAsync(async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground!");
	res.redirect("/campgrounds");
}));

module.exports = router;
