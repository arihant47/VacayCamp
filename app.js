var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var ejsMate = require("ejs-mate");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var catchAsync = require("./utils/catchAsync");
var ExpressError = require("./utils/ExpressError");
var Joi = require("joi");
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

app.post("/campgrounds", catchAsync( async function(req, res, next){
	// if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
	var campgroundSchema = Joi.object({
		campground: Joi.object({
			title: Joi.string().required(),
			price: Joi.number().required().min(0),
			image: Joi.string().required(),
			location: Joi.string().required(),
			description: Joi.string().required()
		}).required()
	})
	var {error} = campgroundSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	}
	console.log(result);
	var campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
})); 

app.get("/campgrounds/:id",catchAsync(async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/show", {campground});
}));

app.get("/campgrounds/:id/edit", catchAsync( async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit", {campground});
}));

app.put("/campgrounds/:id", catchAsync( async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id", catchAsync(async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
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
