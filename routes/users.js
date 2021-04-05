var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.get("/register", function(req,res){
	res.render("users/register");
});

router.post("/register", async function(req, res){
	var{email, username, password} = req.body;
	var user = new User({email, username});
	var registeredUser = await User.register(user, password);
	console.log(registeredUser);
	req.flash("success", "Welcome to VacayCamp!");
	res.redirect("/campgrounds");
});

module.exports = router;