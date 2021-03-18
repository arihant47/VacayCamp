var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	body: String,
	rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);