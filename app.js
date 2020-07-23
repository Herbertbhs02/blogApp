//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/.env'})
const BAMBI_CONNECT = process.env.BAMBI_CONNECT
const homeStartingContent = "These are the latest posts below from various sources.";
const aboutContent = "";
const contactContent = "h.sev@tiscali.co.uk";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(BAMBI_CONNECT,
  { useNewUrlParser: true,
    useUnifiedTopology: true },
 (error)=>console.log(`Connection requested`))

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

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
        res.redirect("/");
    }
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

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

const port = process.env.port || 3000
app.listen(port, function() {
  console.log(`Server started on port: ${port} `);
});
