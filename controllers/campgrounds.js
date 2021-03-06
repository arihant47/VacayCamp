var Campground = require("../models/campground");
var mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
var mapBoxToken = process.env.MAPBOX_TOKEN;
var geocoder = mbxGeocoding({ accessToken: mapBoxToken });
var {cloudinary} = require("../cloudinary");

module.exports.index = async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm = function(req, res){
	res.render("campgrounds/new");
}

module.exports.createCampground = async function(req, res, next){
	var geoData = await geocoder.forwardGeocode({
		query: req.body.campground.location,
		limit: 1
	}).send()	
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
	var campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
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
	var imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	if(req.body.deleteImages) {
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
	}
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground!");
	res.redirect("/campgrounds");
}