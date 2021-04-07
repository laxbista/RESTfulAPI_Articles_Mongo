const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Connect to DB
mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// Create article Schema
const articleSchema = {
  title: String,
  content: String
};

//Create article model
const Article = mongoose.model("Article", articleSchema);



//Chain all routes using express
//Requests targeting all articles
app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
    if (!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }

  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
      if (!err){
        res.send("Successfully deleted all articles");
      }else{
        res.send(err);
      }
    });
});
// //Fetch all the articles
// app.get("/articles", function(req,res){
//   Article.find(function(err,foundArticles){
//     if (!err){
//       res.send(foundArticles);
//     }else{
//       res.send(err);
//     }
//
//   });
// });

//Handles post request and save data received in DB
// app.post("/articles", function(req,res){
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//   newArticle.save(function(err){
//     if (!err){
//       res.send("Successfully added a new article");
//     }else{
//       res.send(err);
//     }
//   });
// });


//Handles delete request
// app.delete("/articles",function(req,res){
//     Article.deleteMany(function(err){
//       if (!err){
//         res.send("Successfully deleted all articles");
//       }else{
//         res.send(err);
//       }
//     });
// });


//Requests targeting specific articles---
app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles match found");
    }
  });
})

.put(function(req,res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);
      }
    }

  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted an article");
      }else{
        res.send(err);
      }
    }
  );
});






app.listen(3000, function(){
  console.log("Server stated at port 3000.");
});
