var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String
});

module.exports = mongoose.model("Campground", CampgroundSchema);