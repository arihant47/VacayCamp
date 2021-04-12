var express = require("express");
var router = express.Router({mergeParams: true});
var {validateReview} = require("../middleware");
var catchAsync = require("../utils/catchAsync");
var ExpressError = require("../utils/ExpressError");
var Review = require("../models/review");
var Campground = require("../models/campground");

router.post("/", validateReview, catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id);
	var review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash("success", "Created new review!");
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", catchAsync(async function(req, res){
	var {id, reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully deleted review!");
	res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;