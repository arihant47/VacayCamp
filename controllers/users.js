var User = require("../models/user");

module.exports.renderRegister = function(req,res){
	res.render("users/register");
}

module.exports.register = async function(req, res, next){
	try{
		var{email, username, password} = req.body;
		var user = new User({email, username});
		var registeredUser = await User.register(user, password);
		req.login(registeredUser, function(err){
			if(err) return next(err);
			req.flash("success", "Welcome to VacayCamp!");
			res.redirect("/campgrounds");
		});
	} catch(e) {
		req.flash("error", e.message);
		res.redirect("register");
	}
}

module.exports.renderLogin = function(req, res){
	res.render("users/login");
}

module.exports.login = function(req, res){
	req.flash("success", "Welcome back!");
	var redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

module.exports.logout = function(req, res){
	req.logout();
	req.flash("success", "Goodbye!");
	res.redirect("/campgrounds");
}