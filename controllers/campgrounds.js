var Campground = require("../models/campground");

module.exports.index = async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = function(req, res){
	res.render("campgrounds/new");
}

module.exports.createCampground = async function(req, res, next){
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

	var campground = new Campground(req.body.campground);
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async function(req, res){
	var campground = await Campground.findById(req.params.id).populate({
		path: "reviews",
		populate: {
			path: "author"
		}
	}).populate("author");
	if(!campground){
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", {campground});
}

module.exports.renderEditForm =  async function(req, res){
	var {id} = req.params;
	var campground = await Campground.findById(id)
	if(!campground){
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", {campground});
}

module.exports.updateCampground =  async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground!");
	res.redirect("/campgrounds");
}