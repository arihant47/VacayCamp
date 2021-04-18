var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var Campground = require("../models/campground");
var {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
var campgrounds = require("../controllers/campgrounds");
var multer = require("multer");
var {storage} = require("../cloudinary");
var upload = multer({storage});

router.route("/")
	.get(catchAsync(campgrounds.index))
	// .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)); 
	.post(upload.array("image"), function(req, res){
	console.log(req.body, req.files);
	res.send("IT WORKED");
});

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
