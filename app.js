var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
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

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.render("home");
});

app.get("/campgrounds", async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index", {campgrounds});
});

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

app.post("/campgrounds", async function(req, res){
	var campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
}); 

app.get("/campgrounds/:id", async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/show", {campground});
});

app.get("/campgrounds/:id/edit", async function(req, res){
	var campground = await Campground.findById(req.params.id)
	res.render("campgrounds/edit", {campground});
});

app.put("/campgrounds/:id", async function(req, res){
	var {id}= req.params;
	var campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});  //Using spread (...) operator here
	res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async function(req, res){
	var {id} = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campgrounds");
});

app.listen(3000, function(){
	console.log("The VacayCamp Server has started");
});
