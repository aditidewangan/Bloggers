//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const aboutContent = "Hello, I'm Aditi Dewangan an Electrical and Electronic Engineer undergrad student pursuing my Bachelor's of Engineering degree from SSTC Bhilai, Chattisgarh by education.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-aditi:blogdb@cluster0.cvysp.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const contactSchema = {
  name : String,
  email : String,
  phone : String,
  message : String
};

const Post = mongoose.model("Post", postSchema);
const Contact = mongoose.model("Contact", contactSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/blog", function(req, res){

  var Search = req.query.search;

  if(Search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Post.find({title : regex}, function(err, post){
      if(err){
        console.log(err);
      }else{
      res.render("blog",{
        posts: post });
      };
    });
  }

  Post.find({},function(err,post){
    res.render("blog",{
      posts: post
    });
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.post("/delete" , function(req,res){
  const deleteId = req.body.delete;
  const postName = req.body.postName;

  Post.findByIdAndRemove(deleteId , function(err){
    if(!err){
      res.redirect("/admin");
    }
  })
});

app.get("/edits/:editId", function(req, res){

const requestedPostId = req.params.editId;

  Post.findOne({_id: requestedPostId}, function(err, edit){
    res.render("edit", {
      title: edit.title,
      content: edit.content,
      _id: edit._id
    });
  });
});

app.post("/edit", function(req, res){

  Post.findByIdAndUpdate({_id: req.body._id},
    {title: req.body.postTitle,
    content: req.body.postBody},
  function(err,post){
    if (!err){
        res.redirect("/admin");
      };
    });
});

app.get("/admin", function(req, res){

  var Search = req.query.search;

  if(Search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Post.find({title : regex}, function(err, post){
      if(err){
        console.log(err);
      }else{
      res.render("admin",{
        posts: post });
      };
    });
  }

  Post.find({}, function(err, post){
    res.render("admin", {
      posts: post
    });
  });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/admin");
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.post("/contact", function(req,res){

  const contact = new Contact({
  name : req.body.postName,
  email : req.body.postEmail,
  phone : req.body.postPhone,
  message : req.body.postMessage,
});

contact.save(function(err){
  if(!err){
    res.status(201).redirect("/blog");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
