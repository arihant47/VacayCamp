var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var passport = require("passport");
var User = require("../models/user");
var users = require("../controllers/users");

router.route("/register")
	.get(users.renderRegister)
	.post(catchAsync(users.register));

router.route("/login")
	.get(users.renderLogin)
	.post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

router.get("/logout", users.logout);

module.exports = router;