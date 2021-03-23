var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	]
});

CampgroundSchema.post("findOneAndDelete", async function(){
	console.log("Deleted!!");
});

module.exports = mongoose.model("Campground", CampgroundSchema);