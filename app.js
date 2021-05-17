if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var ejsMate = require("ejs-mate");
var methodOverride = require("method-override");
var ExpressError = require("./utils/ExpressError");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var mongoSanitize = require("express-mongo-sanitize");
var helmet = require("helmet");
var app = express();

var userRoutes = require("./routes/users.js");
var campgroundRoutes = require("./routes/campgrounds");
var reviewRoutes = require("./routes/reviews");

mongoose.connect("mongodb://localhost/vacay-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

var sessionConfig = {
	name: 'session',
	secret: 'thisisasecret!',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({contentSecurityPolicy: false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));

app.use(mongoSanitize({
	replaceWith: '_'
}));

app.use(function(req, res, next){
	if(!['/login', '/'].includes(req.originalUrl)){
		req.session.returnTo = req.originalUrl;
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", function(req, res){
	res.render("home");
});

app.all("*", function(req, res, next){
	next(new ExpressError("Page not found!", 404))
});

app.use((err, req, res, next) => {
	const {statusCode = 500} = err;
	if(!err.message) err.message="Oh No, Something Went Wrong!"
	res.status(statusCode).render("error", {err});
});

app.listen(3000, function(){
	console.log("The VacayCamp Server has started");
});
