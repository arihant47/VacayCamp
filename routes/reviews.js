var express = require("express");
var router = express.Router();

router.post("/campgrounds/:id/reviews", validateReview, catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id);
	var review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async function(req, res){
	var {id, reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/campgrounds/${id}`);
}));