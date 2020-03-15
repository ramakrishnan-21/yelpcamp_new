var express = require("express");
var app = express();
var mongoose = require('mongoose');
var request = require('request');
var flash = require("connect-flash");
var bodyParser = require('body-parser');
var Campground = require('./models/campground');
var seedDB = require('./seed');
var passport = require('passport');
var LocalStrategy = require("passport-local");
var User = require("./models/user"); 
var Comment = require('./models/comment')
var methodOverride = require("method-override");
//seedDB();


var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb+srv://ramakrishnan:Ramkri@01@cluster0-hdk17.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
   
}).then(() => {
    console.log("connect to DB!")
 
}).catch(err => {
    console.log("ERROR", err.message);
});
app.use(flash());
//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Dawyne Johnson",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
//PASSPORT CONFIG CONTINU......
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine","ejs");
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);
app.listen(3000,function(){
console.log("YelpCamp has started");
});