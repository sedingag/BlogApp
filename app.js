var express         = require("express");
var mongoose        = require("mongoose");
var bodyParser      = require("body-parser");
app                 = express();
var methodOverride  = require("method-override");

//App config
mongoose.connect('mongodb://localhost/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//Mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//Routes

app.get("/", (req,res) => {
    res.redirect("/blogs")
});

//Index route
app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log("Error!!!");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

//New route
app.get("/blogs/new", function(req,res){
    res.render("new");
})

//Create route
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }else {
            res.redirect("/blogs");
        }
    })
});

//Show route
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });  
});

//Edit route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog})
        }
    });
});

//Update route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/blogs")
            } else {
                res.redirect("/blogs/" + req.params.id)
            }

    })
});

//Delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })    
})





const port = process.env.PORT || 3000;
app.listen(port, () => console.log ("Server is running..."));

