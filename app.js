var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
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

app.get("/", function(req, res){
	res.render("home");
});

app.get("/campgrounds", async function(req, res){
	var campgrounds = await Campground.find({});
	res.render("campgrounds/index");
});
app.listen(3000, function(){
	console.log("The VacayCamp Server has started");
});
