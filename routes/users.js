var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.get("/register", function(req,res){
	res.render("users/register");
});

module.exports = router;