var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Review", reviewSchema);