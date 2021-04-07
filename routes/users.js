var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var passport = require("passport");
var User = require("../models/user");

// REGISTER
router.get("/register", function(req,res){
	res.render("users/register");
});

router.post("/register", catchAsync(async function(req, res, next){
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
}));

// LOGIN
router.get("/login", function(req, res){
	res.render("users/login");
});

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), function(req, res){
	req.flash("success", "Welcome back!");
	res.redirect("/campgrounds");
});

// LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Goodbye!");
	res.redirect("/campgrounds");
});

module.exports = router;