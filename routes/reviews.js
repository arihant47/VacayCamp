var express = require("express");
var router = express.Router({mergeParams: true});
var {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
var catchAsync = require("../utils/catchAsync");
var ExpressError = require("../utils/ExpressError");
var Review = require("../models/review");
var Campground = require("../models/campground");
var reviews = require("../controllers/reviews");

router.post("/",isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;