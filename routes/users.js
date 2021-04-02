var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.get("/register", function(req,res){
	res.render("users/register");
});

router.post("/register", async function(req, res){
	res.send(req.body);
});

module.exports = router;