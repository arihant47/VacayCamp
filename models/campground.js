var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CampgroundSchema = new Schema({
	title: String,
	price: String,
	description: String,
	location: String
});

module.exports = mongoose.model("Campground", CampgroundSchema);