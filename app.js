const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _=require("lodash");
const app = express();
require('dotenv').config('/.env')
var jsdom = require("jsdom");
$ = require('jquery')(new jsdom.JSDOM().window);
mongoose.connect(process.env.MONGOURL);

const blogsSchema=new mongoose.Schema({
  title:String,
  content:String,
  content_2:String,
  img1:String,
  img2:String,
  refer:String
});

const adminSchema=new mongoose.Schema({
  user:String,
  password:String
});

const Admin=mongoose.model("Admin",adminSchema);

const Blog=mongoose.model("Blog",blogsSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// $("p").css("color","Red");
// $("button.suggestions").mouseenter(()=>{
//   console.log("clicked");
// })

app.get("/",function(req,res){
  Blog.find({},(err,dbcontent)=>{
    if(err)
     console.log(err);
     else{
       var i=dbcontent.length;
       i=i-1;
       //console.log(i);
       var latest_blog_title=dbcontent[i].title;
       var latest_blog_img=dbcontent[i].img1;
       var content1=dbcontent[i].content;
       var content2=dbcontent[i].content_2;
       var latest_blog_content=content1.concat(content2).substring(0,1800);
     }
       res.render('home',{title:latest_blog_title,img:latest_blog_img,content:latest_blog_content});
  });

});

app.get("/blogs",(req,res)=>{
  Blog.find({},(err,allblogs)=>{
    if(err)
      console.log(err);
    else{
      res.render('allblogs',{blogs:allblogs});
    }
  });
});
//app.get("/blog",(req,res)=> res.render("blog"));


app.get("/blogs/:name",(req,res)=>{
  let name=req.params.name;
  let nameM=_.lowerCase(name);
  let title;
  let content;
  let content_2;
  let img1;
  let img2;
  let refer;
  Blog.find({},(err,dbcontent)=>{
    if(err){
      console.log(err);
    }
    else{
      for(var i=0;i<dbcontent.length;i++){
        if(nameM===_.lowerCase(dbcontent[i].title)){
          title=dbcontent[i].title;
          content=dbcontent[i].content;
          content_2=dbcontent[i].content_2;
          img1=dbcontent[i].img1;
          img2=dbcontent[i].img2;
          refer=dbcontent[i].refer;
          break;
        }
      }
      res.render('blog',{blog_title:title,blog_content:content,blog_content_2:content_2,blog_img1:img1,blog_img2:img2,blog_refer:refer});
    }
  });

});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.post("/login",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  Admin.findOne({user:username},function(err,data){
    if(data===null)
      res.render("login");
    if(err)
      console.log(err);
    else{
      if(data){
        if(data.password===password)
           res.render("compose");
        else {
           res.render("login");
         }
      }
    }
  })

})


app.post("/compose",(req,res)=>{
  const title= req.body.title;
  const content= req.body.Content;
  const content_2=req.body.Content_2;
  const img1=req.body.img1;
  const img2=req.body.img2;
  const refer=req.body.refer;

blog = new Blog({
  title:title,
  content:content,
  content_2:content_2,
  img1:img1,
  img2:img2,
  refer:refer
});
blog.save();
//post.push(blog);

res.redirect("/");

});

app.get("/contact",(req,res)=>res.render('contact'));



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
