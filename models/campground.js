var mongoose = require("mongoose");
var Review = require("./review");
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

CampgroundSchema.post("findOneAndDelete", async function(doc){
	if(doc){
		await Review.deleteMany({
			_id: {
				$in: doc.reviews  //review id is somewhere in document.reviews
			}
		})
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);