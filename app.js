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

var campgrounds = require("./routes/campgrounds");

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

var validateReview = (req, res, next) => {
	var {error} = reviewSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

app.use("/campgrounds", campgrounds)

app.get("/", function(req, res){
	res.render("home");
});

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
