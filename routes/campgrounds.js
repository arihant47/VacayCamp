var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var Campground = require("../models/campground");
var {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
var campgrounds = require("../controllers/campgrounds");
var multer = require("multer");
var upload = multer({dest: "uploads/"});

router.route("/")
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)); 

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
