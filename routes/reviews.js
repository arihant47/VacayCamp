var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var ExpressError = require("../utils/ExpressError");
var Review = require("../models/review");
var Campground = require("../models/campground");
var {reviewSchema} = require("../schemas.js");

var validateReview = (req, res, next) => {
	var {error} = reviewSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

router.post("/", validateReview, catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id);
	var review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/:reviewId", catchAsync(async function(req, res){
	var {id, reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;