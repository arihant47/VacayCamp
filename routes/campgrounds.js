var express = require("express");
var router = express.Router();

router.get("/campgrounds", catchAsync(async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
}));

router.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

router.post("/campgrounds", validateCampground, catchAsync( async function(req, res, next){
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

	var campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
})); 

router.get("/campgrounds/:id",catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id).populate("reviews");
	res.render("campgrounds/show", {campground});
}));

router.get("/campgrounds/:id/edit", catchAsync( async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit", {campground});
}));

router.put("/campgrounds/:id", validateCampground, catchAsync( async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete("/campgrounds/:id", catchAsync(async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
}));
