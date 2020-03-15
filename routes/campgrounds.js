var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/");
//HOME
router.get("/",function(req,res){
	res.render("landing");
});
//CAMPGROUNDS PAGE
router.get("/campgrounds",function(req,res){

		Campground.find({},function(err,cam){
		if(err)
		{
			req.flash("error","Ooops!!Something went wrong :(");
		}
		else
		{
 			res.render("campgrounds/index",{campgrounds:cam,currentUser: req.user});
            
		}
	});
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
//CREATE
router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
 var author = {
 	id: req.user._id,
 	username: req.user.username
 };

  var x= {
  	name: req.body.name,
    price: req.body.price,
    image: req.body.img,
    description: req.body.description,
    author: author
};


Campground.create(x,function(err,c){
	if(err)
	{
		req.flash("error","Ooops!!Something went wrong :(");
	}
	else
	{
	   	req.flash("success","Campground Created Successfully!!!! :)");
      res.redirect("/campgrounds");		
	}
});
});

router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err)
		{
			req.flash("error","Ooops!!Something went wrong :(");
		}
		else
		{
			res.render("show.ejs",{campgrounds :foundCamp});
 		}
	});
	});
//Edit Campgrounds
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err,foundCampground){
		if(err)
		{
			req.flash("error","Ooops!!Something went wrong :(");
		}
		else
		{
		    res.render("campgrounds/edit",{campground:foundCampground});	
		}
});	
});
//Update Campgrounds
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });

});
//Delete Routes

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	  Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          req.flash("success","Campground Deleted Successfully!!!! :)")
          res.redirect("/campgrounds");
      }
   });
});



module.exports = router;