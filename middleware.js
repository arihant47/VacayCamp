module.exports.isLoggedIn = function(req, res, next){
	if(!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
}

module.exports.validateCampground = (req, res, next) => {
	var {error} = campgroundSchema.validate(req.body);
	if(error){
		var msg = error.details.map(el => el.message).join(",")
		throw new ExpressError(msg, 400)
	} else {
		next();
	}
}

module.exports.isAuthor = async function(req, res, next){
	var {id}= req.params;
	var campground = await Campground.findById(id);
	if(!campground.author.equals(req.user._id)){
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}