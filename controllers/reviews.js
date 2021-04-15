var Review = require("../models/review");
var Campground = require("../models/campground");

module.exports.createReview = async function(req, res){
	var campground = await Campground.findById(req.params.id);
	var review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash("success", "Created new review!");
	res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async function(req, res){
	var {id, reviewId} = req.params;
	await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully deleted review!");
	res.redirect(`/campgrounds/${id}`);
}