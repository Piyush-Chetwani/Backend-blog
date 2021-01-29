var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');

mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser:true, useUnifiedTopology:true});

//APP Config
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose Config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

//Blog.create({
//	title: "Test Blog",
//	image: "hello",
//	body: "Hi there this is a test blog"
//});

//RESTful Routes 
app.get("/", function(req,res){
	res.redirect("/blogs");
});

// INDEX Routes
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log("Error!");
		} else {
			res.render("index.ejs",{blogs:blogs});
		}
	});
});


//NEW Route
app.get("/blogs/new", function(req,res){
	res.render("new.ejs");
});

//CREATE Route 
app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, blogs){
		if(err){
			res.render("new.ejs");
		} else{
			res.redirect("/blogs");
		}
	})
});

//SHOW Route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		} else{
			res.render("show", {blog:foundBlog})
		}
	})
});

//EDIT Route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog:foundBlog});
		}
	});
});

//UPDATE Route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DELETE Route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err, deletdBlog){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs")
		}
	})
})

app.listen(3000,function() {
	console.log("Server started on port 3000");
});
