const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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

var sample = array => array[Math.floor(Math.random() * array.length)];


var seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        var random1000 = Math.floor(Math.random() * 1000);
		var price = Math.floor(Math.random() * 20) + 10;
        var camp = new Campground({
			author: "606ed692a6f9e70428fa833e",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
			description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
			price,
            geometry: {
                type: "Point",
                coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				]
            },
			images: [
				{
				url:	"https://res.cloudinary.com/arihant/image/upload/v1619093793/VacayCamp/nqz6ffdvnslp0daqptmz.jpg",
					filrname: "VacayCamp/nqz6ffdvnslp0daqptmz"
				},
				{
				url: "https://res.cloudinary.com/arihant/image/upload/v1619093791/VacayCamp/gudor020pospydjjptnh.jpg",
				filename: "VacayCamp/gudor020pospydjjptnh"
				}	
			]
			
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})