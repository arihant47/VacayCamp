var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var Campground = require("../models/campground");
var {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
var campgrounds = require("../controllers/campgrounds");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)); 

router.get("/:id", catchAsync(campgrounds.showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
