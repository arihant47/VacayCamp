var cloudinary = require("cloudinary").v2;
var {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

var storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "VacayCamp",
		allowedFormats: ["jpeg", "png", "jpg"]
	}
});

module.exports = {
	cloudinary,
	storage
}