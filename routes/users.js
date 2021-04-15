var express = require("express");
var router = express.Router();
var catchAsync = require("../utils/catchAsync");
var passport = require("passport");
var User = require("../models/user");
var users = require("../controllers/users");

// REGISTER
router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.register));

// LOGIN
router.get("/login", users.renderLogin);

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

// LOGOUT
router.get("/logout", users.logout);

module.exports = router;