var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var ejsMate = require("ejs-mate");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var catchAsync = require("./utils/catchAsync");
var ExpressError = require("./utils/ExpressError");
var Joi = require("joi");
var {campgroundSchema, reviewSchema} = require("./schemas.js");
var Review = require("./models/review");
var app = express();

mongoose.connect("mongodb://localhost/vacay-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));

var validateCampground = (req, res, next) => {
	var {error} = campgroundSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

var validateReview = (req, res, next) => {
	var {error} = reviewSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

app.get("/", function(req, res){
	res.render("home");
});

app.get("/campgrounds", catchAsync(async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
}));

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, catchAsync( async function(req, res, next){
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);

	var campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
})); 

app.get("/campgrounds/:id",catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id).populate("reviews");
	res.render("campgrounds/show", {campground});
}));

app.get("/campgrounds/:id/edit", catchAsync( async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit", {campground});
}));

app.put("/campgrounds/:id", validateCampground, catchAsync( async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id);
	var review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
}));

app.all("*", function(req, res, next){
	next(new ExpressError("Page not found!", 404))
});

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if(!err.message) err.message="Oh No, Something Went Wrong!"
	res.status(statusCode).render("error", {err});
});

app.listen(3000, function(){
	console.log("The VacayCamp Server has started");
});
