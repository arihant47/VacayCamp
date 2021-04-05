var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var User = require("../models/user");

router.get("/register", function(req,res){
	res.render("users/register");
});

router.post("/register", catchAsync(async function(req, res){
	try{
		var{email, username, password} = req.body;
		var user = new User({email, username});
		var registeredUser = await User.register(user, password);
		req.flash("success", "Welcome to VacayCamp!");
		res.redirect("/campgrounds");
	} catch(e) {
		req.flash("error", e.message);
		res.redirect("register");
	}
}));

module.exports = router;